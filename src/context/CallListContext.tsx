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
  useEffect,
  useState,
} from 'react'
import {
  type ResponseError,
  type ActivityIdParams,
  type PhoneCallReturn,
  type PhoneCallType,
} from './types'
import { type PhoneCallResponseType } from '@/types'
import { toast } from '@components/ui/use-toast'

export type CallListContextType = {
  dispatch: React.Dispatch<Action>
  state: ReducerType
  archiveAllCalls: () => void
  unarchiveAllCalls: () => void
  unarchiveCall: (call: PhoneCallType) => void
  archiveCall: (call: PhoneCallType) => void
  getAllActivitiesQuery: UseQueryResult<PhoneCallResponseType[], ResponseError>
  updateActivityByIdMutation: UseMutationResult<
    unknown,
    ResponseError,
    ActivityIdParams
  >
  resetAllActivitiesMutation: UseMutationResult<
    PhoneCallResponseType[],
    ResponseError,
    void
  >
  isArchivingAllActivities: boolean
}

export const CallListContext = createContext<CallListContextType>(
  {} as CallListContextType
)

type Action =
  | { type: 'SET_DATA'; data: ReducerType }
  | { type: 'ARCHIVE_ACTIVITY'; id: string }
  | { type: 'UNARCHIVE_ACTIVITY'; id: string }
  | { type: 'UNARCHIVE_ALL_ACTIVITIES' }

type ReducerType = {
  dataMap: Map<string, PhoneCallType>
  groupedMap: PhoneCallReturn[]
  inboxStats: {
    inboxTotal: number
    errorTotal: number
  }
}

function reducer(state: ReducerType, action: Action): ReducerType {
  switch (action.type) {
    case 'SET_DATA':
      return action.data

    case 'ARCHIVE_ACTIVITY': {
      const activity = state.dataMap.get(action.id)
      activity!.is_archived = true

      return {
        ...state,
        dataMap: state.dataMap.set(action.id, activity!),
        inboxStats: {
          ...state.inboxStats,
          inboxTotal: state.inboxStats.inboxTotal - 1,
          errorTotal: activity!.isValid
            ? state.inboxStats.errorTotal
            : state.inboxStats.errorTotal - 1,
        },
      }
    }

    case 'UNARCHIVE_ACTIVITY': {
      const activity = state.dataMap.get(action.id)
      activity!.is_archived = false

      return {
        ...state,
        dataMap: state.dataMap.set(action.id, activity!),
        inboxStats: {
          ...state.inboxStats,
          inboxTotal: state.inboxStats.inboxTotal + 1,
          errorTotal: activity!.isValid
            ? state.inboxStats.errorTotal
            : state.inboxStats.errorTotal + 1,
        },
      }
    }

    case 'UNARCHIVE_ALL_ACTIVITIES': {
      const newDataMap = new Map(state.dataMap)
      newDataMap.forEach((e) => {
        e.is_archived = false
      })

      return {
        ...state,
        dataMap: newDataMap,
        inboxStats: {
          ...state.inboxStats,
          inboxTotal: newDataMap.size,
        },
      }
    }
  }
}

const INITIAL_STATE_DATA: ReducerType = {
  dataMap: new Map<string, PhoneCallType>(),
  groupedMap: [],
  inboxStats: {
    inboxTotal: 0,
    errorTotal: 0,
  },
}

const BACKEND_URL = import.meta.env.VITE_BACKEND

export default function CallListContextProvider({
  children,
}: PropsWithChildren) {
  const [isArchivingAllActivities, setArchivingAllActivities] = useState(false)
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE_DATA)

  const getAllActivitiesQuery = useQuery<
    PhoneCallResponseType[],
    ResponseError
  >({
    queryKey: ['calls'],
    queryFn: async () => {
      const { data } = await axios.get(`${BACKEND_URL}/activities`)
      return data as PhoneCallResponseType[]
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    // Retry only 2 times every 3 seconds
    retry: 2,
    retryDelay: 1000 * 3,
  })

  const updateActivityByIdMutation = useMutation<
    unknown,
    ResponseError,
    ActivityIdParams
  >({
    mutationKey: ['updateCall'],
    mutationFn: async (variables) => {
      const { data } = await axios.patch(
        `${BACKEND_URL}/activities/${variables.id}`,
        {
          is_archived: variables.is_archived,
        }
      )
      return data as PhoneCallResponseType
    },
    onSuccess: (_, variables) => {
      if (!variables.is_archived) {
        dispatch({
          type: 'UNARCHIVE_ACTIVITY',
          id: variables.id,
        })
      } else {
        dispatch({
          type: 'ARCHIVE_ACTIVITY',
          id: variables.id,
        })
      }
    },
  })

  const resetAllActivitiesMutation = useMutation<
    PhoneCallResponseType[],
    ResponseError
  >({
    mutationKey: ['resetAll'],
    mutationFn: async () => {
      const { data } = await axios.patch(`${BACKEND_URL}/reset`)
      return data as PhoneCallResponseType[]
    },
    onSuccess: () => {
      dispatch({ type: 'UNARCHIVE_ALL_ACTIVITIES' })
    },
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
    (call: PhoneCallType) =>
      updateActivityByIdMutation.mutateAsync({
        id: call.id,
        is_archived: false,
      }),
    [updateActivityByIdMutation]
  )

  const archiveCall = useCallback(
    (call: PhoneCallType) =>
      updateActivityByIdMutation.mutateAsync({
        id: call.id,
        is_archived: true,
      }),
    [updateActivityByIdMutation]
  )

  const archiveAllCalls = useCallback(() => {
    const arr = Array.from(state.dataMap)

    // Sanity check, make sure we can actually archive some calls
    if (!arr || arr.length === 0) {
      return
    }

    // Batch mutations into an array of promises
    const promises = arr
      .filter((e) => !e[1].is_archived)
      .map((e) =>
        updateActivityByIdMutation.mutateAsync({
          id: e[1].id,
          is_archived: true,
        })
      )

    setArchivingAllActivities(true)

    // Call batch mutations - Once settled, display an error if any activities could not be archived.
    // In this case, there will always be 7 activities that will fail as the invalid activities cannot be updated.
    Promise.allSettled(promises)
      .then((values) => {
        const errorResponses = values.filter((e) => e.status === 'rejected')

        if (errorResponses.length > 0) {
          return toast({
            variant: 'destructive',
            title: 'Error archiving call',
            description: `Could not archive ${errorResponses.length} activities.`,
          })
        }
        // Again, in this case, this should never be called unless the backend updates invalid calls.
        return toast({
          variant: 'default',
          title: 'Archived Activities',
          description: `All activities have been archived.`,
        })
      })
      .catch((error) => {
        console.error('Error archiving activities: ', error)
        return toast({
          variant: 'destructive',
          title: 'Error archiving activities',
          description: `Check the console for more information.`,
        })
      })
      .finally(() => {
        setArchivingAllActivities(false)
      })
  }, [state.dataMap, updateActivityByIdMutation])

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

  useEffect(() => {
    const phoneCalls = getAllActivitiesQuery.data

    // Don't dispatch if there isn't any data
    if (!phoneCalls || phoneCalls.length === 0) {
      return
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

        const foundMapEntry = accumulator.groupedMap.get(dateKey)
        if (foundMapEntry) {
          foundMapEntry.calls.push(phoneCall)
        } else {
          accumulator.groupedMap.set(dateKey, {
            time: dateKey,
            calls: [phoneCall],
          })
        }

        accumulator.dataMap.set(phoneCall.id, phoneCall)

        return accumulator
      },
      {
        groupedMap: new Map<string, PhoneCallReturn>(),
        dataMap: new Map<string, PhoneCallType>(),
        errorCount: 0,
        totalCount: 0,
      }
    )

    dispatch({
      type: 'SET_DATA',
      data: {
        dataMap: mappedData.dataMap,
        groupedMap: Array.from(mappedData.groupedMap.values()),
        inboxStats: {
          errorTotal: mappedData.errorCount,
          inboxTotal: mappedData.totalCount,
        },
      },
    })
  }, [
    getAllActivitiesQuery.data,
    getAllActivitiesQuery.status,
    hashPhoneCallKey,
    transformPhoneCall,
  ])

  const callListContextValue = useMemo(
    () => ({
      archiveAllCalls,
      unarchiveAllCalls,
      unarchiveCall,
      archiveCall,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,

      isArchivingAllActivities,
      dispatch,
      state,
    }),
    [
      archiveAllCalls,
      unarchiveAllCalls,
      unarchiveCall,
      archiveCall,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,

      isArchivingAllActivities,
      dispatch,
      state,
    ]
  )
  return (
    <CallListContext.Provider value={callListContextValue}>
      {children}
    </CallListContext.Provider>
  )
}
