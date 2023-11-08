import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { SectionDescription, SectionTitle } from '@components/ui/section'
import { Switch } from '@components/ui/switch'
import { faQrcode, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function AccountPage() {
  return (
    <div className="mx-auto flex pb-16">
      <div className="w-full space-y-4 px-4 sm:px-3">
        <div className="group relative flex flex-col items-center gap-x-2 gap-y-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-500">
            <FontAwesomeIcon icon={faUser} className="h-10 w-10 text-white" />
            <div className="absolute bottom-0 top-14 flex h-7 w-7 translate-x-6 cursor-pointer items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600">
              <FontAwesomeIcon icon={faQrcode} className="text-white" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-black">Andrew Caruso</p>
            <p className="text-sm text-gray-600">What an epic description</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <SectionTitle>Email</SectionTitle>
            <SectionDescription>
              Excepteur sint occaecat cupidatat non proident sunt in culpa qui
              officia.
            </SectionDescription>
          </div>
          <div className="flex items-center gap-x-2">
            <Input className="h-8" defaultValue={'andrew@aircall.ca'} />
            <Button variant={'outline'} size={'icon'}>
              Change
            </Button>
          </div>
          <div className="flex flex-col gap-y-1">
            <SectionTitle>Password</SectionTitle>
            <SectionDescription>
              You can set a permanent password if you don&apos;t want to use
              temporary login codes.
            </SectionDescription>
          </div>
          <div>
            <Button variant={'outline'}>Set New Password</Button>
          </div>
          <div className="flex flex-col gap-y-1">
            <SectionTitle>Sync with PC</SectionTitle>
          </div>
          <div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  )
}
