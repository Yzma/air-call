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
import { type PhoneCallCardType } from './types'
import React, { useCallback, useMemo } from 'react'
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
import {
  type Mutation,
  useMutationState,
  type DefaultError,
  useQueryClient,
} from '@tanstack/react-query'
import { type PhoneCallResponseType } from '@/types'
import { type ActivityIdParams } from '@/context/types'
import { toast } from '@components/ui/use-toast'

export const CallCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & PhoneCallCardType
>(({ call, ...props }, ref) => {
  const queryClient = useQueryClient()
  const callList = useCallList()
  const variables = useMutationState<string>({
    filters: { mutationKey: ['updateCall'], status: 'pending' },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    select: (
      mutation: Mutation<PhoneCallResponseType, DefaultError, ActivityIdParams>
    ) => {
      return mutation.state.variables?.id
    },
  })

  const updateCall = useCallback(() => {
    return callList.updateActivityByIdMutation.mutate(
      {
        id: call.id,
        is_archived: !call.is_archived,
      },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calls'] }),
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
  }, [
    call.id,
    call.is_archived,
    callList.updateActivityByIdMutation,
    queryClient,
  ])

  // isLoading is true if the variables hook contains the ID of the CallCard, or if the CallCard is currently archived and the user requested to unarchive all Cards
  const isLoading = useMemo(() => {
    return (
      (variables.length > 0 && variables.includes(call.id)) ||
      (call.is_archived &&
        callList.resetAllActivitiesMutation.status === 'pending')
    )
  }, [
    call.id,
    call.is_archived,
    callList.resetAllActivitiesMutation.status,
    variables,
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
                    {call.isValid ? (
                      <div>
                        {call.call_type === 'voicemail' ? (
                          <FontAwesomeIcon
                            icon={faVoicemail}
                            className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                          />
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={
                                call.call_type === 'answered'
                                  ? faPhone
                                  : faPhoneSlash
                              }
                              className="h-4 w-4 text-gray-400 group-hover:text-gray-700"
                            />
                            <FontAwesomeIcon
                              icon={
                                call.direction === 'inbound'
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
                    (!call.isValid || call.call_type === 'missed') &&
                      'text-destructive'
                  )}
                >
                  {call.isValid ? call.from : 'Unknown'}
                </p>
                <p className="line-clamp-1 overflow-hidden text-ellipsis text-gray-400 group-hover:text-gray-700">
                  tried to call {call.isValid ? call.to : 'Unknown'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-2 text-gray-400">
              <div
                className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:bg-gray-300"
                onClick={() => updateCall()}
              >
                {call.is_archived ? (
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
                  {getDateTime(call.created_at)}
                </div>
                <div className="flex items-center border-y border-l px-1 text-xs font-bold group-hover:border-gray-300 group-hover:text-gray-700">
                  {getDateTimePeriod(call.created_at)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogContent className="w-80">
          <DialogHeader>
            <DialogTitle>{call.isValid ? call.from : 'Unknown'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col">
              <div>
                {call.created_at.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div>
                {call.created_at.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
              <div>{convertSeconds(call.duration)}</div>
              {call.isValid && (
                <div>
                  {call.direction === 'inbound' ? 'Inbound' : 'Outbound'} Call
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button size={'sm'} type="submit" onClick={() => updateCall()}>
                  {call.is_archived ? <>Unarchive</> : <>Archive</>}
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
