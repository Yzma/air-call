import {
  createContext,
  useMemo,
  type PropsWithChildren,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

export type NavigationContextType = {
  excludeInvalidCalls: boolean
  setExcludeInvalidCalls: Dispatch<SetStateAction<boolean>>
  headerOption: 'inbox' | 'archived'
  setHeaderOption: Dispatch<
    SetStateAction<NavigationContextType['headerOption']>
  >
  page: 'call-list' | 'profile' | 'mentions' | 'settings'
  setPage: Dispatch<NavigationContextType['page']>
}

export type NavigationContextParamsType = {
  excludeInvalidCalls: boolean
}

export const NavigationContext = createContext<NavigationContextType>(
  {} as NavigationContextType
)

export default function NavigationContextProvider({
  children,
  excludeInvalidCalls: excludeInvalidCallsValue,
}: PropsWithChildren<NavigationContextParamsType>) {
  const [excludeInvalidCalls, setExcludeInvalidCalls] = useState(
    excludeInvalidCallsValue
  )
  const [page, setPage] = useState<NavigationContextType['page']>('call-list')
  const [headerOption, setHeaderOption] =
    useState<NavigationContextType['headerOption']>('inbox')
  const navigationContextValue = useMemo(
    () => ({
      excludeInvalidCalls,
      setExcludeInvalidCalls,
      page,
      setPage,
      headerOption,
      setHeaderOption,
    }),
    [excludeInvalidCalls, headerOption, page]
  )
  return (
    <NavigationContext.Provider value={navigationContextValue}>
      {children}
    </NavigationContext.Provider>
  )
}
