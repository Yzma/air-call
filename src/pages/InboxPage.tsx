import useCallList from '@hooks/useCallList'
import { Fragment, useMemo } from 'react'
import { CallSeparator } from '@components/ui/call-separator'
import { UnarchiveAllCard } from '@components/cards/ArchiveCards'
import { CallCard } from '@components/cards/CallCard'
import { useNavigation } from '@hooks/useNavigation'
import LoadingCards from '@components/LoadingCards'
import { ErrorCard } from '@components/cards/ErrorCard'
import { type PhoneCallReturn } from '@/context/types'

export default function InboxPage() {
  const call = useCallList()
  const nav = useNavigation()

  // Wrapped in a memo due to an unnecessary rerender happening when switching tabs in the footer.
  const inboxMemo = useMemo(() => {
    if (call.getAllActivitiesQuery.status === 'error') {
      return <ErrorCard />
    }

    if (call.getAllActivitiesQuery.status === 'pending') {
      return <LoadingCards />
    }
    console.log('state: ', call.state)

    // TODO: Optimize - remove this call, only loop once
    const arr = Array.from(call.state.dataMap.values())
    console.log('arr ', arr)

    const res = arr.reduceRight(
      (accumulator, entry) => {
        const phoneCall = call.transformPhoneCall(entry)
        const dateKey = call.hashPhoneCallKey(phoneCall)

        const foundMapEntry = accumulator.map.get(dateKey)
        if (foundMapEntry) {
          foundMapEntry.calls.push(phoneCall)
        } else {
          accumulator.map.set(dateKey, { time: dateKey, calls: [phoneCall] })
        }

        return accumulator
      },
      {
        map: new Map<string, PhoneCallReturn>(),
      }
    )

    console.log('res = ', res.map)

    const arrRes = Array.from(res.map.values())
    console.log('arrRes = ', arrRes)

    return (
      <>
        {nav.headerOption === 'archived' && <UnarchiveAllCard />}
        {arrRes.map((e) => {
          const calls = e.calls.filter((e) => {
            return (
              (nav.excludeInvalidCalls ? e.isValid : true) && // If excludeInvalidCalls is true, then exclude all invalid calls (on both the inbox and archived page)
              (nav.headerOption === 'inbox' ? !e.is_archived : e.is_archived) // Only show call that aren't archived in the inbox tab, and only show archive calls in the archive tab
            )
          })
          console.log('e = ', e)
          console.log('calls = ', calls)
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
  }, [call.state, nav.excludeInvalidCalls, nav.headerOption])

  return <div className="flex flex-col gap-y-5">{inboxMemo}</div>
}
