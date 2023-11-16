import { cn } from '@/lib/utils'
import { faPhone, faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigation } from '@hooks/useNavigation'
import { Separator } from './ui/separator'
import { type NavigationContextType } from '@/context/NavigationContext'

type HeaderIconProps = {
  page: NavigationContextType['headerOption']
  title: string
}

function HeaderIcon({ page, title }: HeaderIconProps) {
  const navigation = useNavigation()
  return (
    <div className="relative" onClick={() => navigation.setHeaderOption(page)}>
      <p
        className={cn(
          'cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900',
          navigation.headerOption === page && 'font-bold'
        )}
      >
        {title}
      </p>
      {navigation.headerOption === page && (
        <div className="absolute -bottom-[1.18rem] flex h-1 w-full items-center justify-center rounded-sm bg-orange-500" />
      )}
    </div>
  )
}

export default function Header() {
  const navigation = useNavigation()
  return (
    <header className="group flex h-14 select-none justify-between rounded-t-xl bg-white p-6 shadow-[rgba(0,_0,_0,_0.05)_0px_1px_4px_0px]">
      <div className="flex cursor-pointer items-center gap-x-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-green-500 bg-white">
          <FontAwesomeIcon className="h-4 w-4 text-green-500" icon={faPhone} />
        </div>
        <p className="text-lg font-bold text-gray-700 group-hover:text-gray-900">
          Activity
        </p>
      </div>
      {navigation.page === 'call-list' && (
        <div className="relative flex items-center gap-x-3 text-gray-700">
          <HeaderIcon page={'inbox'} title="Inbox" />
          <Separator orientation="vertical" className="h-5 w-[0.08rem]" />
          <HeaderIcon page={'archived'} title="Archived" />
          <Separator orientation="vertical" className="h-5 w-[0.08rem]" />

          <FontAwesomeIcon
            className={cn(
              `h-4 w-4 cursor-pointer hover:text-gray-700`,
              navigation.excludeInvalidCalls ? 'text-green-500' : 'text-red-500'
            )}
            onClick={() =>
              navigation.setExcludeInvalidCalls(!navigation.excludeInvalidCalls)
            }
            icon={faSliders}
          />
        </div>
      )}
    </header>
  )
}
