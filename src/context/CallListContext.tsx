import { mockPhoneCalls } from '@/MockPhoneData'
import { type PhoneCallType } from '@hooks/useCallList_old'
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
  useState,
  useReducer,
} from 'react'
import {
  type ResponseError,
  type ActivityIdParams,
  type PhoneCallReturn,
} from './types'
import { type PhoneCallResponseType } from '@/types'

export type CallListContextType = {
  testMapObject: Record<string, PhoneCallType>
  archiveAllCalls: () => void
  unarchiveAllCalls: () => void
  unarchiveCall: (call: PhoneCallType) => void
  archiveCall: (call: PhoneCallType) => void
  getAllActivitiesQuery: UseQueryResult<PhoneCallReturn[], ResponseError>
  updateActivityByIdMutation: UseMutationResult<
    PhoneCallResponseType,
    ResponseError,
    ActivityIdParams,
    unknown
  >
  resetAllActivitiesMutation: UseMutationResult<
    PhoneCallResponseType[],
    Error,
    void,
    unknown
  >
}

export const CallListContext = createContext<CallListContextType>(
  {} as CallListContextType
)

type Todo = {
  id: number
  description: string
}

type State = {
  todos: Todo[]
}

const initialState: State = {
  todos: [],
}

export default function CallListContextProvider({
  children,
}: PropsWithChildren) {
  const queryClient = useQueryClient()

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

  const getAllActivitiesQuery = useQuery<PhoneCallReturn[], ResponseError>({
    queryKey: ['calls'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/activities/')
      console.log('NEW FETCH: ', data)
      const sortedData = sortAndTransform(data)
      return sortedData
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['calls'] }),
  })

  const resetAllActivitiesMutation = useMutation<PhoneCallResponseType[]>({
    mutationKey: ['resetAll'],
    mutationFn: async () => {
      const { data } = await axios.patch(
        'http://localhost:5000/activities/reset'
      )
      return data
    },
  })

  const sortAndTransform = useCallback(
    (phoneCalls: PhoneCallResponseType[]) => {
      // console.log('sortedArray')

      const mappedData = phoneCalls.reduceRight((accumulator, entry) => {
        const phoneCall = transformPhoneCall(entry)
        const dateKey = hashPhoneCallKey(phoneCall)

        const foundMapEntry = accumulator.get(dateKey)
        if (foundMapEntry) {
          foundMapEntry.calls.push(phoneCall)
        } else {
          accumulator.set(dateKey, { time: dateKey, calls: [phoneCall] })
        }

        return accumulator
      }, new Map<string, PhoneCallReturn>())

      return Array.from(mappedData.values())
    },
    [hashPhoneCallKey, transformPhoneCall]
  )

  const sortArray = useCallback(
    (phoneCalls: PhoneCallResponseType[]) => {
      // console.log('sortedArray')

      const mappedData = phoneCalls.reduceRight((accumulator, entry) => {
        const phoneCall = transformPhoneCall(entry)
        const dateKey = hashPhoneCallKey(phoneCall)

        const foundMapEntry = accumulator.get(dateKey)
        if (foundMapEntry) {
          foundMapEntry.calls.push(phoneCall)
        } else {
          accumulator.set(dateKey, { time: dateKey, calls: [phoneCall] })
        }

        return accumulator
      }, new Map<string, PhoneCallReturn>())

      return Array.from(mappedData.values())
    },
    [hashPhoneCallKey, transformPhoneCall]
  )

  const sortPhoneCallsObject = useCallback(
    (phoneCalls: PhoneCallResponseType[]) => {
      const mappedData = phoneCalls.reduceRight(
        (accumulator, entry) => {
          const phoneCall = transformPhoneCall(entry)
          accumulator[phoneCall.id] = phoneCall
          return accumulator
        },
        {} as Record<string, PhoneCallType>
      )

      return mappedData
    },
    [transformPhoneCall]
  )

  // const sortPhoneCallsObject = useCallback(() => {
  //   const mappedData = mockPhoneCalls.reduceRight(
  //     (accumulator, entry) => {
  //       const phoneCall = transformPhoneCall(entry)
  //       accumulator[phoneCall.id] = phoneCall
  //       return accumulator
  //     },
  //     {} as Record<string, PhoneCallType>
  //   )

  //   return mappedData
  // }, [transformPhoneCall])

  const reducer = (
    state: State,
    action: { type: string; payload: Todo }
  ): State => {
    switch (action.type) {
      case 'addTodo':
        console.log('reducer ran')
        // const neww = { haha: 'lol' }
        return {
          ...state,
        }
      default:
        throw new Error(`Unhandled action type: ${action.type}`)
    }
  }

  const [testMapObject, setTestMapObject] = useState<
    Record<string, PhoneCallType>
  >(sortPhoneCallsObject(mockPhoneCalls))

  // const archiveAllCalls = useCallback(() => {
  //   console.log('archiveAllCalls')
  //   setTestMapObject((prev) => {
  //     const copy = { ...prev }
  //     copy['haha'] = {
  //       haha: 'lol',
  //     }
  //     return {
  //       prev,
  //       ...copy,
  //     }
  //   })
  // }, [])

  const archiveAllCalls = useCallback(() => {
    console.log('archiveAllCalls')

    // dispatch({ type: 'addTodo', payload: 'Buy Milk' })
  }, [])

  const unarchiveAllCalls = useCallback(() => {
    console.log('unarchiveAllCalls')
  }, [])

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

  const [state, dispatch] = useReducer(reducer, initialState)

  const callListContextValue = useMemo(
    () => ({
      state,
      dispatch,
      sortPhoneCallsObject,
      testMapObject,
      archiveAllCalls,
      unarchiveAllCalls,
      unarchiveCall,
      archiveCall,
      getAllActivitiesQuery,
      updateActivityByIdMutation,
      resetAllActivitiesMutation,
    }),
    [
      getAllActivitiesQuery,
      archiveAllCalls,
      archiveCall,
      sortPhoneCallsObject,
      state,
      testMapObject,
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
