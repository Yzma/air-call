import {
  faArrowDown,
  faArrowUp,
  faBoxArchive,
  faBoxOpen,
  faCircleExclamation,
  faEllipsisVertical,
  faPhone,
  faRotate,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Original() {
  return (
    <>
      {/* Start Call Separator Component */}
      {/* <div className="relative flex select-none items-center py-5">
              <div className="flex-grow border-t border-dashed border-gray-400"></div>
              <span className="mx-4 flex-shrink font-bold text-gray-400">
                June, 23 2017
              </span>
              <div className="flex-grow border-t border-dashed border-gray-400"></div>
            </div> */}
      {/* End Call Separator Component */}

      {/* Error Card State Component */}
      <div className="flex h-32 w-full px-5 py-12">
        <div className="flex h-16 w-full select-none items-center rounded-xl border bg-red-500 p-3 text-sm text-black">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-2">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="h-4 w-4 text-white"
              />
              <p className="font-semibold text-white">Failed to fetch inbox.</p>
            </div>
            <button className="ring-offset-background focus-visible:ring-ring inline-flex h-8 items-center justify-center gap-x-2 whitespace-nowrap rounded-md border bg-white px-2 text-sm font-medium text-red-500 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90">
              <FontAwesomeIcon icon={faRotate} className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
      {/* End Call Card Component */}

      {/* Start Call Card Component */}
      <div className="flex h-32 w-full px-5 py-12">
        <div className="group flex h-16 w-full cursor-pointer select-none items-center rounded-xl border bg-white py-2 pl-4 text-sm text-black hover:bg-slate-100">
          <div className="flex items-end gap-x-2">
            <FontAwesomeIcon
              icon={faBoxArchive}
              className="h-4 w-4 text-gray-400 group-hover:text-gray-800"
            />
            <p className="font-semibold">Archive all calls</p>
          </div>
        </div>
      </div>
      {/* End Call Card Component */}

      {/* Unarchive Card Component */}
      <div className="flex h-32 w-full px-5 py-12">
        <div className="group flex h-16 w-full cursor-pointer select-none items-center rounded-xl border bg-white py-2 pl-4 text-sm text-black hover:bg-slate-100">
          <div className="flex items-end gap-x-2">
            <FontAwesomeIcon
              icon={faBoxOpen}
              className="h-4 w-4 text-gray-400 group-hover:text-gray-800"
            />
            <p className="font-semibold">Unarchive all calls</p>
          </div>
        </div>
      </div>
      {/* End Call Card Component */}

      {/* Start Call Card Component (OUTBOUND) */}
      <div className="group flex h-32 w-full cursor-pointer select-none px-5 py-12">
        <div className="flex h-16 w-full items-center justify-between rounded-xl border bg-white py-2 pl-4 text-sm text-black group-hover:border-gray-300 group-hover:bg-gray-100">
          <div className="flex items-center gap-x-3">
            <div className="relative">
              <FontAwesomeIcon
                icon={faPhone}
                className="h-4 w-4 text-gray-400 group-hover:text-gray-700"
              />
              <FontAwesomeIcon
                icon={faArrowUp}
                className="absolute -right-1 -top-1 h-3 w-3 text-orange-500"
              />
            </div>
            <div className="w-auto overflow-hidden text-ellipsis text-xs">
              <p className="flex gap-x-1 font-bold text-black">
                Arthur Andre
                <span className="flex h-4 w-4 justify-center rounded-full bg-orange-500 text-white">
                  8
                </span>
              </p>
              <p className="line-clamp-1 overflow-hidden text-ellipsis text-gray-400 group-hover:text-gray-700">
                tried to call on PrivateSportShop (xa and a bunch of text)
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-x-2 text-gray-400">
            <div>
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="h-4 w-4 group-hover:text-gray-700"
              />
            </div>
            <div className="group-hover:text-gray-700">05:57</div>
            <div className="flex items-center border-y border-l px-1 text-xs font-bold group-hover:border-gray-300 group-hover:text-gray-700">
              PM
            </div>
          </div>
        </div>
      </div>
      {/* End Call Card Component (OUTBOUND) */}

      {/* Start Call Card Component (INBOUND) */}
      <div className="flex h-32 w-full select-none px-5 py-12">
        <div className="flex h-16 w-full items-center justify-between rounded-xl border bg-white py-2 pl-4 text-sm text-black">
          <div className="flex items-center gap-x-3">
            <div className="relative">
              <FontAwesomeIcon
                icon={faPhone}
                className="h-4 w-4 text-gray-400"
              />
              <FontAwesomeIcon
                icon={faArrowDown}
                className="absolute -right-1 -top-1 h-3 w-3 text-orange-500"
              />
            </div>
            <div className="w-auto overflow-hidden text-ellipsis text-xs">
              <p className="flex gap-x-1 font-bold text-black">
                Arthur Andre
                <span className="flex h-4 w-4 justify-center rounded-full bg-orange-500 text-white">
                  8
                </span>
              </p>
              <p className="line-clamp-1 overflow-hidden text-ellipsis text-gray-400">
                tried to call on PrivateSportShop (xa and a bunch of text)
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-x-2 text-gray-400">
            <div>
              <FontAwesomeIcon icon={faEllipsisVertical} className="h-4 w-4" />
            </div>
            <div>05:57</div>
            <div className="flex items-center border-y border-l px-1 text-xs font-bold">
              PM
            </div>
          </div>
        </div>
      </div>
      {/* End Call Card Component (INBOUND) */}
    </>
  )
}
