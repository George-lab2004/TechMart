import { Info, Lock } from "lucide-react"

/**
 * A specialized banner for the Admin Dashboard to communicate
 * the constraints of the public Demo account.
 */
export default function DemoBanner() {
    return (
        <div className="mb-8 p-4 rounded-2xl bg-a/5 border border-a/20 backdrop-blur-md relative overflow-hidden group">
            {/* Glossy background element */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-a/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
            
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-a/10 border border-a/20 flex items-center justify-center shrink-0">
                    <Lock className="text-a w-5 h-5" />
                </div>
                
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-text uppercase tracking-widest font-mono">
                            Demo Mode Active
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-a text-[8px] font-bold text-white uppercase animate-pulse">
                            Secure
                        </span>
                    </div>
                    <p className="text-[12px] text-text2 leading-relaxed max-w-2xl">
                        I've optimized this demo to be a clean, read-only experience for core data. This allows every reviewer 
                        to see the store as intended! Any products you add are stored in your local session for testing.
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-[10px] text-muted italic">
                        <Info size={12} />
                        <span>Note: Added items are local only; the AI Analyser will not see them.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
