/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils'
import React from 'react'

const SectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-primary-text text-2xl font-bold', className)}
    {...props}
  />
))
SectionTitle.displayName = 'SectionTitle'

const SectionDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-secondary-text text-sm', className)}
    {...props}
  />
))
SectionDescription.displayName = 'SectionDescription'

export { SectionTitle, SectionDescription }

{
  /* 
  Account
  <div className="flex flex-col gap-y-4">
<div className="flex flex-col gap-y-1">
  <p className="text-lg font-bold text-black">Email</p>
  <p className="text-xs text-gray-600">
    Excepteur sint occaecat cupidatat non proident sunt in culpa qui
    officia.
  </p>
</div>
<div className="flex items-center gap-x-2">
  <input className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-7 rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
  <button className="ring-offset-background focus-visible:ring-ring inline-flex h-7 items-center justify-center gap-x-2 whitespace-nowrap rounded-md border bg-white px-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90">
    Change
  </button>
</div>
</div> */
}

{
  /* <div>
          <p className="mb-4 select-none text-2xl font-bold">
            My Notifications
          </p>
        </div>
        <div>
          <p className="select-none text-2xl font-bold">General</p>
        </div>
        <div className="flex select-none justify-between gap-x-1 border-b py-2">
          <div>
            <p className="font-bold">Comments and replies</p>
            <p className="text-sm">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit.
            </p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" value="" className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
            </label>
          </div>
        </div> */
}
