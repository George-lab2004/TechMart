import { motion } from "framer-motion"

export default function Loader({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-32 gap-8">

      {/* Outer ring stack */}
      <div className="relative w-24 h-24 flex items-center justify-center">

        {/* Static faint ring */}
        <div className="absolute inset-0 rounded-full border border-white/7" />

        {/* Slow outer spin */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid transparent",
            borderTopColor: "#4f8eff",
            borderRightColor: "rgba(79,142,255,0.3)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Fast inner spin — opposite direction */}
        <motion.div
          className="absolute inset-3 rounded-full"
          style={{
            border: "1.5px solid transparent",
            borderTopColor: "#ff4f8e",
            borderLeftColor: "rgba(255,79,142,0.3)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />

        {/* Center glowing dot */}
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-[#4f8eff]"
          style={{ boxShadow: "0 0 12px rgba(79,142,255,0.8)" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* TechMart wordmark */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#4f8eff]"
          style={{ boxShadow: "0 0 8px #4f8eff" }}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="font-mono text-[13px] font-medium tracking-[6px] uppercase"
          style={{ color: "var(--color-text)" }}
        >
          TechMart
        </span>
      </div>

      {/* Pulsing bar */}
      <div className="relative w-48 h-[2px] rounded-full overflow-hidden bg-white/7">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #4f8eff, #ff4f8e, #4fffb0)",
            width: "40%",
          }}
          animate={{ x: ["-40%", "300%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Dots + message */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full bg-[#4f8eff]"
              animate={{ opacity: [0.2, 1, 0.2], scaleY: [1, 2.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              style={{ display: "inline-block" }}
            />
          ))}
        </div>
        <p
          className="font-mono text-[11px] tracking-[3px] uppercase"
          style={{ color: "var(--color-muted)" }}
        >
          {message}
        </p>
      </div>

    </div>
  )
}