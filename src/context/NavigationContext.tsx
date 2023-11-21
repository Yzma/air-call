import {
  createContext,
  useMemo,
  type PropsWithChildren,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

export type NavigationContextType = {
  excludeInvalidActivities: boolean
  setExcludeInvalidActivities: Dispatch<SetStateAction<boolean>>
  headerOption: 'inbox' | 'archived'
  setHeaderOption: Dispatch<
    SetStateAction<NavigationContextType['headerOption']>
  >
  page: 'call-list' | 'profile' | 'mentions' | 'settings'
  setPage: Dispatch<NavigationContextType['page']>
}

export type NavigationContextParamsType = {
  excludeInvalidActivities: boolean
}

export const NavigationContext = createContext<NavigationContextType>(
  {} as NavigationContextType
)

export default function NavigationContextProvider({
  children,
  excludeInvalidActivities: excludeInvalidCallsValue,
}: PropsWithChildren<NavigationContextParamsType>) {
  const [excludeInvalidActivities, setExcludeInvalidActivities] = useState(
    excludeInvalidCallsValue
  )
  const [page, setPage] = useState<NavigationContextType['page']>('call-list')
  const [headerOption, setHeaderOption] =
    useState<NavigationContextType['headerOption']>('inbox')
  const navigationContextValue = useMemo(
    () => ({
      excludeInvalidActivities,
      setExcludeInvalidActivities,
      page,
      setPage,
      headerOption,
      setHeaderOption,
    }),
    [excludeInvalidActivities, headerOption, page]
  )
  return (
    <NavigationContext.Provider value={navigationContextValue}>
      {children}
    </NavigationContext.Provider>
  )
}
