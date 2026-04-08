// src/components/ChatWidget.tsx
import AiChat from "@/AI/AiComponents";
import { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";

interface ChatWidgetProps {
    userId: string;
}

export default function ChatWidget({ userId }: ChatWidgetProps) {
    const [open, setOpen] = useState(false);
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const isLoggedIn = !!userInfo;

    console.log(userId);

    const handleToggle = () => {
        if (isLoggedIn) {
            setOpen(!open);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-999 flex flex-col items-end group">
            {/* Chat window */}
            {open && isLoggedIn && (
                <div className="w-96 h-[600px] mb-2 shadow-2xl rounded-2xl overflow-hidden border border-gb bg-bg animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <AiChat />
                </div>
            )}

            {/* Login Prompt Tooltip */}
            {!isLoggedIn && (
                <div className="absolute bottom-16 right-0 mb-3 w-44 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 shadow-2xl translate-y-2 group-hover:translate-y-0 text-center">
                    Authentication Required to use TechAssistant
                </div>
            )}

            {/* Floating toggle button */}
            <button
                onClick={handleToggle}
                aria-label={open ? "Close AI chat" : "Open AI chat"}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-95 border border-white/10 ${isLoggedIn
                    ? "bg-a text-white hover:bg-a/90 hover:scale-105"
                    : "bg-gb text-muted/50 cursor-not-allowed grayscale opacity-60"
                    }`}
            >
                {open && isLoggedIn ? (
                    <span className="text-xl">✕</span>
                ) : (
                    <span className="text-2xl">💬</span>
                )}
            </button>
        </div>
    );
}