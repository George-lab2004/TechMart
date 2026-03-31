// src/components/ChatWidget.tsx
import AiChat from "@/AI/AiComponents";
import { useState } from "react";

interface ChatWidgetProps {
    userId: string;
}

export default function ChatWidget({ userId }: ChatWidgetProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Chat window */}
            {open && (
                <div className="w-96 h-[600px] mb-2 shadow-lg rounded-2xl overflow-hidden">
                    <AiChat />
                </div>
            )}

            {/* Floating toggle button */}
            <button
                onClick={() => setOpen(!open)}
                className="w-14 h-14 rounded-full bg-a text-white flex items-center justify-center shadow-lg hover:bg-a/90 transition-all active:scale-95"
            >
                {open ? "✖" : "💬"}
            </button>
        </div>
    );
}