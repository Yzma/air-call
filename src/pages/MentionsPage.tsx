import { Separator } from '@components/ui/separator'
import { faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MentionsPage() {
  return (
    <div className="mx-auto flex flex-col gap-y-4 pb-16">
      <div className="flex w-full flex-col gap-y-2 text-xs">
        <div className="flex w-full justify-between ">
          <p>
            <span className="font-bold">Joey</span> mentioned you in{' '}
            <span className="font-bold">chat-room-5</span>
          </p>
          <p className="flex w-24 justify-end">Oct 29th</p>
        </div>
        <div className="flex justify-between space-x-2">
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="font-bold">Joey Lastname</p>
            <p>
              <span className="bg-yellow-100 text-blue-700">
                @Andrew Caruso
              </span>{' '}
              lets meet on Tuesday! Does 1PM work for you?
            </p>
          </div>
        </div>
      </div>
      <Separator />

      <div className="flex w-full flex-col gap-y-2 text-xs">
        <div className="flex w-full justify-between ">
          <p>
            <span className="font-bold">Joey</span> mentioned you in{' '}
            <span className="font-bold">chat-room-5</span>
          </p>
          <p className="flex w-24 justify-end">Oct 29th</p>
        </div>
        <div className="flex justify-between space-x-2">
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="font-bold">Joey Lastname</p>
            <p>
              <span className="bg-yellow-100 text-blue-700">
                @Andrew Caruso
              </span>{' '}
              lets meet on Tuesday! Does 1PM work for you?
            </p>
          </div>
        </div>
      </div>
      <Separator />

      <div className="flex w-full flex-col gap-y-2 text-xs">
        <div className="flex w-full justify-between ">
          <p>
            <span className="font-bold">Joey</span> mentioned you in{' '}
            <span className="font-bold">chat-room-5</span>
          </p>
          <p className="flex w-24 justify-end">Oct 29th</p>
        </div>
        <div className="flex justify-between space-x-2">
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-1">
            <p className="font-bold">Joey Lastname</p>
            <p>
              <span className="bg-yellow-100 text-blue-700">
                @Andrew Caruso
              </span>{' '}
              lets meet on Tuesday! Does 1PM work for you?
            </p>
          </div>
        </div>
      </div>
      <Separator />

      <div className="flex w-full flex-col gap-y-2 text-xs">
        <div className="flex w-full justify-between ">
          <p>
            <span className="font-bold">Joey</span> mentioned you in{' '}
            <span className="font-bold">chat-room-5</span>
          </p>
          <p className="flex w-24 justify-end">Oct 29th</p>
        </div>
        <div className="flex justify-between space-x-2">
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-1">
            <p className="font-bold">Joey Lastname</p>
            <p>
              <span className="bg-yellow-100 text-blue-700">
                @Andrew Caruso
              </span>{' '}
              lets meet on Tuesday! Does 1PM work for you?
            </p>
          </div>
        </div>
      </div>
      <Separator />

      <div className="flex w-full flex-col gap-y-2 text-xs">
        <div className="flex w-full justify-between ">
          <p>
            <span className="font-bold">Joey</span> reacted in{' '}
            <span className="font-bold">chat-room-5</span>
          </p>
          <p className="flex w-24 justify-end">Oct 29th</p>
        </div>
        <div className="flex justify-between space-x-2">
          <div>
            <div className="flex h-8 w-8 items-center justify-center">
              <FontAwesomeIcon
                icon={faThumbsUp}
                className="h-4 w-4 text-yellow-500"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-1">
            <p className="font-bold">Andrew Caruso</p>
            <p>Sounds good! See you then.</p>
            <span className="flex h-6 w-12 items-center justify-center space-x-2 rounded-full bg-gray-300/50">
              <FontAwesomeIcon
                icon={faThumbsUp}
                className="h-4 w-4 text-yellow-500"
              />
              <p className="font-bold">1</p>
            </span>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  )
}
