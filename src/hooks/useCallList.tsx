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
    archiveAllActivities: context.archiveAllActivities,
    unarchiveAllActivities: context.unarchiveAllActivities,
    isArchivingAllActivities: context.isArchivingAllActivities,
    getAllActivitiesQuery: context.getAllActivitiesQuery,
    updateActivityByIdMutation: context.updateActivityByIdMutation,
    resetAllActivitiesMutation: context.resetAllActivitiesMutation,
    state: context.state,
    dispatch: context.dispatch,
  }
}
