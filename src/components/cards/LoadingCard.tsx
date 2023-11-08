/* eslint-disable react/prop-types */
import { Card, CardContent } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'
import React from 'react'

// export default function LoadingCard() {
//   return (
//     <Card>
//       <CardContent>
//         <div className="flex items-center gap-x-3">
//           <Skeleton className="h-7 w-7 rounded-full bg-gray-200" />

//           <div className="flex flex-col gap-y-2">
//             <Skeleton className="h-2 w-28 rounded-full bg-gray-200" />
//             <Skeleton className="h-2 w-48 rounded-full bg-gray-200" />
//           </div>
//         </div>
//         <div className="flex flex-col items-center justify-center gap-y-2">
//           <Skeleton className="h-2 w-12 rounded-full bg-gray-200" />
//           <Skeleton className="h-2 w-12 rounded-full bg-gray-200" />
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

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

{
  /* <div className="flex w-full select-none px-5 py-2">
<div className="flex h-16 w-full items-center justify-between rounded-xl border bg-white px-4 py-2 text-sm text-black">
  <div className="flex items-center gap-x-3">
    <div className="h-7 w-7 rounded-full bg-gray-200" />

    <div className="flex flex-col gap-y-2">
      <div className="h-2 w-28 rounded-full bg-gray-200" />
      <div className="h-2 w-48 rounded-full bg-gray-200" />
    </div>
  </div>
  <div className="flex flex-col items-center justify-center gap-y-2">
    <div className="h-2 w-12 rounded-full bg-gray-200" />
    <div className="h-2 w-12 rounded-full bg-gray-200" />
  </div>
</div>
</div> */
}
