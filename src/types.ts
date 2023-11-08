export type PhoneCallResponseType = {
  id: string
  created_at: string
  is_archived: boolean
  duration: number
  direction?: 'inbound' | 'outbound'
  from?: number
  to?: number
  via?: number
  call_type?: 'missed' | 'answered' | 'voicemail'
}
