import { useState } from "react"

export default function ThemeToggle() {
      const [isDark, setIsDark]  = useState(false)
    
      const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle('dark')
      }
  return (
    <>
              <button
            onClick={toggleTheme}
            className="w-[48px] md:w-[54px] h-[26px] md:h-[30px] rounded-full bg-glass border border-gb cursor-pointer p-[3px] flex items-center shrink-0"
          >
            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-a flex items-center justify-center text-[11px] md:text-[13px] transition-transform duration-[400ms] ${isDark ? 'translate-x-[22px] md:translate-x-[24px]' : ''}`}>
              {isDark ? '☀️' : '🌙'}
            </div>
          </button>
    </>
  )
}
