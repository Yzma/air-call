/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils'
import React from 'react'

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-grow border-t border-dashed border-gray-400',
      className
    )}
    {...props}
  />
))
Separator.displayName = 'Separator'

const CallSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div
    className="relative flex select-none items-center py-5"
    ref={ref}
    {...props}
  >
    <Separator />
    <p className="mx-4 flex-shrink text-lg font-bold text-gray-400">
      {children}
    </p>
    <Separator />
  </div>
))
CallSeparator.displayName = 'CallSeparator'

export { CallSeparator }
