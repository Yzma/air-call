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
  console.log('asd')
  const meme = useMemo(() => {
    if (call.getAllActivitiesQuery.status === 'error') {
      return <ErrorCard />
    }

    if (call.getAllActivitiesQuery.status === 'pending') {
      return <LoadingCards />
    }

    const data = Array.from(call.getAllActivitiesQuery.data.values())

    return (
      <>
        {nav.headerOption === 'archived' && <UnarchiveAllCard />}
        {data.map((e) => {
          const calls = e.calls.filter((e) => {
            return (
              (nav.excludeInvalidCalls ? e.isValid : true) &&
              (nav.headerOption === 'inbox' ? !e.is_archived : e.is_archived)
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
    call.getAllActivitiesQuery.data,
    call.getAllActivitiesQuery.status,
    nav.excludeInvalidCalls,
    nav.headerOption,
  ])

  return <div className="flex flex-col gap-y-5">{meme}</div>
}
