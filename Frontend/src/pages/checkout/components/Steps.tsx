import { motion } from "framer-motion"

interface Props {
    step: number
}

export default function Steps({ step }: Props) {
    const steps = ["Shipping", "Payment", "Review"]

    return (
        <div className="flex items-center justify-between mb-16 relative px-8 max-w-2xl mx-auto">
            {/* Background Track Line - Increased contrast and height */}
            <div className="absolute left-12 right-12 top-5 -translate-y-1/2 h-[4px] bg-[var(--gb)] z-0 opacity-50 rounded-full" />

            {/* Active Track Line - Glowing but slightly offset to ensure visibility */}
            <motion.div
                className="absolute left-12 top-5 -translate-y-1/2 h-[4px] bg-[var(--a)] z-10 shadow-[0_0_15px_rgba(0,128,255,0.6)] rounded-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (step - 1) / (steps.length - 1) }}
                style={{ width: 'calc(100% - 96px)' }} // 48px + 48px from left and right
                transition={{ duration: 0.8, ease: "circOut" }}
            />

            {steps.map((label, index) => {
                const current = index + 1
                const passed = step > current
                const active = step === current

                return (
                    <div key={label} className="flex flex-col items-center gap-4 relative z-20">
                        {/* Circle */}
                        <motion.div
                            initial={false}
                            animate={{
                                scale: active ? 1.3 : 1,
                                backgroundColor: passed || active ? "var(--a)" : "var(--card)",
                                color: passed || active ? "#fff" : "var(--muted)",
                                border: active ? "3px solid var(--a)" : passed ? "3px solid var(--a)" : "3px solid var(--gb)"
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-xs font-black shadow-xl transition-all duration-500 bg-[var(--bg)]"
                        >
                            {passed ? "✓" : current}
                        </motion.div>

                        {/* Label */}
                        <motion.span
                            animate={{
                                color: active ? "var(--text)" : passed ? "var(--text2)" : "var(--muted)",
                                opacity: active || passed ? 1 : 0.6,
                                fontWeight: active ? 900 : 700
                            }}
                            className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black whitespace-nowrap drop-shadow-sm"
                        >
                            {label}
                        </motion.span>

                        {/* Sub-line for "Another one" beneath active step */}
                        {active && (
                            <motion.div
                                layoutId="activeStepLine"
                                className="absolute -bottom-2 w-full h-[2px] bg-[var(--a)] rounded-full shadow-[0_0_8px_var(--a)]"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}