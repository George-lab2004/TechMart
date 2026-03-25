import { useState } from 'react'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import AnimatedDot from './AnimatedDot'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from './ui/themeToggle'
import { useDispatch, useSelector } from "react-redux"
import { useLogoutMutation } from '@/slices/authApiSlice'
import { logout } from '@/slices/authSlice'
import toast from 'react-hot-toast'
import type { RootState } from '@/store/store'
import { User } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
]

export interface CartItem {
  _id: string
  name: string
  image: string
  price: number
  qty: number
  brand: string
  category: string
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems } = useSelector((state: RootState) => state.cart)
  const [logoutApiCall] = useLogoutMutation()

  const totalQty = (cartItems || []).reduce((acc: number, item: CartItem) => acc + item.qty, 0)
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap()
      dispatch(logout())
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || "Logout failed")
    }
  }

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] w-[calc(100%-32px)] sm:w-[calc(100%-80px)] max-w-[1280px] h-[64px] md:h-[70px] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-nav backdrop-blur-[28px] border border-gb rounded-[18px] md:rounded-[22px] 
        shadow-[0_8px_32px_rgba(0,0,0,0.15)]
        dark:border-[rgba(79,142,255,0.25)]
        dark:shadow-[0_0_0_1px_rgba(79,142,255,0.12),0_8px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(79,142,255,0.07)]">

        {/* Logo */}
        <Link to="/" className="font-mono text-[15px] md:text-[17px] font-medium tracking-[8px] uppercase text-text no-underline flex items-center gap-3 shrink-0">
          <AnimatedDot color="a" size="lg" />
          TECHMART
        </Link>

        {/* Nav Pills */}
        <div className="hidden lg:flex gap-1.5 bg-glass border border-gb rounded-full p-[6px]">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) => `text-[13px] font-medium px-5 py-[6px] rounded-full transition-colors tracking-[0.2px] no-underline ${isActive ? 'text-a bg-gb' : 'text-text2 hover:text-text hover:bg-gb'
                }`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-glass border border-gb rounded-[12px] px-3.5 py-2 transition-colors focus-within:border-a">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40 shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="Search…"
              className="bg-transparent border-none outline-none font-body text-[13px] text-text w-[110px] lg:w-[145px] placeholder:text-muted"
            />
          </div>

          <ThemeToggle />

          {userInfo ? (
            <Button
              variant="ghost"
              onClick={logoutHandler}
              className="hidden sm:flex text-text2 hover:text-text px-3 md:px-4"
            >
              Sign Out
            </Button>
          ) : (
            <Link to="/login" className="hidden sm:flex">
              <Button
                variant="ghost"
                className="text-text2 hover:text-text px-3 md:px-4"
              >
                Sign In
              </Button>
            </Link>
          )}

          {userInfo && (
            <Link to="/profile">
              <Button className='bg-[#000080] hover:bg-[#000080] text-white rounded-lg px-3 md:px-5 h-[34px] md:h-[38px] text-[13px] md:text-[14px] font-semibold font-body shadow-[0_4px_16px_var(--ag)] hover:bg-a hover:-translate-y-0.5 hover:shadow-[0_8px_28px_var(--ag)] shrink-0 transition-all flex items-center gap-2'>
                Profile <User className="w-4 h-4" />
              </Button>
            </Link>
          )}

          <Link to="/cart">
            <Button
              className="bg-a text-white rounded-[12px] px-3 md:px-5 h-[34px] md:h-[38px] text-[13px] md:text-[14px] font-semibold font-body shadow-[0_4px_16px_var(--ag)] hover:bg-a hover:-translate-y-0.5 hover:shadow-[0_8px_28px_var(--ag)] shrink-0 transition-all"
            >
              🛒 <span className="hidden sm:inline px-1">Cart</span>
              <Badge className="bg-white text-a border-transparent text-[9px] md:text-[10px] font-bold min-w-[17px] md:min-w-[19px] h-[17px] md:h-[19px] p-0 rounded-full flex items-center justify-center">
                {totalQty}
              </Badge>
            </Button>
          </Link>

          {/* Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden bg-glass border border-gb rounded-[10px] hover:bg-gb shrink-0 flex flex-col justify-center items-center gap-[5px]"
          >
            <span className={`block w-4 h-[2px] bg-text rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-4 h-[2px] bg-text rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-[2px] bg-text rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </Button>

        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div className={`lg:hidden fixed top-[84px] left-1/2 -translate-x-1/2 z-[499] w-[calc(100%-32px)] sm:w-[calc(100%-80px)] max-w-[1280px] bg-nav backdrop-blur-[28px] border border-gb rounded-[18px] overflow-hidden transition-all duration-300
        dark:border-[rgba(79,142,255,0.25)]
        dark:shadow-[0_0_0_1px_rgba(79,142,255,0.12),0_8px_40px_rgba(0,0,0,0.5)]
        ${menuOpen ? 'max-h-[400px] opacity-100 shadow-[0_8px_32px_rgba(0,0,0,0.15)]' : 'max-h-0 opacity-0 shadow-none border-transparent'}`}>

        <div className="p-4 flex flex-col gap-1">

          {/* Mobile search */}
          <div className="flex items-center gap-2 bg-glass border border-gb rounded-[12px] px-3.5 py-2.5 mb-2 transition-colors focus-within:border-a md:hidden">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40 shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="Search…"
              className="bg-transparent border-none outline-none font-body text-[14px] text-text w-full placeholder:text-muted"
            />
          </div>

          {/* Nav links */}
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `text-[14px] font-medium px-4 py-3 rounded-[12px] transition-colors no-underline ${isActive ? 'text-a bg-gb' : 'text-text2 hover:text-text hover:bg-gb'
                }`}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Mobile Auth Button */}
          {userInfo ? (
            <Button
              variant="ghost"
              onClick={() => { logoutHandler(); setMenuOpen(false); }}
              className="text-[14px] font-medium px-4 py-3 rounded-[12px] transition-colors text-text2 hover:text-text hover:bg-gb w-full justify-start h-auto"
            >
              Sign Out
            </Button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium px-4 py-3 rounded-[12px] transition-colors text-text2 hover:text-text hover:bg-gb w-full justify-start h-auto no-underline flex items-center"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[498]"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
