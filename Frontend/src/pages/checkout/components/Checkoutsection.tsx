import { motion, AnimatePresence } from "framer-motion"

interface Props {
    title: string
    number: string
    isActive: boolean
    isCompleted: boolean
    onEdit?: () => void
    summary?: React.ReactNode
    children: React.ReactNode
}

export default function CheckoutSection({ title, number, isActive, isCompleted, onEdit, summary, children }: Props) {
    return (
        <div className={`relative overflow-hidden bg-[var(--card)] border rounded-3xl transition-all duration-500
            ${isActive ? 'border-[var(--a)] shadow-[0_8px_32px_rgba(0,128,255,0.1)] ring-1 ring-[var(--a)/20]' : 
              isCompleted ? 'border-[var(--gb)] opacity-80 hover:opacity-100' : 'border-[var(--gb)] opacity-50'}`}
        >
            {/* Header */}
            <div className={`flex items-center justify-between p-5 sm:p-6 ${isActive ? 'bg-[var(--ag)]' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-inner transition-colors
                        ${isCompleted && !isActive ? 'bg-[var(--a)] text-white' : 
                          isActive ? 'bg-[var(--a)] text-white' : 'bg-[var(--gb)] text-[var(--muted)]'}`}>
                        {isCompleted && !isActive ? "✓" : number}
                    </div>
                    <h2 className={`text-lg sm:text-xl font-black tracking-wide ${isActive ? 'text-[var(--text)]' : 'text-[var(--text2)]'}`}>
                        {title}
                    </h2>
                </div>
                {isCompleted && !isActive && onEdit && (
                    <button onClick={onEdit} className="text-[10px] uppercase tracking-[0.2em] font-black text-[var(--a)] hover:text-[var(--a3)] transition-colors py-2 px-3 hover:bg-[var(--a)]/10 rounded-lg">
                        Edit
                    </button>
                )}
            </div>

            {/* Content or Summary */}
            <AnimatePresence initial={false} mode="wait">
                {isActive ? (
                    <motion.div 
                       key="content"
                       initial={{ height: 0, opacity: 0 }} 
                       animate={{ height: "auto", opacity: 1 }} 
                       exit={{ height: 0, opacity: 0 }}
                       transition={{ duration: 0.3, ease: "easeInOut" }}
                       className="px-5 sm:px-6 pb-6 pt-2 space-y-6"
                    >
                        {children}
                    </motion.div>
                ) : isCompleted && summary ? (
                    <motion.div
                       key="summary"
                       initial={{ height: 0, opacity: 0 }} 
                       animate={{ height: "auto", opacity: 1 }} 
                       exit={{ height: 0, opacity: 0 }}
                       transition={{ duration: 0.3, ease: "easeInOut" }}
                       className="px-5 sm:px-6 pb-6 pt-0 text-sm font-medium text-[var(--text2)]"
                    >
                        {summary}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}