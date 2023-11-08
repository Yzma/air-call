import { NavigationContext } from '@/context/NavigationContext'
import { useContext } from 'react'

export function useNavigation() {
  const context = useContext(NavigationContext)

  if (!context) {
    throw new Error(
      'useNavigation is supposed to be used in a component thats wrapped in NavigationContext'
    )
  }

  return {
    excludeInvalidCalls: context.excludeInvalidCalls,
    setExcludeInvalidCalls: context.setExcludeInvalidCalls,
    page: context.page,
    setPage: context.setPage,
    headerOption: context.headerOption,
    setHeaderOption: context.setHeaderOption,
  }
}
