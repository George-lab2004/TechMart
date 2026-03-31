import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { NavLink } from "react-router-dom"
import { Menu, LayoutDashboard, ShoppingCart, Tag, User, BarChart3, ChevronRight } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import ThemeToggle from "./ui/themeToggle"

// 🔥 NAV DATA
const navLinks = [
    {
        title: "Overview",
        links: [
            { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        title: "Store Management",
        links: [
            { label: "Products", to: "/admin/products", icon: ShoppingCart },
            { label: "Orders", to: "/admin/orders", icon: Tag },
            { label: "Categories", to: "/admin/categories", icon: Tag },
            { label: "Users", to: "/admin/users", icon: User },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Main Site", to: "/", icon: ChevronRight },
            { label: "Profile", to: "/profile", icon: User },
        ],
    },
]

export default function Sidebar() {
    const { userInfo } = useSelector((state: RootState) => state.auth)

    if (!userInfo?.isAdmin) return null

    return (
        <Sheet>
            {/* 🔘 Hamburger - Glassmorphic Pulsing Trigger */}
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="
                        bg-glass border border-gb rounded-2xl w-12 h-12
                        shadow-lg shadow-black/5 backdrop-blur-xl
                        hover:bg-bg2 hover:scale-105 transition-all duration-300
                        group relative overflow-hidden
                    "
                >
                    <div className="absolute inset-0 bg-a/5 animate-pulse group-hover:hidden" />
                    <Menu className="w-5 h-5 text-text group-hover:text-a transition-colors relative z-10" />
                </Button>
            </SheetTrigger>

            {/* 📂 Sidebar Content */}
            <SheetContent
                side="left"
                className="w-[300px] p-0 bg-surf border-r border-gb overflow-y-auto custom-scrollbar flex flex-col"
            >
                {/* Header Section */}
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-a to-blue-700 flex items-center justify-center shadow-lg shadow-a/20">
                            <span className="text-white font-black text-xl">T</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-text tracking-tight uppercase leading-none">
                                TechMart
                            </h2>
                            <p className="text-[10px] font-bold text-a tracking-[0.2em] uppercase mt-1">
                                Admin Portal
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>

                    <div className="h-px w-full bg-linear-to-r from-gb to-transparent" />
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 px-4 py-4 flex flex-col gap-8">
                    {navLinks.map((section) => (
                        <div key={section.title}>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-4 px-4 opacity-70">
                                {section.title}
                            </p>

                            <div className="flex flex-col gap-1.5">
                                {section.links.map((link) => (
                                    <NavLink
                                        key={link.label}
                                        to={link.to}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all no-underline group
                                            ${isActive
                                                ? "bg-ag text-a shadow-sm"
                                                : "text-text2 hover:bg-bg2 hover:text-text"
                                            }
                                        `}
                                    >
                                        <link.icon className={`w-4 h-4 transition-colors ${({ isActive }: any) => isActive ? 'text-a' : 'text-muted group-hover:text-text'}`} />
                                        <span className="flex-1">{link.label}</span>
                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="p-8 pt-4">
                    <div className="bg-bg2/50 rounded-2xl p-4 border border-gb">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-a text-white flex items-center justify-center font-bold text-xs uppercase">
                                {userInfo?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-black text-text truncate uppercase">{userInfo?.name || 'Admin'}</p>
                                <p className="text-[9px] text-text2 font-mono truncate uppercase opacity-60">Control Center Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}