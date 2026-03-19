import { useState } from "react"

export default function PasswordStrength() {
  const [strength] = useState(0)
  const [label] = useState("")

  const colors = ["bg-[#ff4f8e]", "bg-[#ffc84f]", "bg-[#4f8eff]", "bg-[#4fffb0]"]

  // const check = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const v = e.target.value
  //   let s = 0
  //   if (v.length >= 8)           s++
  //   if (/[A-Z]/.test(v))         s++
  //   if (/[0-9]/.test(v))         s++
  //   if (/[^A-Za-z0-9]/.test(v))  s++
  //   setStrength(s)
  //   setLabel(s > 0 ? labels[s - 1] : "")
  // }

  // attach to the password input above via onChange
  // or just expose this as a prop
  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${i < strength ? colors[strength - 1] : "bg-gb"}`}
          />
        ))}
      </div>
      {label && (
        <span className={`font-mono text-[9px] tracking-[1px] uppercase
                          ${colors[strength - 1].replace("bg-", "text-")}`}>
          {label} Password
        </span>
      )}
    </div>
  )
}