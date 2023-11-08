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

// {/* Start Call Card Component */}
// <div className="flex h-32 w-full px-5 py-12">
//   <div className="group flex h-16 w-full cursor-pointer select-none items-center rounded-xl border bg-white py-2 pl-4 text-sm text-black hover:bg-slate-100">
//     <div className="flex items-end gap-x-2">
//       <FontAwesomeIcon
//         icon={faBoxArchive}
//         className="h-4 w-4 text-gray-400 group-hover:text-gray-800"
//       />
//       <p className="font-semibold">Archive all calls</p>
//     </div>
//   </div>
// </div>
// {/* End Call Card Component */}
