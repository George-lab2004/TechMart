import { useState, useRef, useEffect } from "react"
import { useSendAdminMessageMutation } from "@/slices/aiApiSlice"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface AIMessage {
    role: "user" | "model"
    parts: { text: string }[]
}

interface DisplayMessage {
    from: "user" | "ai"
    text: string
    data?: any
    fn?: string
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const formatAiText = (text: string) => {
    if (!text) return "";
    let safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Markdown Table Parser
    safe = safe.replace(/(?:^|\n)\|(.+)\|\n\|(?:[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (header, body) => {
        const ths = header.split('|').filter(Boolean).map((h: string) =>
            `<th class="px-3 py-2 border border-gb bg-surf text-left text-xs font-bold text-text2 tracking-wider">${h.trim()}</th>`
        ).join('');

        const trs = body.trim().split('\n').filter(Boolean).map((row: string) => {
            const tds = row.split('|').filter(Boolean).map((d: string) =>
                `<td class="px-3 py-2 border border-gb text-text text-xs">${d.trim()}</td>`
            ).join('');
            return `<tr class="hover:bg-surf2/50 transition-colors">${tds}</tr>`;
        }).join('');

        return `<div class="overflow-x-auto my-4 rounded-xl border border-gb shadow-xl"><table class="w-full border-collapse"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
    });

    return safe
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text font-bold">$1</strong>')
        .replace(/(?:^|\n)[\*\-]\s+(.*)/g, '\n<li class="ml-4 list-disc marker:text-a">$1</li>')
        .replace(/(?:^|\n)(\d+\.)\s+(.*)/g, '\n<li class="ml-4 list-decimal marker:text-a"><span class="font-bold text-text2 mr-1">$1</span>$2</li>');
};

export default function AdminAiChat() {
    const [messages, setMessages] = useState<DisplayMessage[]>([
        { from: "ai", text: "Senior Business Analyst initialized. How can I assist with your store analytics today?" }
    ])
    const [history, setHistory] = useState<AIMessage[]>([])
    const [input, setInput] = useState("")
    const [sendMessage, { isLoading }] = useSendAdminMessageMutation()
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = async () => {
        const text = input.trim()
        if (!text || isLoading) return

        setMessages(prev => [...prev, { from: "user", text }])
        setInput("")

        const newHistory: AIMessage[] = [
            ...history,
            { role: "user", parts: [{ text }] }
        ]

        try {
            const res = await sendMessage({
                message: text,
                history: history
            }).unwrap()

            setMessages(prev => [...prev, {
                from: "ai",
                text: res.message,
                data: res.data,
                fn: res.functionCalled,
            }])

            const contextData = res.data ? `\n[Internal Context - Tool ${res.functionCalled} returned: ${JSON.stringify(res.data)}]` : "";
            const finalHistory: AIMessage[] = [
                ...newHistory,
                { role: "model", parts: [{ text: res.message + contextData }] }
            ];

            setHistory(finalHistory)

            // Auto multi-step resolution for charts!
            if (res.functionCalled && res.functionCalled !== "renderChart") {
                const autoRes = await sendMessage({
                    message: "Analyze the fetched data. If I originally requested a chart, call the 'renderChart' tool right now with the data. If not, just give me a text recommendation.",
                    history: finalHistory,
                    isSystemMessage: true
                }).unwrap()

                setMessages(prev => [...prev, {
                    from: "ai",
                    text: autoRes.message,
                    data: autoRes.data,
                    fn: autoRes.functionCalled,
                }])

                const contextData2 = autoRes.data ? `\n[Internal Context - Tool ${autoRes.functionCalled} returned: ${JSON.stringify(autoRes.data)}]` : "";
                setHistory([
                    ...finalHistory,
                    { role: "user", parts: [{ text: "Analyze the fetched data. If I originally requested a chart, call the 'renderChart' tool right now with the data. If not, just give me a text recommendation." }] },
                    { role: "model", parts: [{ text: autoRes.message + contextData2 }] }
                ])
            }

        } catch (err: any) {
            const errorData = err?.data;
            let finalMsg = "System Error. Please try again.";

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
            }])
        }
    }

    const renderChartNode = (chartData: any) => {
        if (!chartData || !chartData.data) return null;

        let normalizedData = chartData.data;
        if (!Array.isArray(normalizedData)) {
            if (typeof normalizedData === "object") {
                normalizedData = Object.entries(normalizedData).map(([name, value]) => ({ name, value }));
            } else {
                return null;
            }
        }

        const { title, type } = chartData;
        const data = normalizedData;

        // Theme aware tooltip
        const CustomTooltip = ({ active, payload, label }: any) => {
            if (active && payload && payload.length) {
                return (
                    <div className="bg-surf border border-gb p-3 rounded-lg shadow-xl backdrop-blur-md">
                        <p className="text-muted text-xs mb-1 font-mono">{label}</p>
                        <p className="text-text font-bold">{payload[0].value.toLocaleString()}</p>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className="mt-4 w-full bg-surf2 rounded-xl border border-gb p-4 shadow-inner-sm">
                <div className="text-sm font-bold text-text mb-4 font-mono uppercase tracking-widest">{title}</div>
                <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        {type === 'pie' ? (
                            <PieChart>
                                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5}>
                                    {data.map((_entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text2)' }} />
                            </PieChart>
                        ) : type === 'line' ? (
                            <LineChart data={data} margin={{ left: -20, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--gb)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 10 }} />
                                <YAxis stroke="var(--muted)" tick={{ fontSize: 10 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="value" stroke="var(--a)" strokeWidth={3} dot={{ r: 4, fill: 'var(--a)', strokeWidth: 0 }} />
                            </LineChart>
                        ) : (
                            // Default to bar chart
                            <BarChart data={data} margin={{ left: -20, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--gb)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 10 }} />
                                <YAxis stroke="var(--muted)" tick={{ fontSize: 10 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="var(--a)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    const renderProductsGrid = (products: any[]) => {
        if (!products || products.length === 0) return null;
        return (
            <div className="mt-3 grid grid-cols-1 gap-2 w-full">
                {products.map((p: any, idx: number) => (
                    <div key={p.id || idx} className="flex items-center gap-3 p-3 rounded-lg border border-gb bg-surf2 hover:border-a/50 transition-colors">
                        {p.image ? (
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-contain shrink-0 bg-white p-0.5" />
                        ) : (
                            <div className="w-10 h-10 rounded bg-bg2 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="text-text text-xs font-bold truncate">{p.name}</div>
                            <div className="text-text2 text-[10px] font-mono mt-0.5 tracking-tight flex items-center gap-2">
                                <span>Stock: <span className={p.countInStock <= 5 ? "text-a2 font-bold" : "text-a3"}>{p.countInStock}</span></span>
                                <span className="text-gb">|</span>
                                <span>Sold: {p.soldCount}</span>
                            </div>
                        </div>
                        <div className="text-a text-xs font-mono font-bold shrink-0">
                            ${p.price?.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderOrdersTable = (orders: any[]) => {
        if (!orders || orders.length === 0) return null;
        return (
            <div className="mt-3 w-full rounded-lg border border-gb bg-surf2 overflow-hidden shadow-lg">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left text-[10px] text-text2 font-mono whitespace-nowrap">
                        <thead className="bg-bg2 text-text uppercase tracking-widest border-b border-gb">
                            <tr>
                                <th className="px-3 py-2 font-medium">Order #</th>
                                <th className="px-3 py-2 font-medium">Customer</th>
                                <th className="px-3 py-2 font-medium text-right">Total</th>
                                <th className="px-3 py-2 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o: any, idx: number) => (
                                <tr key={o._id || idx} className="border-b border-gb/50 hover:bg-surf2/80 transition-colors last:border-0">
                                    <td className="px-3 py-2 truncate max-w-[80px]">{o.orderNumber || o._id?.substring(0, 8)}</td>
                                    <td className="px-3 py-2">{o.user?.name || "Guest"}</td>
                                    <td className="px-3 py-2 text-a text-right font-bold">${o.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-3 py-2 text-right">
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider ${o.isDelivered ? 'bg-a3/10 text-a3 border border-a3/20' : 'bg-a2/10 text-a2 border border-a2/20'}`}>
                                            {o.isDelivered ? "Delivered" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderStatsCard = (stats: any) => {
        if (!stats) return null;
        return (
            <div className="mt-3 grid grid-cols-2 gap-2 w-full font-mono text-center">
                {stats.totalRevenue !== undefined && (
                    <div className="p-3 bg-a/10 border border-a/30 rounded-lg col-span-2 shadow-inner">
                        <div className="text-[10px] text-a uppercase tracking-widest mb-1">Total Revenue</div>
                        <div className="text-2xl text-text font-bold">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                )}
                {stats.totalOrders !== undefined && (
                    <div className="p-3 bg-surf2 border border-gb rounded-lg hover:border-text/10 transition-colors">
                        <div className="text-[9px] text-text2 uppercase tracking-widest">Total Orders</div>
                        <div className="text-sm text-text mt-1 font-bold">{stats.totalOrders}</div>
                    </div>
                )}
                {stats.avgOrderValue !== undefined && (
                    <div className="p-3 bg-surf2 border border-gb rounded-lg hover:border-text/10 transition-colors">
                        <div className="text-[9px] text-text2 uppercase tracking-widest">Avg Order Value</div>
                        <div className="text-sm text-a3 mt-1 font-bold">${stats.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                )}
            </div>
        );
    };

    const renderData = (fn: string, data: any) => {
        if (!fn || !data) return null;

        if (fn === "renderChart" && data.chartData) {
            const chartNode = renderChartNode(data.chartData);
            if (chartNode) return chartNode;
        }

        if (data.products && Array.isArray(data.products)) {
            const node = renderProductsGrid(data.products);
            if (node) return node;
        }

        if (data.orders && Array.isArray(data.orders)) {
            const node = renderOrdersTable(data.orders);
            if (node) return node;
        }

        if (data.stats) {
            const node = renderStatsCard(data.stats);
            if (node) return node;
        }

        // Fallback for any unknown data models
        return (
            <div className="mt-2 w-full rounded-xl border border-gb bg-bg p-3 max-h-40 overflow-y-auto scrollbar-thin">
                <pre className="text-[10px] text-text2 font-mono">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-bg overflow-hidden shadow-2xl">
            {/* Pro Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gb bg-surf">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-a to-a/70
                        flex items-center justify-center text-white font-bold text-lg">📈</div>
                <div>
                    <div className="font-bold text-sm text-text uppercase tracking-widest font-mono">Business Analyst</div>
                    <div className="font-mono text-[9px] text-text2 tracking-widest uppercase">Admin Secure Portal</div>
                </div>
                <button
                    onClick={() => { setMessages([{ from: "ai", text: "Session Reset. Ready for analytics." }]); setHistory([]) }}
                    className="ml-auto font-mono text-[9px] tracking-widest uppercase text-muted
                     hover:text-a2 transition-colors cursor-pointer"
                >
                    PURGE
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-thin scrollbar-thumb-gb">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] ${m.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                            {m.fn && m.from === "ai" && (
                                <div className="font-mono text-[9px] text-a tracking-widest uppercase pl-1 mb-1">
                                    [SYS_EXEC: {m.fn}]
                                </div>
                            )}

                            {m.text && (
                                <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap font-mono
                                    ${m.from === "user"
                                        ? "bg-a text-white rounded-br-sm shadow-xl shadow-a/20"
                                        : "bg-surf2 border border-gb text-text rounded-bl-sm"
                                    }`}>
                                    {m.from === "user" ? (
                                        m.text
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: formatAiText(m.text) }} />
                                    )}
                                </div>
                            )}

                            {m.fn && m.data && renderData(m.fn, m.data)}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-5 py-4 rounded-xl rounded-bl-sm bg-surf2 border border-gb flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-a animate-pulse" />
                            <div className="w-1.5 h-6 bg-a2 animate-pulse delay-75" />
                            <div className="w-1.5 h-3 bg-a3 animate-pulse delay-150" />
                            <span className="text-[10px] text-muted font-mono uppercase tracking-widest ml-2">Running Aggregation...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
                {["Plot Top 5 Products as Bar Chart", "30-day Revenue stat", "Low stock alerts"].map(p => (
                    <button key={p}
                        onClick={() => { setInput(p); }}
                        className="font-mono text-[9px] tracking-wider uppercase whitespace-nowrap
                       px-3 py-1.5 rounded-md border border-gb bg-surf text-text2
                       hover:border-a hover:text-a transition-all shrink-0">
                        {p}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-bg">
                <div className="flex gap-2 items-center bg-surf border border-gb rounded-xl
                        px-4 py-2 focus-within:border-a transition-colors shadow-inner-sm">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Query database..."
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none outline-none font-mono text-sm
                       text-text placeholder:text-muted disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        aria-label="Send database query"
                        disabled={isLoading || !input.trim()}
                        className="w-10 h-10 rounded-lg bg-a text-white flex items-center justify-center
                       disabled:opacity-40 disabled:cursor-not-allowed hover:bg-a/90
                       transition-all active:scale-95 shrink-0 font-mono font-bold"
                    >
                        {isLoading ? "■" : "EXE"}
                    </button>
                </div>
            </div>
        </div>
    )
}
