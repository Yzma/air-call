import useCallList from '@hooks/useCallList_old'
import { Fragment, useEffect, useMemo } from 'react'
import { CallSeparator } from '@components/ui/call-separator'
import {
  ArchiveAllCard,
  UnarchiveAllCard,
} from '@components/cards/ArchiveCards'
import { CallCard } from '@components/cards/CallCard'
import { useNavigation } from '@hooks/useNavigation'

export default function InboxPage() {
  const call = useCallList()
  const nav = useNavigation()

  // const { testMapObject } = useCallList()
  // // console.log('sortPhoneCallsObjectMEMO', call.sortPhoneCallsObjectMEMO)
  // // console.log('groupPhoneCallsObjectMEMO', call.groupPhoneCallsObjectMEMO)
  // console.log('MAP: ', call.testMapObject)

  // useEffect(() => {
  //   console.log('testMap updated')
  //   console.log('testMap', testMapObject)
  // }, [testMapObject])

  const meme = useMemo(() => {
    console.log('MEME Updated')
    return (
      <>
        {nav.headerOption === 0 ? <ArchiveAllCard /> : <UnarchiveAllCard />}
        {call.sortedArray.map((e) => {
          const calls = e.calls.filter((e) => {
            // const navv = nav.excludeInvalidCalls ? !e.isValid : true
            // const d = nav.headerOption === 0 ? !e.is_archived : e.is_archived
            return (
              (nav.excludeInvalidCalls ? e.isValid : true) &&
              (nav.headerOption === 0 ? !e.is_archived : e.is_archived)
            )
          })
          return (
            calls.length > 0 && (
              <Fragment key={e.time}>
                <CallSeparator>{e.time}</CallSeparator>
                {calls.map((call) => {
                  return <CallCard call={call} key={call.id} />
                })}
              </Fragment>
            )
          )
        })}
      </>
    )
  }, [call.sortedArray, nav.excludeInvalidCalls, nav.headerOption])

  return <div className="flex flex-col gap-y-5">{meme}</div>
}
