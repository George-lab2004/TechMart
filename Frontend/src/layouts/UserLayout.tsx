import { Outlet } from 'react-router-dom'
import Header from '@/Components/Header'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-bg font-body overflow-x-hidden">
      <Header />
      <main className="pt-22.5 px-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
