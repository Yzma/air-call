import { Button } from '@components/ui/button'
import { SectionDescription, SectionTitle } from '@components/ui/section'
import { Separator } from '@components/ui/separator'
import { Switch } from '@components/ui/switch'

export default function SettingsPage() {
  return (
    <div className="mx-auto flex pb-16">
      <div className="w-full px-4 sm:px-3">
        <div>
          <p className="mb-4 select-none text-2xl font-bold">
            My Notifications
          </p>
        </div>
        <div className="flex flex-col gap-y-3">
          <SectionTitle>General</SectionTitle>
          <div>
            <div className="flex select-none justify-between gap-x-1 py-2">
              <div>
                <SectionTitle className="text-base">
                  Comments and replies
                </SectionTitle>
                <SectionDescription>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit.
                </SectionDescription>
              </div>
              <div className="flex items-center">
                <Switch checked />
              </div>
            </div>
            <Separator />
            <div className="flex select-none justify-between gap-x-1 py-2">
              <div>
                <SectionTitle className="text-base">
                  Comments and replies
                </SectionTitle>
                <SectionDescription>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit.
                </SectionDescription>
              </div>
              <div className="flex items-center">
                <Switch />
              </div>
            </div>
            <Separator />
          </div>

          <div>
            <SectionTitle>Other</SectionTitle>
            <div className="flex select-none justify-between gap-x-1 py-2">
              <div>
                <SectionTitle className="text-base">
                  Comments and replies
                </SectionTitle>
                <SectionDescription>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit.
                </SectionDescription>
              </div>
              <div className="flex items-center">
                <Button variant={'outline'} size={'icon'}>
                  Manage
                </Button>
              </div>
            </div>
            <Separator />

            <div className="flex select-none justify-between gap-x-1 py-2">
              <div>
                <SectionTitle className="text-base">
                  Comments and replies
                </SectionTitle>
                <SectionDescription>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit.
                </SectionDescription>
              </div>
              <div className="flex items-center">
                <Button variant={'outline'} size={'icon'}>
                  Manage
                </Button>
              </div>
            </div>
            <Separator />
          </div>

          <div>
            <p className="select-none text-2xl font-bold text-red-500">
              Delete Account
            </p>
            <div className="flex select-none justify-between gap-x-1 py-2">
              <div className="space-y-3">
                <SectionDescription className="font-bold text-primary-text">
                  This action is irreversible. Once you confirm the deletion of
                  your account, there is no way to undo it.
                </SectionDescription>
                <Button variant={'destructive'}>Delete your account</Button>
                <p className="text-xs">
                  Are you sure you don’t want to just{' '}
                  <span className="cursor-pointer text-blue-700 underline">
                    downgrade your account
                  </span>{' '}
                  to a <span className="text-blue-700">FREE</span> account? We
                  won’t charge your payment information anymore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
