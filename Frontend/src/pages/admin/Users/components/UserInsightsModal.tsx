import type { user } from "@/slices/usersApiSlice"
import { X, Bot, MessageSquare, Activity } from "lucide-react"

interface UserInsightsModalProps {
    isOpen: boolean
    onClose: () => void
    user: user | null
}

function UserInsightsModal({ isOpen, onClose, user }: UserInsightsModalProps) {
    if (!isOpen || !user) return null

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-bg border border-gb w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gb bg-surf/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-a/10 flex items-center justify-center border border-a/20">
                            <Bot className="text-a w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bebas tracking-widest text-text">User AI Insights</h2>
                            <p className="text-[10px] text-muted uppercase tracking-tighter">Engagement Analytics for {user.name}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-text"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* User Info Header */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-surf/30 border border-gb">
                        <div className="w-12 h-12 rounded-full bg-bg border border-gb flex items-center justify-center text-xl font-bebas text-muted">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-text">{user.name}</h3>
                            <p className="text-[10px] font-mono opacity-50">{user.email}</p>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${user.isAdmin ? 'bg-a/20 text-a border border-a/30' : 'bg-surf border border-gb text-muted'}`}>
                            {user.isAdmin ? 'Administrator' : 'Customer'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Usage Counter */}
                        <div className="p-5 rounded-2xl bg-surf/30 border border-gb space-y-3 group hover:border-a/30 transition-all">
                            <div className="flex items-center gap-2 text-muted">
                                <Activity size={14} className="group-hover:text-a transition-colors" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Total Usage</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bebas text-text">{user.aiUsageCount || 0}</span>
                                <span className="text-[10px] text-muted uppercase">Requests</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="p-5 rounded-2xl bg-surf/30 border border-gb space-y-3">
                            <div className="flex items-center gap-2 text-muted">
                                <Bot size={14} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">AI Status</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${user.aiUsageCount > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`} />
                                <span className="text-xs font-bold text-text">
                                    {user.aiUsageCount > 0 ? 'Active Explorer' : 'No Engagement'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Last Message */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-muted px-1">
                            <MessageSquare size={14} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Latest Query</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-surf/50 border border-gb relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1 h-full bg-a opacity-30" />
                           {user.lastAiMessage ? (
                               <p className="text-sm text-text2 italic leading-relaxed">
                                   "{user.lastAiMessage}"
                               </p>
                           ) : (
                               <p className="text-xs text-muted italic">
                                   No messages sent to the AI assistant yet.
                               </p>
                           )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gb bg-surf/20 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-surf border border-gb text-xs font-bold hover:bg-white/5 transition-all text-text"
                    >
                        Close Insights
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserInsightsModal
