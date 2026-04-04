import AdminAiChat from "@/AI/AdminAiChat";
import { useState } from "react";
import { LineChart as ChartIcon } from "lucide-react";

export default function AdminChatWidget() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {open && (
                <div className="w-[450px] max-w-[90vw] h-[700px] max-h-[80vh] mb-4 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
                    <AdminAiChat />
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 border-2 border-indigo-400/30"
            >
                {open ? (
                    <span className="font-mono text-xl">✖</span>
                ) : (
                    <ChartIcon className="w-7 h-7" />
                )}
            </button>
        </div>
    );
}
