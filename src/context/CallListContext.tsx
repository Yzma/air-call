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
  getAllActivitiesQuery: UseQueryResult<PhoneCallReturn[], ResponseError>
  updateActivityByIdMutation: UseMutationResult<
    PhoneCallResponseType,
    ResponseError,
    ActivityIdParams
  >
  resetAllActivitiesMutation: UseMutationResult<
    PhoneCallResponseType[],
    Error,
    void
  >
  allActivitiesData: CachedActivityData
}

export const CallListContext = createContext<CallListContextType>(
  {} as CallListContextType
)

export default function CallListContextProvider({
  children,
}: PropsWithChildren) {
  const queryClient = useQueryClient()

  const getAllActivitiesQuery = useQuery<
    PhoneCallResponseType[],
    ResponseError
  >({
    queryKey: ['calls'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/activities/')
      return data as PhoneCallResponseType[]
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // Retry only 2 times every 3 seconds
    retry: 2,
    retryDelay: 1000 * 3, // TODO: is this in milliseconds?
  })

  const updateActivityByIdMutation = useMutation<
    PhoneCallResponseType,
    ResponseError,
    ActivityIdParams
  >({
    mutationKey: ['updateCall'],
    mutationFn: async (variables) => {
      const { data } = await axios.patch(
        `http://localhost:5000/activities/${variables.id}`,
        {
          is_archived: variables.is_archived,
        }
      )
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calls'] }),
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

  const resetAllActivitiesMutation = useMutation<PhoneCallResponseType[]>({
    mutationKey: ['resetAll'],
    mutationFn: async () => {
      const { data } = await axios.patch(
        'http://localhost:5000/activities/reset'
      )
      return data
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
    resetAllActivitiesMutation.mutate()
  }, [resetAllActivitiesMutation])

  const unarchiveCall = useCallback(
    (call: PhoneCallType) => {
      console.log('unarchiveCall')
      updateActivityByIdMutation.mutate({ id: call.id, is_archived: false })
    },
    [updateActivityByIdMutation]
  )

  const archiveCall = useCallback(
    (call: PhoneCallType) => {
      updateActivityByIdMutation.mutate({ id: call.id, is_archived: true })
      console.log('unarchiveCall')
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

        return accumulator
      },
      { map: new Map<string, PhoneCallReturn>(), errorCount: 0, totalCount: 0 }
    )

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
    }),
    [
      allActivitiesData,
      getAllActivitiesQuery,
      archiveCall,
      unarchiveAllCalls,
      unarchiveCall,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,
    ]
  )
  return (
    <CallListContext.Provider value={callListContextValue}>
      {children}
    </CallListContext.Provider>
  )
}
