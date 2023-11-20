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
  archiveAllCalls: () => void
  unarchiveCall: (callId: string) => void
  archiveCall: (callId: string) => void
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
    retry: false,
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

  const unarchiveCall = useCallback(
    (id: string) => {
      updateActivityByIdMutation.mutateAsync({
        id,
        is_archived: false,
      })
    },
    [updateActivityByIdMutation]
  )

  const archiveCall = useCallback(
    (id: string) => {
      updateActivityByIdMutation.mutate({ id, is_archived: true })
    },
    [updateActivityByIdMutation]
  )

  const archiveAllCalls = useCallback(async () => {
    // Sanity check, make sure we can actually archive some calls
    if (
      !getAllActivitiesQuery.data ||
      getAllActivitiesQuery.data.length === 0
    ) {
      return
    }

    // Batch mutations into an array of promises
    const promises = getAllActivitiesQuery.data
      .filter((e) => !e.is_archived)
      .map((e) =>
        updateActivityByIdMutation.mutateAsync({
          id: e.id,
          is_archived: true,
        })
      )

    // Call batch mutations - Once settled, display an error if any activities could not be archived.
    // In this case, there will always be 7 activities that will fail as the invalid activities cannot be updated.
    Promise.allSettled(promises)
      .then((values) => {
        // Invalidate all calls - refetch all activities
        queryClient.invalidateQueries({ queryKey: ['calls'] })

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
  }, [getAllActivitiesQuery.data, queryClient, updateActivityByIdMutation])

  const unarchiveAllCalls = useCallback(() => {
    resetAllActivitiesMutation.mutateAsync()
  }, [resetAllActivitiesMutation])

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
      archiveAllCalls,
      unarchiveAllCalls,
      unarchiveCall,
      archiveCall,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,
      allActivitiesData,
    }),
    [
      archiveAllCalls,
      unarchiveAllCalls,
      unarchiveCall,
      archiveCall,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,
      allActivitiesData,
    ]
  )
  return (
    <CallListContext.Provider value={callListContextValue}>
      {children}
    </CallListContext.Provider>
  )
}
