import { type NavigationContextType } from '@/context/NavigationContext'
import { cn } from '@/lib/utils'
import {
  type IconDefinition,
  faGear,
  faPhone,
  faUser,
  faAt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useCallList from '@hooks/useCallList'
import { useNavigation } from '@hooks/useNavigation'
import { useMemo } from 'react'

type FooterIconMenuButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  page: NavigationContextType['page']
  icon: IconDefinition
}

const FooterIcon = ({
  className,
  children,
  page,
  icon,
  ...props
}: FooterIconMenuButtonProps) => {
  const nav = useNavigation()
  return (
    <div className="relative flex" onClick={() => nav.setPage(page)} {...props}>
      {children}
      <FontAwesomeIcon
        className={cn(
          'h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-gray-800',
          className
        )}
        icon={icon}
      />
      {page === nav.page && (
        <div className="absolute -bottom-[0.72rem] flex h-1 w-full items-center justify-center rounded-t-xl bg-green-500" />
      )}
    </div>
  )
}

export default function Footer() {
  const callList = useCallList()
  const nav = useNavigation()

  const currentActivityCount = useMemo(() => {
    let count = callList.state.inboxStats.inboxTotal

    if (nav.excludeInvalidCalls) {
      count -= callList.state.inboxStats.errorTotal
    }

    return count
  }, [callList.state, nav.excludeInvalidCalls])

  return (
    <footer className="relative flex h-12 items-center justify-between rounded-b-xl border-t border-gray-100 bg-white px-6 shadow-[rgba(0,_0,_0,_0.05)_0px_-1px_4px_0px]">
      <FooterIcon icon={faPhone} page={'call-list'}>
        {currentActivityCount > 0 && (
          <div className="absolute -top-1 left-3 flex w-7 select-none items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white group-hover:bg-orange-600">
            {currentActivityCount > 99 ? '99+' : currentActivityCount}
          </div>
        )}
      </FooterIcon>
      <FooterIcon icon={faUser} page={'profile'} />
      <FooterIcon icon={faAt} page={'mentions'} />
      <FooterIcon icon={faGear} page={'settings'} />
    </footer>
  )
}
