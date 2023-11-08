import useCallList from '@hooks/useCallList'
import { Fragment, useMemo } from 'react'
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

  // console.log('testMapObject (Normal)', call.testMapObject)
  console.log('testMapObject (Normal)', call.state)

  const meme = useMemo(() => {
    console.log('MEME Updated')
    console.log('testMapObject (FROM MEME)', call.state)
    // console.log('testMapObject (FROM MEME)', call.testMapObject)
    return (
      <>
        {nav.headerOption === 'inbox' ? (
          <ArchiveAllCard />
        ) : (
          <UnarchiveAllCard />
        )}
        {/* {call.testMapObject.map((e) => {
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
        })} */}
      </>
    )
  }, [call.state, nav.headerOption])

  return <div className="flex flex-col gap-y-5">{meme}</div>
}
