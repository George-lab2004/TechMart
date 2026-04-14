import { motion } from "framer-motion"
import { ShieldCheck, Settings, Users, ShoppingBag, Info } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

export default function Dashboard() {
    const { userInfo } = useSelector((state: RootState) => state.auth)

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 rounded-3xl bg-a/10 flex items-center justify-center text-a shadow-2xl shadow-a/20 border border-a/20"
            >
                <ShieldCheck size={48} />
            </motion.div>

            <div className="text-center space-y-4 max-w-lg">
                <h1 className="text-4xl font-black text-text tracking-tighter uppercase">
                    Admin Control Center
                </h1>
                <p className="text-text2 font-bold opacity-60 leading-relaxed uppercase tracking-widest text-[10px]">
                    System initialized. Welcome to the TechMart mission control. 
                    Use the sidebar terminal to manage products, orders, and categories.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
                {[
                    { label: "Manage Inventory", icon: ShoppingBag, color: "text-a" },
                    { label: "User Directory", icon: Users, color: "text-blue-400" },
                    { label: "System Config", icon: Settings, color: "text-purple-400" },
                ].map((item, idx) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="bg-card border border-gb p-6 rounded-3xl flex flex-col items-center gap-3 hover:border-a/30 transition-all cursor-not-allowed group"
                    >
                        <item.icon size={24} className={`${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text2 opacity-80">{item.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Demo Notice */}
            {userInfo?.isDemo && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 p-4 rounded-2xl bg-a/5 border border-a/10 flex items-center gap-3 text-left max-w-xl"
                >
                    <Info className="text-a shrink-0" size={18} />
                    <p className="text-[11px] text-text2 leading-relaxed italic">
                        I've optimized this demo to be a clean, read-only experience for core data. This allows every reviewer 
                        to see the store as intended! Any products you add are stored in your local session for testing.
                    </p>
                </motion.div>
            )}
        </div>
    )
}
