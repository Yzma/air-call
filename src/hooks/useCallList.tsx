import { CallListContext } from '@/context/CallListContext'
import { useContext } from 'react'

export default function useCallList() {
  const context = useContext(CallListContext)

  if (!context) {
    throw new Error(
      'useCallList is supposed to be used in a component thats wrapped in CallListContext'
    )
  }

  return {
    archiveAllCalls: context.archiveAllCalls,
    archiveCall: context.archiveCall,
    unarchiveAllCalls: context.unarchiveAllCalls,
    unarchiveCall: context.unarchiveCall,
    getAllActivitiesQuery: context.getAllActivitiesQuery,
    updateActivityByIdMutation: context.updateActivityByIdMutation,
    resetAllActivitiesMutation: context.resetAllActivitiesMutation,

    transformPhoneCall: context.transformPhoneCall,
    hashPhoneCallKey: context.hashPhoneCallKey,
    state: context.state,
    dispatch: context.dispatch,
  }
}
