// ── FRONTEND FIX: The entire AiChat component ──
// The core bug: you were bypassing Gemini entirely.
// The correct flow: send { message, history } → Gemini decides function → backend executes it

import { useState, useRef, useEffect } from "react"
import { useSendMessageMutation } from "@/slices/aiApiSlice"
import { useDispatch } from "react-redux"
import { addToCart, removeFromCart, clearCart } from "@/slices/cartSlice"
import { apiSlice } from "@/slices/apiSlice"
import toast from "react-hot-toast"

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

const productListFns = new Set([
    "searchProducts",
    "getRecommendedProducts",
    "filterByCategory",
    "filterByBrand",
    "filterByPrice",
    "filterByRating",
    "filterByStock",
    "filterByPriceAndRating",
    "filterByPriceAndStock",
    "filterByRatingAndStock",
    "filterByPriceAndRatingAndStock",
    "searchByIntent",
])

export default function AiChat() {
    const [messages, setMessages] = useState<DisplayMessage[]>([
        { from: "ai", text: "Hi! I'm your TechMart AI assistant. Ask me to search products, compare items, manage your cart, and more." }
    ])
    const [history, setHistory] = useState<AIMessage[]>([])
    const [input, setInput] = useState("")
    const [sendMessage, { isLoading }] = useSendMessageMutation()
    const bottomRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()

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

            // 5. Sync Redux state with backend AI actions
            if (res.data?.success) {
                if ((res.functionCalled === "addToCart" || res.functionCalled === "updateCartQuantity") && res.data.cartItem) {
                    dispatch(addToCart(res.data.cartItem));
                    dispatch(apiSlice.util.invalidateTags(['Cart']));
                    toast.success("Cart updated");
                } else if (res.functionCalled === "removeFromCart" && res.data.productId) {
                    dispatch(removeFromCart(res.data.productId));
                    dispatch(apiSlice.util.invalidateTags(['Cart']));
                    toast.success("Item removed from cart");
                } else if (res.functionCalled === "clearCart") {
                    dispatch(clearCart());
                    dispatch(apiSlice.util.invalidateTags(['Cart']));
                    toast.success("Cart cleared");
                } else if (res.functionCalled === "checkoutCart") {
                    dispatch(clearCart());       // Assuming creating an order clears cart
                    dispatch(apiSlice.util.invalidateTags(['Cart']));
                    if (res.data.redirectTo) {
                        window.location.href = res.data.redirectTo; // Since ChatWidget is mounted outside router context
                    }
                }
            }

            // 6. Update history with both turns for next message
            const contextData = res.data ? `\n[Internal Context - Tool ${res.functionCalled} returned: ${JSON.stringify(res.data)}]` : "";
            setHistory([
                ...newHistory,
                { role: "model", parts: [{ text: res.message + contextData }] }
            ])

        } catch (err: any) {
            const errorData = err?.data;
            let finalMsg = "Something went wrong. Please try again.";

            if (errorData?.error === "QUOTA_EXHAUSTED" || err?.status === 429) {
                finalMsg = "TechMart AI is out of daily messages right now. Try again tomorrow!";
            } else if (errorData?.error === "MODEL_OVERLOADED" || err?.status === 503) {
                finalMsg = "The TechMart AI is currently seeing extra high volume. Please give it a minute to catch its breath and try your request again!";
            } else if (errorData?.message) {
                finalMsg = errorData.message;
            }

            setMessages(prev => [...prev, {
                from: "ai",
                text: finalMsg
            }]);
        }
    }

    const renderProductCards = (products: any[]) => {
        if (!products.length) return null

        return (
            <div className="grid grid-cols-1 gap-2 mt-2 w-full">
                {products.map((p: any, idx: number) => (
                    <div
                        key={p.id || p._id || `${p.name}-${idx}`}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gb bg-glass backdrop-blur-sm
                       hover:border-a/40 transition-all duration-200"
                    >
                        {p.image && (
                            <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gb"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-text truncate">{p.name}</div>
                            <div className="font-mono text-xs text-muted">{p.brand || "Unknown brand"}</div>
                            {typeof p.rating === "number" && (
                                <div className="font-mono text-[10px] text-muted mt-0.5">Rating: {p.rating.toFixed(1)}</div>
                            )}
                            {p.inStock === false && (
                                <span className="font-mono text-[9px] text-a2 bg-a2/10 px-2 py-0.5 rounded-full border border-a2/20">
                                    Out of stock
                                </span>
                            )}
                        </div>
                        <div className="font-display text-lg text-a3 shrink-0">
                            {typeof p.price === "number" ? `$${p.price.toLocaleString()}` : "-"}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const renderProductDetails = (rawProduct: any) => {
        const product = rawProduct?.product || rawProduct; // Fallback in case wrapped

        if (!product?.id && !product?._id) return null

        return (
            <div className="mt-2 w-full rounded-xl border border-gb bg-glass backdrop-blur-sm p-3 space-y-3">
                <div className="flex items-start gap-4">
                    {product.image ? (
                        <div className="bg-white p-1 rounded-xl shrink-0">
                           <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded-lg border border-gb shadow-sm" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-lg bg-gb shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-text leading-tight">{product.name}</div>
                        <div className="font-mono text-xs text-muted mt-1 uppercase tracking-wider">{product.brand}</div>
                        <div className="font-display text-xl text-a3 mt-1.5 font-bold">
                            {typeof product.price === "number" ? `$${product.price.toLocaleString()}` : "-"}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded-lg border border-gb bg-card/40 p-2 flex justify-between">
                        <span className="text-muted font-mono">Category</span>
                        <span className="text-text font-medium">{product.category || "-"}</span>
                    </div>
                    <div className="rounded-lg border border-gb bg-card/40 p-2 flex justify-between">
                        <span className="text-muted font-mono">Stock</span>
                        <span className={`font-medium ${product.inStock ? "text-green-400" : "text-red-400"}`}>
                            {product.inStock ? "In stock" : "Out of stock"}
                        </span>
                    </div>
                    <div className="rounded-lg border border-gb bg-card/40 p-2 flex justify-between">
                        <span className="text-muted font-mono">Rating</span>
                        <span className="font-medium text-yellow-400">★ {typeof product.rating === "number" ? product.rating.toFixed(1) : "-"}</span>
                    </div>
                    <div className="rounded-lg border border-gb bg-card/40 p-2 flex justify-between">
                        <span className="text-muted font-mono">Reviews</span>
                        <span className="text-text font-medium">{product.numReviews ?? 0}</span>
                    </div>
                </div>

                {Array.isArray(product.quickSpecs) && product.quickSpecs.length > 0 && (
                    <div className="mt-2 space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-muted font-mono mb-2">Specifications</div>
                        {product.quickSpecs.map((spec: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-[10px] border-b border-gb/30 pb-1 last:border-0 last:pb-0">
                                <span className="text-muted">{spec.name}</span>
                                <span className="text-text font-medium text-right max-w-[60%] line-clamp-1" title={spec.value}>{spec.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {product.description && (
                    <div className="mt-2">
                        <div className="text-[10px] uppercase tracking-wider text-muted font-mono mb-1">Description</div>
                        <p className="text-[11px] text-text2 leading-relaxed line-clamp-4">{product.description}</p>
                    </div>
                )}
            </div>
        )
    }

    const renderCompare = (products: any[]) => {
        if (!products.length) return null

        return (
            <div className="mt-2 w-full flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
                {products.map((p: any, idx: number) => (
                    <div key={p.id || p._id || `compare-${idx}`} className="snap-center shrink-0 w-[240px] rounded-xl flex flex-col border border-gb bg-glass backdrop-blur-sm p-4 relative">
                        {p.image ? (
                            <div className="bg-white p-2 rounded-xl mb-3 flex items-center justify-center h-28">
                                <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                            </div>
                        ) : (
                            <div className="h-28 bg-gb rounded-xl mb-3" />
                        )}
                        <div className="text-sm font-semibold text-text text-center line-clamp-2 mb-1">{p.name}</div>
                        <div className="font-display text-lg text-a3 text-center font-bold mb-3">
                            {typeof p.price === "number" ? `$${p.price.toLocaleString()}` : "-"}
                        </div>
                        <div className="mt-auto space-y-1.5 border-t border-gb/50 pt-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted font-mono">Brand</span> 
                                <span className="text-text font-medium">{p.brand || "-"}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted font-mono">Rating</span> 
                                <span className="text-yellow-400 font-medium">★ {typeof p.rating === "number" ? p.rating.toFixed(1) : "-"}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted font-mono">Stock</span> 
                                <span className={p.inStock ? "text-green-400 font-medium" : "text-red-400 font-medium"}>{p.inStock ? "In Stock" : "Out"}</span>
                            </div>
                            
                            {Array.isArray(p.quickSpecs) && p.quickSpecs.length > 0 && (
                                <div className="pt-2 mt-2 border-t border-gb/30 space-y-1.5">
                                    <div className="text-[10px] uppercase tracking-wider text-muted font-mono pb-1">Specifications</div>
                                    {p.quickSpecs.map((spec: any, sIdx: number) => (
                                        <div key={sIdx} className="flex justify-between gap-2 text-[11px] leading-tight border-b border-gb/20 pb-1 last:border-0">
                                            <span className="text-muted shrink-0">{spec.name}</span>
                                            <span className="text-text text-right line-clamp-2" title={spec.value}>{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Render structured AI tool data from multiple backend response shapes.
    const renderData = (fn: string, data: any) => {
        if (!fn || !data) return null

        if (fn === "compareProducts") {
            const compareProducts = Array.isArray(data?.products) ? data.products : []
            return renderCompare(compareProducts)
        }

        if (fn === "getProductDetails") {
            return renderProductDetails(data)
        }

        if (fn === "searchMultipleProducts") {
            const list = Array.isArray(data?.results)
                ? data.results.filter((item: any) => item?.found)
                : []
            return renderCompare(list)
        }

        if (productListFns.has(fn)) {
            const products = Array.isArray(data)
                ? data
                : Array.isArray(data?.products)
                    ? data.products
                    : []
            return renderProductCards(products)
        }

        return null
    }

    return (
        <div className="flex flex-col h-full max-h-[680px] bg-card backdrop-blur-xl
                    border border-gb rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gb bg-surf2">
                <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-a to-a2
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

                            {m.fn && m.from === "ai" && (
                                <div className="font-mono text-[9px] text-muted tracking-widest uppercase pl-1">
                                    {`⚡ ${m.fn}`}
                                </div>
                            )}

                            {m.text && (
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                                    ${m.from === "user"
                                        ? "bg-a text-white rounded-br-sm"
                                        : "bg-glass border border-gb text-text rounded-bl-sm backdrop-blur-sm"
                                    }`}>
                                    {m.text}
                                </div>
                            )}

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
                       hover:border-a hover:text-a transition-all shrink-0">
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
                        aria-label="Send message"
                        disabled={isLoading || !input.trim()}
                        className="w-8 h-8 rounded-lg bg-a text-white flex items-center justify-center
                       disabled:opacity-40 disabled:cursor-not-allowed hover:bg-a/90
                       transition-all active:scale-95 shrink-0 font-bold text-sm"
                    >
                        {isLoading ? "…" : "↑"}
                    </button>
                </div>
            </div>
        </div>
    )
}