import axios from 'axios'
import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
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
  type GroupedActivities,
  type ActivityType,
} from './types'
import { type ActivityResponseType } from '@/types'
import { toast } from '@components/ui/use-toast'

export type CallListContextType = {
  dispatch: React.Dispatch<Action>
  state: ReducerType
  archiveAllActivities: () => void
  unarchiveAllActivities: () => void
  getAllActivitiesQuery: UseQueryResult<ActivityResponseType[], ResponseError>
  updateActivityByIdMutation: UseMutationResult<
    unknown,
    ResponseError,
    ActivityIdParams
  >
  resetAllActivitiesMutation: UseMutationResult<
    ActivityResponseType[],
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

/**
 * dataMap: The actual cache of all the activities
 * groupedMap: An array of all the activities grouped by their date (for rendering)
 * inboxStats:
 *   inboxTotal: The amount of unarchived activities (Used by the footer to display the current count)
 *   errorTotal: The amount of invalid activities (Also used by the footer to display the current count)
 */
type ReducerType = {
  dataMap: Map<string, ActivityType>
  groupedMap: GroupedActivities[]
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
  dataMap: new Map<string, ActivityType>(),
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

  const getAllActivitiesQuery = useQuery<ActivityResponseType[], ResponseError>(
    {
      queryKey: ['activities'],
      queryFn: async () => {
        const { data } = await axios.get(`${BACKEND_URL}/activities`)
        return data as ActivityResponseType[]
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      // Retry only 2 times every 3 seconds
      retry: 2,
      retryDelay: 1000 * 3,
    }
  )

  const updateActivityByIdMutation = useMutation<
    unknown,
    ResponseError,
    ActivityIdParams
  >({
    mutationKey: ['updateActivity'],
    mutationFn: async (variables) => {
      const { data } = await axios.patch(
        `${BACKEND_URL}/activities/${variables.id}`,
        {
          is_archived: variables.is_archived,
        }
      )
      return data as ActivityResponseType
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
    ActivityResponseType[],
    ResponseError
  >({
    mutationKey: ['resetAll'],
    mutationFn: async () => {
      const { data } = await axios.patch(`${BACKEND_URL}/reset`)
      return data as ActivityResponseType[]
    },
    onSuccess: () => {
      dispatch({ type: 'UNARCHIVE_ALL_ACTIVITIES' })
    },
    onError() {
      return toast({
        variant: 'destructive',
        title: 'Error unarchiving activities',
        description: 'Could not unarchive all activities.',
      })
    },
  })

  const unarchiveAllActivities = useCallback(() => {
    resetAllActivitiesMutation.mutateAsync()
  }, [resetAllActivitiesMutation])

  const archiveAllActivities = useCallback(() => {
    const allArchivedActivities = Array.from(state.dataMap).filter(
      (e) => !e[1].is_archived
    )

    // Ensure we have activities to archive
    if (!allArchivedActivities || allArchivedActivities.length === 0) {
      return
    }

    // Batch mutations into an array of promises
    const mappedArchivePromises = allArchivedActivities.map((activity) =>
      updateActivityByIdMutation.mutateAsync({
        id: activity[1].id,
        is_archived: true,
      })
    )

    // Since we aren't using React Query to check the status, we manually update the state variable to indicate to other CallCards that we are archiving all activities
    setArchivingAllActivities(true)

    // Call batch mutations - Once settled, count the number of rejected (failed) responses and display an error if any activities could not be archived.
    // In this case, there will always be 7 activities that will fail as the invalid activities cannot be updated.
    Promise.allSettled(mappedArchivePromises)
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
        // Make sure to set this to false so cards aren't stuck in a loading state
        setArchivingAllActivities(false)
      })
  }, [state.dataMap, updateActivityByIdMutation])

  const transformActivity = useCallback((object: ActivityResponseType) => {
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
      } as ActivityType
    }

    return {
      id: object.id,
      created_at: createdAtDate,
      is_archived: object.is_archived,
      duration: object.duration,
      isValid: false,
    } as ActivityType
  }, [])

  const hashActivityKey = useCallback((activity: ActivityType) => {
    return activity.created_at.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [])

  useEffect(() => {
    const activities = getAllActivitiesQuery.data

    // Don't dispatch if there isn't any data
    if (!activities || activities.length === 0) {
      return
    }

    const mappedData = activities.reduceRight(
      (accumulator, entry) => {
        const activity = transformActivity(entry)
        const dateKey = hashActivityKey(activity)

        if (!activity.is_archived) {
          if (!activity.isValid) {
            accumulator.errorCount++
          }
          accumulator.totalCount++
        }

        const foundMapEntry = accumulator.groupedMap.get(dateKey)
        if (foundMapEntry) {
          foundMapEntry.activities.push(activity)
        } else {
          accumulator.groupedMap.set(dateKey, {
            time: dateKey,
            activities: [activity],
          })
        }

        accumulator.dataMap.set(activity.id, activity)

        return accumulator
      },
      {
        groupedMap: new Map<string, GroupedActivities>(),
        dataMap: new Map<string, ActivityType>(),
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
    hashActivityKey,
    transformActivity,
  ])

  const callListContextValue = useMemo(
    () => ({
      archiveAllActivities,
      unarchiveAllActivities,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,

      isArchivingAllActivities,
      dispatch,
      state,
    }),
    [
      archiveAllActivities,
      unarchiveAllActivities,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,
      isArchivingAllActivities,
      state,
    ]
  )
  return (
    <CallListContext.Provider value={callListContextValue}>
      {children}
    </CallListContext.Provider>
  )
}
