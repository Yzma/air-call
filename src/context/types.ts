import { type PhoneCallResponseType } from '@/types'
import { type AxiosError } from 'axios'

export type PhoneCallType = {
  created_at: Date
} & Pick<PhoneCallResponseType, 'id' | 'is_archived' | 'duration'> &
  (
    | (Required<
        Pick<
          PhoneCallResponseType,
          'direction' | 'from' | 'to' | 'via' | 'call_type'
        >
      > & {
        isValid: true
      })
    | {
        isValid: false
      }
  )

export type PhoneCallReturn = {
  time: string
  calls: PhoneCallType[]
}

export type ActivityIdParams = {
  id: string
  is_archived: boolean
}

export type ResponseError = AxiosError & {
  error: string
}
