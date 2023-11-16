import { cn } from '@/lib/utils'
import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'

import {
  faCircleExclamation,
  faRotate,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useCallList from '@hooks/useCallList'
import React from 'react'

export const ErrorCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  const callList = useCallList()

  return (
    <Card className="bg-destructive text-white" ref={ref} {...props}>
      <CardContent>
        <div className="flex items-center gap-x-2">
          <FontAwesomeIcon icon={faCircleExclamation} className="h-4 w-4" />
          <p className="font-semibold text-white">Failed to fetch inbox.</p>
        </div>
        <Button
          variant={'destructive'}
          size={'sm'}
          className="bg-white text-red-500 hover:bg-gray-200"
          onClick={() => callList.getAllActivitiesQuery.refetch()}
          disabled={callList.getAllActivitiesQuery.fetchStatus === 'fetching'}
        >
          <FontAwesomeIcon
            icon={faRotate}
            className={cn(
              'mr-2 h-4 w-4',
              callList.getAllActivitiesQuery.fetchStatus === 'fetching' &&
                'animate-spin'
            )}
          />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
})
ErrorCard.displayName = 'ErrorCard'
