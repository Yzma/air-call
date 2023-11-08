import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'

import {
  faCircleExclamation,
  faRotate,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const ErrorCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <Card className="bg-destructive text-white" ref={ref} {...props}>
    {/* <div className="flex h-16 w-full select-none items-center rounded-xl border bg-red-500 p-3 text-sm text-black"> */}
    <CardContent>
      <div className="flex items-center gap-x-2">
        <FontAwesomeIcon icon={faCircleExclamation} className="h-4 w-4" />
        <p className="font-semibold text-white">Failed to fetch inbox.</p>
      </div>
      <Button
        variant={'destructive'}
        size={'sm'}
        className="bg-white text-red-500 hover:bg-gray-200"
      >
        <FontAwesomeIcon icon={faRotate} className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </CardContent>
  </Card>
))
ErrorCard.displayName = 'ErrorCard'
