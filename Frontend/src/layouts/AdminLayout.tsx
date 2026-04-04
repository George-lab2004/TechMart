import { Outlet, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, User } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import Sidebar from '@/Components/Sidebar'
import AdminChatWidget from '@/Components/AdminChatWidget'

export default function AdminLayout() {
    const { pathname } = useLocation()
    const { userInfo } = useSelector((state: RootState) => state.auth)

    // Simple breadcrumb logic
    const pathSegments = pathname.split('/').filter(Boolean)

    return (
        <div className="min-h-screen bg-bg font-body text-text flex flex-col">

            {/* 🏰 Admin Top Bar */}
            <header className="h-20 border-b border-gb bg-glass backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Sidebar />

                    <div className="h-6 w-px bg-gb mx-2 hidden sm:block" />

                    {/* Breadcrumbs */}
                    <nav className="hidden sm:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text2">
                        <Link to="/admin" className="hover:text-a transition-colors">Admin</Link>
                        {pathSegments.slice(1).map((segment, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 opacity-40" />
                                <span className={idx === pathSegments.length - 2 ? "text-text" : ""}>
                                    {segment}
                                </span>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[12px] font-black uppercase leading-none">{userInfo?.name}</p>
                        <p className="text-[9px] font-bold text-a uppercase tracking-wider mt-1 opacity-70">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-bg2 border border-gb flex items-center justify-center">
                        <User className="w-5 h-5 text-text2" />
                    </div>
                </div>
            </header>

            {/* 📄 Content Area */}
            <main className="flex-1 p-6 sm:p-10 lg:p-16">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="max-w-7xl mx-auto"
                >
                    <Outlet />
                </motion.div>
            </main>
            <AdminChatWidget />
        </div>
    )
}