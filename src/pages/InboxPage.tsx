import useCallList from '@hooks/useCallList'
import { Fragment, useMemo } from 'react'
import { CallSeparator } from '@components/ui/call-separator'
import {
  ArchiveAllCard,
  UnarchiveAllCard,
} from '@components/cards/ArchiveCards'
import { CallCard } from '@components/cards/CallCard'
import { useNavigation } from '@hooks/useNavigation'
import LoadingCards from '@components/LoadingCards'
import { ErrorCard } from '@components/cards/ErrorCard'

export default function InboxPage() {
  const callList = useCallList()
  const nav = useNavigation()

  // Wrapped in a memo due to an unnecessary rerender happening when switching tabs in the footer.
  const inboxMemo = useMemo(() => {
    if (callList.getAllActivitiesQuery.status === 'error') {
      return <ErrorCard />
    }

    if (callList.getAllActivitiesQuery.status === 'pending') {
      return <LoadingCards />
    }

    return (
      <>
        {nav.headerOption === 'inbox' ? (
          <ArchiveAllCard />
        ) : (
          <UnarchiveAllCard />
        )}
        {callList.state.groupedMap.map((e) => {
          const activities = e.activities.filter((e) => {
            return (
              (nav.excludeInvalidActivities ? e.isValid : true) && // If excludeInvalidCalls is true, then exclude all invalid calls (on both the inbox and archived page)
              (nav.headerOption === 'inbox' ? !e.is_archived : e.is_archived) // Only show call that aren't archived in the inbox tab, and only show archive calls in the archive tab
            )
          })
          return (
            activities.length > 0 && (
              <Fragment key={e.time}>
                <CallSeparator>{e.time}</CallSeparator>
                {activities.map((activity) => {
                  return <CallCard activity={activity} key={activity.id} />
                })}
              </Fragment>
            )
          )
        })}
      </>
    )
  }, [
    callList.getAllActivitiesQuery.status,
    callList.state,
    nav.excludeInvalidActivities,
    nav.headerOption,
  ])

  return <div className="flex flex-col gap-y-5">{inboxMemo}</div>
}
