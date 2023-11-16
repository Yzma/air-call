import useCallList from '@hooks/useCallList'
import { Fragment, useMemo } from 'react'
import { CallSeparator } from '@components/ui/call-separator'
import { UnarchiveAllCard } from '@components/cards/ArchiveCards'
import { CallCard } from '@components/cards/CallCard'
import { useNavigation } from '@hooks/useNavigation'
import LoadingCards from '@components/LoadingCards'
import { ErrorCard } from '@components/cards/ErrorCard'

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

    return (
      <>
        {nav.headerOption === 'archived' && <UnarchiveAllCard />}
        {call.allActivitiesData.data.map((e) => {
          const calls = e.calls.filter((e) => {
            return (
              (nav.excludeInvalidCalls ? e.isValid : true) && // If excludeInvalidCalls is true, then exclude all invalid calls (on both the inbox and archived page)
              (nav.headerOption === 'inbox' ? !e.is_archived : e.is_archived) // Only show call that aren't archived in the inbox tab, and only show archive calls in the archive tab
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
  }, [
    call.allActivitiesData,
    call.getAllActivitiesQuery.status,
    nav.excludeInvalidCalls,
    nav.headerOption,
  ])

  return <div className="flex flex-col gap-y-5">{inboxMemo}</div>
}
