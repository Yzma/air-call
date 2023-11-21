import { Card, CardContent } from '@components/ui/card'
import {
  faArrowDown,
  faArrowUp,
  faBoxArchive,
  faBoxOpen,
  faCircleExclamation,
  faPhone,
  faPhoneSlash,
  faVoicemail,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type ActivityCardType } from './types'
import React, { useCallback, useMemo, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn, convertSeconds, getDateTime, getDateTimePeriod } from '@/lib/utils'
import { Button } from '@components/ui/button'
import useCallList from '@hooks/useCallList'
import { toast } from '@components/ui/use-toast'

export const CallCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ActivityCardType
>(({ activity, ...props }, ref) => {
  const callList = useCallList()
  const [locallyUpdating, setLocallyUpdating] = useState(false)

  const updateActivity = useCallback(async () => {
    // Remember to set locallyUpdating to true, and false when the query is finished
    setLocallyUpdating(true)
    return callList.updateActivityByIdMutation
      .mutateAsync(
        {
          id: activity.id,
          is_archived: !activity.is_archived,
        },
        {
          onError(_, variables) {
            return toast({
              variant: 'destructive',
              title: 'Error archiving call',
              description: `Could not ${
                variables.is_archived ? 'archive' : 'unarchive'
              } activity.`,
            })
          },
        }
      )
      .finally(() => setLocallyUpdating(false))
  }, [activity.id, activity.is_archived, callList])

  // isLoading is true if one of the three things are true:
  // 1. If locallyUpdating is true - trigger when a user tries to archive/unarchive the call by clicking the button to do so (calling updateCall())
  // 2. If the CallCard is not archived AND the user requested to archive all cards - This will happen when the user clicks the archive all button
  // 3. If the CallCard is archived AND resetAllActivitiesMutation is pending - This will happen when the user clicks the unarchive all button
  const isLoading = useMemo(() => {
    return (
      locallyUpdating ||
      (!activity.is_archived && callList.isArchivingAllActivities) ||
      (activity.is_archived &&
        callList.resetAllActivitiesMutation.status === 'pending')
    )
  }, [
    activity.is_archived,
    callList.isArchivingAllActivities,
    callList.resetAllActivitiesMutation.status,
    locallyUpdating,
  ])

  return (
    <>
      <Dialog>
        <Card
          ref={ref}
          className={cn(
            'px-0 py-2 pl-4 hover:bg-slate-50',
            isLoading &&
              'pointer-events-none cursor-none opacity-20 hover:bg-white'
          )}
          {...props}
        >
          <CardContent>
            <div className="flex items-center gap-x-3">
              <div className="relative">
                <DialogTrigger>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200">
                    {activity.isValid ? (
                      <div>
                        {activity.call_type === 'voicemail' ? (
                          <FontAwesomeIcon
                            icon={faVoicemail}
                            className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                          />
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={
                                activity.call_type === 'answered'
                                  ? faPhone
                                  : faPhoneSlash
                              }
                              className="h-4 w-4 text-gray-400 group-hover:text-gray-700"
                            />
                            <FontAwesomeIcon
                              icon={
                                activity.direction === 'inbound'
                                  ? faArrowDown
                                  : faArrowUp
                              }
                              className="absolute right-[0.45rem] top-[0.45rem] h-3 w-3 text-orange-500"
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="h-4 w-4 text-destructive"
                      />
                    )}
                  </div>
                </DialogTrigger>
              </div>
              <div className="w-auto overflow-hidden text-ellipsis text-xs">
                <p
                  className={cn(
                    'flex gap-x-1 font-bold text-black',
                    (!activity.isValid || activity.call_type === 'missed') &&
                      'text-destructive'
                  )}
                >
                  {activity.isValid ? activity.from : 'Unknown'}
                </p>
                <p className="line-clamp-1 overflow-hidden text-ellipsis text-gray-400 group-hover:text-gray-700">
                  tried to call {activity.isValid ? activity.to : 'Unknown'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-2 text-gray-400">
              <div
                className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:bg-gray-300"
                onClick={() => updateActivity()}
              >
                {activity.is_archived ? (
                  <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="h-4 w-4 text-gray-500 group-hover:text-gray-800"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faBoxArchive}
                    className="h-4 w-4 text-gray-500 group-hover:text-gray-800"
                  />
                )}
              </div>

              <div className="flex items-center gap-x-2">
                <div className="flex w-8 items-center justify-end group-hover:text-gray-700">
                  {getDateTime(activity.created_at)}
                </div>
                <div className="flex items-center border-y border-l px-1 text-xs font-bold group-hover:border-gray-300 group-hover:text-gray-700">
                  {getDateTimePeriod(activity.created_at)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogContent className="w-80">
          <DialogHeader>
            <DialogTitle>
              {activity.isValid ? activity.from : 'Unknown'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col">
              <div>
                {activity.created_at.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div>
                {activity.created_at.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
              <div>{convertSeconds(activity.duration)}</div>
              {activity.isValid && (
                <div>
                  {activity.direction === 'inbound' ? 'Inbound' : 'Outbound'}{' '}
                  Call
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  size={'sm'}
                  type="submit"
                  onClick={() => updateActivity()}
                >
                  {activity.is_archived ? <>Unarchive</> : <>Archive</>}
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
})
CallCard.displayName = 'CallCard'
