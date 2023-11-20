import axios from 'axios'
import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createContext,
  useMemo,
  type PropsWithChildren,
  useCallback,
  useReducer,
} from 'react'
import {
  type ResponseError,
  type ActivityIdParams,
  type PhoneCallReturn,
  type PhoneCallType,
  type CachedActivityData,
} from './types'
import { type PhoneCallResponseType } from '@/types'
import { toast } from '@components/ui/use-toast'

export type CallListContextType = {
  unarchiveAllCalls: () => void
  unarchiveCall: (call: PhoneCallType) => void
  archiveCall: (call: PhoneCallType) => void
  getAllActivitiesQuery: UseQueryResult<PhoneCallResponseType[], ResponseError>
  updateActivityByIdMutation: UseMutationResult<
    PhoneCallResponseType,
    ResponseError,
    ActivityIdParams
  >
  resetAllActivitiesMutation: UseMutationResult<
    PhoneCallResponseType[],
    ResponseError,
    void
  >
  allActivitiesData: CachedActivityData
}

export const CallListContext = createContext<CallListContextType>(
  {} as CallListContextType
)

type Action =
  | { type: 'SET_DATA'; data: ReducerType }
  | { type: 'UPDATE_ACTIVITY'; id: string; activity: PhoneCallType }
  | { type: 'BATCH_UPDATE_ACTIVITY'; id: string; activities: PhoneCallType[] }

type ReducerType = {
  dataMap: Map<string, PhoneCallType>
  inboxStats: {
    inboxTotal: number
    errorTotal: number
  }
}

function reducer(state: ReducerType, action: Action): ReducerType {
  switch (action.type) {
    case 'SET_DATA':
      return action.data
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        dataMap: state.dataMap.set(action.id, action.activity),
      }
    // TODO
    case 'BATCH_UPDATE_ACTIVITY':
      return {
        ...state,
      }
  }
}

const INITIAL_STATE_DATA: ReducerType = {
  dataMap: new Map<string, PhoneCallType>(),
  inboxStats: {
    inboxTotal: 0,
    errorTotal: 0,
  },
}

export default function CallListContextProvider({
  children,
}: PropsWithChildren) {
  const queryClient = useQueryClient()

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE_DATA)

  const getAllActivitiesQuery = useQuery<
    PhoneCallResponseType[],
    ResponseError
  >({
    queryKey: ['calls'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND}/activities`
      )
      return data as PhoneCallResponseType[]
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // Retry only 2 times every 3 seconds
    retry: 2,
    retryDelay: 1000 * 3,
  })

  const updateActivityByIdMutation = useMutation<
    PhoneCallResponseType,
    ResponseError,
    ActivityIdParams
  >({
    mutationKey: ['updateCall'],
    mutationFn: async (variables) => {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND}/activities/${variables.id}`,
        {
          is_archived: variables.is_archived,
        }
      )
      return data as PhoneCallResponseType
    },
    onSuccess: (_, variables) => {
      //queryClient.invalidateQueries({ queryKey: ['calls'] })
      console.log('variables: ', variables)

      const old = state.dataMap.get(variables.id)
      old!.is_archived = variables.is_archived

      console.log('SUCCESS')
      dispatch({
        type: 'UPDATE_ACTIVITY',
        id: old.id,
        activity: old!,
      })
    },
    onError(_, variables) {
      return toast({
        variant: 'destructive',
        title: 'Error archiving call',
        description: `Could not ${
          variables.is_archived ? 'archive' : 'unarchive'
        } activity.`,
      })
    },
  })

  const resetAllActivitiesMutation = useMutation<
    PhoneCallResponseType[],
    ResponseError
  >({
    mutationKey: ['resetAll'],
    mutationFn: async () => {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND}/reset`
      )
      return data as PhoneCallResponseType[]
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calls'] }),
    onError() {
      return toast({
        variant: 'destructive',
        title: 'Error unarchiving calls',
        description: 'Could not unarchive calls.',
      })
    },
  })

  const unarchiveAllCalls = useCallback(() => {
    resetAllActivitiesMutation.mutateAsync()
  }, [resetAllActivitiesMutation])

  const unarchiveCall = useCallback(
    (call: PhoneCallType) => {
      updateActivityByIdMutation.mutateAsync({
        id: call.id,
        is_archived: false,
      })
    },
    [updateActivityByIdMutation]
  )

  const archiveCall = useCallback(
    (call: PhoneCallType) => {
      updateActivityByIdMutation.mutateAsync({ id: call.id, is_archived: true })
    },
    [updateActivityByIdMutation]
  )

  const transformPhoneCall = useCallback((object: PhoneCallResponseType) => {
    const createdAtDate = new Date(object.created_at)
    if (
      object.call_type &&
      object.direction &&
      object.from !== undefined &&
      object.to !== undefined &&
      object.via !== undefined
    ) {
      return {
        ...object,
        isValid: true,
        created_at: createdAtDate,
      } as PhoneCallType
    }

    return {
      id: object.id,
      created_at: createdAtDate,
      is_archived: object.is_archived,
      duration: object.duration,
      isValid: false,
    } as PhoneCallType
  }, [])

  const hashPhoneCallKey = useCallback((call: PhoneCallType) => {
    return call.created_at.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [])

  const allActivitiesData = useMemo<CachedActivityData>(() => {
    const phoneCalls = getAllActivitiesQuery.data
    if (!phoneCalls || phoneCalls.length === 0) {
      return {
        data: [],
        inboxStats: {
          errorCount: 0,
          totalCount: 0,
        },
      }
    }

    const mappedData = phoneCalls.reduceRight(
      (accumulator, entry) => {
        const phoneCall = transformPhoneCall(entry)
        const dateKey = hashPhoneCallKey(phoneCall)

        if (!phoneCall.is_archived) {
          if (!phoneCall.isValid) {
            accumulator.errorCount++
          }
          accumulator.totalCount++
        }

        const foundMapEntry = accumulator.map.get(dateKey)
        if (foundMapEntry) {
          foundMapEntry.calls.push(phoneCall)
        } else {
          accumulator.map.set(dateKey, { time: dateKey, calls: [phoneCall] })
        }

        accumulator.dataMap.set(phoneCall.id, phoneCall)

        return accumulator
      },
      {
        map: new Map<string, PhoneCallReturn>(),
        dataMap: new Map<string, PhoneCallType>(),
        errorCount: 0,
        totalCount: 0,
      }
    )

    dispatch({
      type: 'SET_DATA',
      data: {
        dataMap: mappedData.dataMap,
        inboxStats: {
          errorTotal: mappedData.errorCount,
          inboxTotal: mappedData.totalCount,
        },
      },
    })

    return {
      data: Array.from(mappedData.map.values()),
      inboxStats: {
        errorCount: mappedData.errorCount,
        totalCount: mappedData.totalCount,
      },
    }
  }, [getAllActivitiesQuery.data, hashPhoneCallKey, transformPhoneCall])

  const callListContextValue = useMemo(
    () => ({
      unarchiveAllCalls,
      unarchiveCall,
      archiveCall,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,
      allActivitiesData,

      dispatch,
      state,
      transformPhoneCall,
      hashPhoneCallKey,
    }),
    [
      unarchiveAllCalls,
      unarchiveCall,
      archiveCall,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,
      allActivitiesData,

      dispatch,
      state,
      transformPhoneCall,
      hashPhoneCallKey,
    ]
  )
  return (
    <CallListContext.Provider value={callListContextValue}>
      {children}
    </CallListContext.Provider>
  )
}
