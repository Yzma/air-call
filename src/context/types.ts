import { type ActivityResponseType } from '@/types'
import { type AxiosError } from 'axios'

export type ActivityType = {
  created_at: Date
} & Pick<ActivityResponseType, 'id' | 'is_archived' | 'duration'> &
  (
    | (Required<
        Pick<
          ActivityResponseType,
          'direction' | 'from' | 'to' | 'via' | 'call_type'
        >
      > & {
        isValid: true
      })
    | {
        isValid: false
      }
  )

export type GroupedActivities = {
  time: string
  calls: ActivityType[]
}

export type ActivityIdParams = {
  id: string
  is_archived: boolean
}

export type ResponseError = AxiosError & {
  error: string
}
