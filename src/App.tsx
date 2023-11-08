import Footer from '@components/Footer'
import Header from '@components/Header'
import { useNavigation } from '@hooks/useNavigation'
import AccountPage from '@pages/AccountPage'
import InboxPage from '@pages/InboxPage'
import MentionsPage from '@pages/MentionsPage'
import SettingsPage from '@pages/SettingsPage'

export default function App() {
  const nav = useNavigation()
  return (
    <div className="h-screen">
      <div className="flex h-screen items-center justify-center bg-[#233142]">
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-[#233142]"> */}
        {/* flex w-full select-none px-5 py-2 */}
        <div className="z-0 w-[376px] rounded-xl bg-zinc-50 antialiased">
          <Header />

          <div className="relative h-[666px] overflow-y-scroll px-5 py-8 no-scrollbar">
            {nav.page === 'call-list' && <InboxPage />}
            {nav.page === 'profile' && <AccountPage />}
            {nav.page === 'mentions' && <MentionsPage />}
            {nav.page === 'settings' && <SettingsPage />}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  )
}
