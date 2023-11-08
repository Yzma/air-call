import { mockPhoneCalls, type PhoneCallResponseType } from '@/MockPhoneData'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

export type PhoneCallType = {
  created_at: Date
} & Pick<PhoneCallResponseType, 'id' | 'is_archived' | 'duration'> &
  (
    | (Required<
        Pick<
          PhoneCallResponseType,
          'direction' | 'from' | 'to' | 'via' | 'call_type'
        >
      > & {
        isValid: true
      })
    | {
        isValid: false
      }
  )

type PhoneCallReturn = {
  time: string
  calls: PhoneCallType[]
}

export default function useCallList() {
  const mockDataMemo = useMemo(() => {
    return mockPhoneCalls
  }, [])

  // const [testMap, setTestMap] = useState<Map<string, PhoneCallReturn>>(
  //   sortPhoneCalls()
  // )

  const archiveAllCalls = useCallback(() => {
    console.log('archiveAllCalls')
  }, [])
  const unarchiveAllCalls = useCallback(() => {
    console.log('unarchiveAllCalls')
  }, [])

  const unarchiveCall = useCallback((call: PhoneCallType) => {
    console.log('unarchiveCall')
  }, [])

  const hashPhoneCallKey = useCallback((call: PhoneCallType) => {
    return call.created_at.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [])

  // Using
  const sortPhoneCallsObject = useCallback(() => {
    const mappedData = mockPhoneCalls.reduceRight(
      (accumulator, entry) => {
        const phoneCall = transformPhoneCall(entry)
        accumulator[phoneCall.id] = phoneCall
        return accumulator
      },
      {} as Record<string, PhoneCallType>
    )

    return mappedData
  }, [])

  // Using
  const sortPhoneCallsObjectMEMO = useMemo(() => {
    return sortPhoneCallsObject()
  }, [sortPhoneCallsObject])

  // Using
  const groupPhoneCallsObject = useCallback(() => {
    const mappedData = mockPhoneCalls.reduceRight((accumulator, entry) => {
      const phoneCall = transformPhoneCall(entry)
      const dateKey = hashPhoneCallKey(phoneCall)

      const foundMapEntry = accumulator.get(dateKey)
      if (foundMapEntry) {
        foundMapEntry.push(phoneCall)
      } else {
        accumulator.set(dateKey, [phoneCall])
      }

      return accumulator
    }, new Map<string, PhoneCallType[]>())

    return mappedData
  }, [hashPhoneCallKey])

  // Using
  const groupPhoneCallsObjectMEMO = useMemo(() => {
    return groupPhoneCallsObject()
  }, [groupPhoneCallsObject])

  const [testMapObject, setTestMapObject] = useState<
    Record<string, PhoneCallType>
  >(sortPhoneCallsObject())

  function archiveCall(call: PhoneCallType) {
    console.log('archiveCall ', call.id)
    setTestMapObject((prevState) => ({
      ...prevState,
      [call.id]: { haha: 'lol ' },
    }))

    console.log(testMapObject)
  }

  // const archiveCall = useCallback(
  //   (call: PhoneCallType) => {
  //     console.log('archiveCall ', call.id)
  //     const copy = { ...testMapObject }
  //     copy[call.id] = { hehe: 'lol' }
  //     setTestMapObject((prev) => {
  //       return {
  //         ...prev,
  //         ...copy,
  //       }
  //     })
  //     console.log(testMapObject)
  //   },
  //   [testMapObject]
  // )

  // const sortPhoneCallsObjectFunctionTest = useCallback(() => {
  //   function sortPhoneCalls() {
  //     // eslint-disable-next-line react-hooks/rules-of-hooks
  //     return React.useMemo(() => 5, [])
  //   }
  // }, [])

  // const sortPhoneCallsHashMap = useCallback(() => {
  //   const mappedData = mockPhoneCalls.reduceRight((accumulator, entry) => {
  //     const phoneCall = transformPhoneCall(entry)

  //     accumulator.set(phoneCall.id, phoneCall)

  //     return accumulator
  //   }, new Map<string, PhoneCallType>())

  //   return mappedData
  // }, [])

  function sortPhoneCalls() {
    const mappedData = mockPhoneCalls.reduceRight((accumulator, entry) => {
      const phoneCall = transformPhoneCall(entry)
      const dateKey = phoneCall.created_at.toLocaleString('default', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

      const foundMapEntry = accumulator.get(dateKey)
      if (foundMapEntry) {
        foundMapEntry.calls.push(phoneCall)
      } else {
        accumulator.set(dateKey, { time: dateKey, calls: [phoneCall] })
      }

      return accumulator
    }, new Map<string, PhoneCallReturn>())

    return mappedData
  }

  function sortPhoneCallsOBJECT() {
    const mappedData = mockPhoneCalls.reduceRight(
      (accumulator, entry) => {
        const phoneCall = transformPhoneCall(entry)
        const dateKey = hashPhoneCallKey(phoneCall)

        const foundMapEntry = accumulator[dateKey]
        if (foundMapEntry) {
          foundMapEntry.calls.push(phoneCall)
        } else {
          accumulator[dateKey] = { time: dateKey, calls: [phoneCall] }
        }

        return accumulator
      },
      {} as Record<string, PhoneCallReturn>
    )

    return mappedData
  }

  // const [state, dispatch] = useReducer(reducer, {
  //   state: sortPhoneCallsOBJECT(),
  // })

  /*
    Structure:
    [
      {
        time: 'June 17, 2012,
        objects: [
          {...},
          {...}
        ]
      }
    ],

    time: 'June 17, 2012,
      objects: [
        {...},
        {...}
      ],


       'June 17, 2012': objects: [
        {...},
        {...}
      ]
  */

  // TODO: useCallback
  function transformPhoneCall(object: PhoneCallResponseType): PhoneCallType {
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
    }
  }

  // TODO: Find out why this is being called a lot
  const sortedArray = useMemo(() => {
    // console.log('sortedArray')

    const mappedData = mockDataMemo.reduceRight((accumulator, entry) => {
      const phoneCall = transformPhoneCall(entry)
      const dateKey = phoneCall.created_at.toLocaleString('default', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

      const foundMapEntry = accumulator.get(dateKey)
      if (foundMapEntry) {
        foundMapEntry.calls.push(phoneCall)
      } else {
        accumulator.set(dateKey, { time: dateKey, calls: [phoneCall] })
      }

      return accumulator
    }, new Map<string, PhoneCallReturn>())

    return Array.from(mappedData.values())
  }, [mockDataMemo])

  return {
    // state,
    // dispatch,
    testMapObject,
    // testMap,
    groupPhoneCallsObject,
    sortPhoneCallsObject,
    sortPhoneCallsObjectMEMO,
    groupPhoneCallsObjectMEMO,
    // sortPhoneCallsHashMap,
    archiveAllCalls,
    unarchiveAllCalls,
    archiveCall,
    unarchiveCall,
    mockDataMemoRaw: mockDataMemo,
    sortedArray,
  }
}
// const mockDataMemo2 = useMemo(() => {
//   console.log('mockDataMemo2')

//   const mappedData = mockData.current.reduceRight((accumulator, entry) => {
//     const phoneCall = transformPhoneCall(entry)
//     if (nav.excludeInvalidCalls && !phoneCall.isValid) {
//       return accumulator
//     }
//     const dateKey = phoneCall.created_at.toLocaleString('default', {
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric',
//     })

//     const foundMapEntry = accumulator.get(dateKey)
//     if (foundMapEntry) {
//       foundMapEntry.calls.push(phoneCall)
//     } else {
//       accumulator.set(dateKey, { time: dateKey, calls: [phoneCall] })
//     }

//     return accumulator
//   }, new Map<string, PhoneCallReturn>())

//   return Array.from(mappedData.values())
// }, [mockData, nav.excludeInvalidCalls])

// const mapRef = useRef(new Map<string, PhoneCallReturn>())

// const mockDataMemo1 = useMemo(() => {
//   const data: { [key: string]: PhoneCallResponseType[] } = mockData.reduce(
//     (
//       acc: { [key: string]: PhoneCallResponseType[] },
//       el: PhoneCallResponseType
//     ) => {
//       // const id = el.id
//       const date = new Date(el.created_at)
//       const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
//       // console.log('date: ', dateKey)
//       if (!acc[dateKey]) {
//         acc[dateKey] = []
//       }
//       acc[dateKey].push(el)
//       return acc
//     },
//     {}
//   )
//   return data
// }, [mockData])

// v3
// console.log('mockDataMemo2')
// const arr = mockData
//   .map((entry) => transformPhoneCall(entry))
//   .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
// const mappedData = arr.reduce((accumulator, currentValue) => {
//   const dateKey = currentValue.created_at.toLocaleString('default', {
//     month: 'long',
//     day: 'numeric',
//     year: 'numeric',
//   })
//   const foundMapEntry = accumulator.get(dateKey)
// if (foundMapEntry) {
//   foundMapEntry.calls.push(currentValue)
// } else {
//   accumulator.set(dateKey, { time: dateKey, calls: [currentValue] })
// }
//   return accumulator
// }, new Map<string, PhoneCallReturn>())
// return mappedData
//  v2
// const mockDataMemo2 = useMemo(() => {
//   console.log('mockDataMemo2')
//   const mappedData = mockData
//     .map((entry) => transformPhoneCall(entry))
//     .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
//     .reduce((accumulator, currentValue) => {
//       const dateKey = currentValue.created_at.toLocaleString('default', {
//         month: 'long',
//         day: 'numeric',
//         year: 'numeric',
//       })
//       const foundMapEntry = accumulator.get(dateKey)
//       if (foundMapEntry) {
//         foundMapEntry.push(currentValue)
//       } else {
//         accumulator.set(dateKey, [currentValue])
//       }
//       return accumulator
//     }, new Map<string, PhoneCallType[]>())
//   return mappedData
//
//
//
// mockData.forEach((entry) => {
//   const phoneCall = transformPhoneCall(entry)
// const dateKey = phoneCall.created_at.toLocaleString('default', {
//   month: 'long',
//   day: 'numeric',
//   year: 'numeric',
// })
//   //const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
//   // const timePeriod = date.getHours() >= 12 ? 'PM' : 'AM'
//   // const minutes = date.getMinutes()
//   // const minutesWithZero = (minutes < 10 ? '0' : '') + minutes
//   const foundMapEntry = callListMap.get(dateKey)
// if (foundMapEntry) {
//   foundMapEntry.push(phoneCall)
// } else {
//   callListMap.set(dateKey, [phoneCall])
// }
// })
// return callListMap

// const sortMockData = useCallback(() => {
//   console.log('called here lol')
//   const data: { [key: string]: PhoneCallType[] } = mockData.reduce(
//     (acc: { [key: string]: PhoneCallType[] }, el: PhoneCallType) => {
//       const date = new Date(el.created_at)
//       const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
//       if (!acc[dateKey]) {
//         acc[dateKey] = []
//       }
//       acc[dateKey].push(el)
//       return acc
//     },
//     {}
//   )
//   return data
// }, [mockData])
