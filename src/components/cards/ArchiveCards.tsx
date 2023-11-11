/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils'
import {
  ArchiveCard,
  ArchiveCardContent,
  ArchiveCardIcon,
  ArchiveCardText,
} from '@components/ui/archive-card'
import { faBoxArchive, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import useCallList from '@hooks/useCallList'
import React from 'react'

export const ArchiveAllCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const callList = useCallList()
  return (
    <ArchiveCard
      ref={ref}
      className={cn(className)}
      onClick={() => callList.archiveAllCalls()}
      {...props}
    >
      <ArchiveCardContent>
        <ArchiveCardIcon icon={faBoxArchive} />
        <ArchiveCardText>Archive all calls</ArchiveCardText>
      </ArchiveCardContent>
    </ArchiveCard>
  )
})
ArchiveAllCard.displayName = 'ArchiveAllCard'

export const UnarchiveAllCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const callList = useCallList()
  return (
    <ArchiveCard
      ref={ref}
      className={cn(className)}
      onClick={() => callList.unarchiveAllCalls()}
      {...props}
    >
      <ArchiveCardContent>
        <ArchiveCardIcon icon={faBoxOpen} />
        <ArchiveCardText>Unarchive all calls</ArchiveCardText>
      </ArchiveCardContent>
    </ArchiveCard>
  )
})
UnarchiveAllCard.displayName = 'UnarchiveAllCard'
