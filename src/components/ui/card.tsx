/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils'
import React from 'react'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group flex h-16 w-full select-none items-center justify-between rounded-xl border bg-white px-4 py-2 text-sm text-black',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex w-full items-center justify-between', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

export { Card, CardContent }
