// ── FRONTEND FIX: The entire AiChat component ──
// The core bug: you were bypassing Gemini entirely.
// The correct flow: send { message, history } → Gemini decides function → backend executes it

import { useState, useRef, useEffect } from "react"
import { useSendMessageMutation } from "@/slices/aiApiSlice"

interface AIMessage {
    role: "user" | "model"
    parts: { text: string }[]
}

interface DisplayMessage {
    from: "user" | "ai"
    text: string
    data?: any          // structured data from function calls
    fn?: string       // which function was called
}

export default function AiChat() {
    const [messages, setMessages] = useState<DisplayMessage[]>([
        { from: "ai", text: "Hi! I'm your TechMart AI assistant. Ask me to search products, compare items, manage your cart, and more." }
    ])
    const [history, setHistory] = useState<AIMessage[]>([])
    const [input, setInput] = useState("")
    const [sendMessage, { isLoading }] = useSendMessageMutation()
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = async () => {
        const text = input.trim()
        if (!text || isLoading) return

        // 1. Add user message to display
        setMessages(prev => [...prev, { from: "user", text }])
        setInput("")

        // 2. Build history for Gemini (includes previous turns)
        const newHistory: AIMessage[] = [
            ...history,
            { role: "user", parts: [{ text }] }
        ]

        try {
            // 3. Send { message, history } — backend sends to Gemini,
            //    Gemini decides which function to call, backend executes it
            const res = await sendMessage({
                message: text,
                history: history   // ← pass previous turns so AI has memory
            }).unwrap()

            // 4. Add AI response to display
            setMessages(prev => [...prev, {
                from: "ai",
                text: res.message,
                data: res.data,
                fn: res.functionCalled,
            }])

            // 5. Update history with both turns for next message
            setHistory([
                ...newHistory,
                { role: "model", parts: [{ text: res.message }] }
            ])

        } catch (err: any) {
            setMessages(prev => [...prev, {
                from: "ai",
                text: `Something went wrong: ${err?.data?.message || err.message || "Unknown error"}`
            }])
        }
    }

    // Render product cards when AI returns search results
    const renderData = (fn: string, data: any) => {
        if (!data || !Array.isArray(data) || data.length === 0) return null

        const productFns = ["searchProducts", "getRecommendedProducts", "filterByCategory",
            "filterByBrand", "filterByPrice", "filterByRating", "compareProducts"]
        if (!productFns.includes(fn)) return null

        return (
            <div className="grid grid-cols-1 gap-2 mt-2">
                {data.map((p: any) => (
                    <div key={p.id || p._id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gb bg-glass backdrop-blur-sm
                       hover:border-a/40 transition-all duration-200">
                        {p.image && (
                            <img src={p.image} alt={p.name}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gb" />
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-text truncate">{p.name}</div>
                            <div className="font-mono text-xs text-muted">{p.brand}</div>
                            {p.inStock === false && (
                                <span className="font-mono text-[9px] text-a2 bg-a2/10 px-2 py-0.5 rounded-full border border-a2/20">
                                    Out of stock
                                </span>
                            )}
                        </div>
                        <div className="font-display text-lg text-a3 flex-shrink-0">
                            ${p.price?.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full max-h-[680px] bg-card backdrop-blur-xl
                    border border-gb rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gb bg-surf2">
                <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-a to-a2
                          flex items-center justify-center text-white font-bold text-sm">AI</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                          bg-a3 border-2 border-surf2 animate-pulse"/>
                </div>
                <div>
                    <div className="font-semibold text-sm text-text">TechMart Assistant</div>
                    <div className="font-mono text-[9px] text-muted tracking-widest uppercase">
                        Powered by Gemini
                    </div>
                </div>
                <button
                    onClick={() => { setMessages([{ from: "ai", text: "Chat cleared. How can I help?" }]); setHistory([]) }}
                    className="ml-auto font-mono text-[9px] tracking-widest uppercase text-muted
                     hover:text-a2 transition-colors cursor-pointer"
                >
                    Clear
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[82%] ${m.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>

                            {m.from === "ai" && (
                                <div className="font-mono text-[9px] text-muted tracking-widest uppercase pl-1">
                                    {m.fn ? `⚡ ${m.fn}` : "assistant"}
                                </div>
                            )}

                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${m.from === "user"
                                    ? "bg-a text-white rounded-br-sm"
                                    : "bg-glass border border-gb text-text rounded-bl-sm backdrop-blur-sm"
                                }`}>
                                {m.text}
                            </div>

                            {m.fn && m.data && renderData(m.fn, m.data)}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-glass border border-gb backdrop-blur-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
                {["Search laptops under $1500", "Show my cart", "Recommend products", "Compare MacBook vs Dell"].map(p => (
                    <button key={p}
                        onClick={() => { setInput(p); }}
                        className="font-mono text-[9px] tracking-wider uppercase whitespace-nowrap
                       px-3 py-1.5 rounded-full border border-gb bg-glass text-muted
                       hover:border-a hover:text-a transition-all flex-shrink-0">
                        {p}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4">
                <div className="flex gap-2 items-center bg-glass border border-gb rounded-xl
                        px-4 py-2 focus-within:border-a transition-colors">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Search products, manage cart, compare…"
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none outline-none font-body text-sm
                       text-text placeholder:text-muted disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="w-8 h-8 rounded-lg bg-a text-white flex items-center justify-center
                       disabled:opacity-40 disabled:cursor-not-allowed hover:bg-a/90
                       transition-all active:scale-95 flex-shrink-0 font-bold text-sm"
                    >
                        {isLoading ? "…" : "↑"}
                    </button>
                </div>
            </div>
        </div>
    )
}