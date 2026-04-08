import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import ChatWidget from '@/Components/ChatWidget'
import ScrollToTop from '@/Components/ScrollToTop'

export default function UserLayout() {
  const { pathname } = useLocation()
  // Hide Header on login route
  const hideHeader = pathname === '/login'

  return (
    <div className="min-h-screen bg-bg font-body overflow-x-hidden">
      <ScrollToTop />
      {!hideHeader && <Header />}
      <main className={` px-6 overflow-x-hidden ${hideHeader ? "" : "pt-22.5"}`}>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget userId="user" />
    </div>
  )
}
