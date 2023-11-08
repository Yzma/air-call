/* eslint-disable react/prop-types */
import { Card, CardContent } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'
import React from 'react'

export const LoadingCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <Card ref={ref} {...props}>
    <CardContent>
      <div className="flex items-center gap-x-3">
        <Skeleton className="h-7 w-7 rounded-full bg-gray-200" />

        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-2 w-28 rounded-full bg-gray-200" />
          <Skeleton className="h-2 w-48 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-2">
        <Skeleton className="h-2 w-12 rounded-full bg-gray-200" />
        <Skeleton className="h-2 w-12 rounded-full bg-gray-200" />
      </div>
    </CardContent>
  </Card>
))
LoadingCard.displayName = 'LoadingCard'
