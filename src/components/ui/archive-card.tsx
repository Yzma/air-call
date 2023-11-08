/* eslint-disable react/prop-types */
import React from 'react'
import { Card, CardContent } from './card'
import { cn } from '@/lib/utils'
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'

const ArchiveCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn('cursor-pointer px-0 py-2 pl-4 hover:bg-gray-100', className)}
    {...props}
  />
))
ArchiveCard.displayName = 'ArchiveCard'

const ArchiveCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn('justify-normal gap-x-2', className)}
    {...props}
  />
))
ArchiveCardContent.displayName = 'ArchiveCardContent'

const ArchiveCardIcon = ({
  className,
  icon,
  ...props
}: FontAwesomeIconProps) => (
  <FontAwesomeIcon
    icon={icon}
    className={cn('h-4 w-4 text-gray-400 group-hover:text-gray-800', className)}
    {...props}
  />
)
ArchiveCardIcon.displayName = 'ArchiveCardIcon'

const ArchiveCardText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('font-semibold', className)} {...props} />
))
ArchiveCardText.displayName = 'ArchiveCardText'

export { ArchiveCard, ArchiveCardContent, ArchiveCardIcon, ArchiveCardText }
