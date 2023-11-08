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
import { useNavigation } from '@hooks/useNavigation'

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
FooterIcon.displayName = 'FooterIcon'

const CALL_COUNT = 23

export default function Footer() {
  return (
    <footer className="relative flex h-12 items-center justify-between rounded-b-xl border-t border-gray-100 bg-white px-6 shadow-[rgba(0,_0,_0,_0.05)_0px_-1px_4px_0px]">
      <FooterIcon icon={faPhone} page={'call-list'}>
        <div className="absolute -top-1 left-3 flex w-7 select-none items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white group-hover:bg-orange-600">
          {CALL_COUNT > 99 ? '99+' : CALL_COUNT}
        </div>
      </FooterIcon>
      <FooterIcon icon={faUser} page={'profile'} />
      <FooterIcon icon={faAt} page={'mentions'} />
      <FooterIcon icon={faGear} page={'settings'} />
      {/* <div className="group absolute inset-x-0 inset-y-0 w-full -translate-y-8">
        <div className="h-10 bg-white" />
      </div> */}
      {/* <div
        className="group relative flex cursor-pointer"
        onClick={() => nav.setPage(0)}
      >
        <div className="absolute -top-1 left-3 flex w-7 select-none items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white group-hover:bg-orange-600">
          99
        </div>
        <FontAwesomeIcon
          className="h-6 w-6 text-gray-600 hover:cursor-pointer group-hover:text-gray-800"
          icon={faPhone}
        />
        <div className="absolute -bottom-[0.72rem] flex h-1 w-full items-center justify-center rounded-t-xl bg-green-500" />
      </div> */}
      {/* <div className="flex" onClick={() => nav.setPage(1)}>
        <FontAwesomeIcon
          className="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-gray-800"
          icon={faUser}
        />
      </div> */}
      {/* <div className="flex" onClick={() => nav.setPage(0)}>
        <FontAwesomeIcon
          className="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-gray-800"
          icon={faHome}
        />
      </div> */}
      {/* <div className="group z-20 mb-10 cursor-pointer rounded-full border">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[rgba(0,_0,_0,_0.15)_0px_0px_4px_0px] group-hover:bg-gray-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 group-hover:bg-green-600">
            <FontAwesomeIcon
              className="flex h-6 w-6 items-center text-white"
              icon={faPhone}
            />
          </div>
        </div>
      </div> */}
      {/* <FooterIcon />
      <FooterIcon /> */}
      {/* <div className="flex">
        <FontAwesomeIcon
          className="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-gray-800"
          onClick={() => nav.setPage(3)}
          icon={faGear}
        />
      </div> */}

      {/* <div className="flex">
        <FontAwesomeIcon
          className="h-6 w-6 text-green-500 hover:cursor-pointer hover:text-gray-800"
          icon={faCircleDot}
        />
      </div> */}
    </footer>
  )
}
