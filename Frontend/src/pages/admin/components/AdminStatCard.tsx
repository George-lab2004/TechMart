import React from 'react'

interface AdminStatCardProps {
    label: string
    value: string | number
    textClass?: string
}

/**
 * Reusable Stat Card component for the Admin dashboard.
 * Preserves the original multi-layered border and hover transition style.
 */
const AdminStatCard: React.FC<AdminStatCardProps> = ({ label, value, textClass = "text-text" }) => {
    return (
        <div className="text-text2 px-5 flex flex-col sm:flex-row items-center font-display py-1 rounded-2xl border-t-gray-700 border-t-2 border-l-gray-700 border-l-2 hover:border-t-0 hover:border-l-0 transition-all hover:border-b-gray-700 hover:border-b-2 hover:border-r-gray-700 hover:border-r-2 shadow-lg shadow-black/5 dark:shadow-white/5 text-xl cursor-default group">
            <span className="opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-tight text-[15px] sm:text-xl">
                {label}
            </span>
            <span className={`font-bold font-mono sm:ms-2 ${textClass}`}>
                {value}
            </span>
        </div>
    )
}

export default AdminStatCard
