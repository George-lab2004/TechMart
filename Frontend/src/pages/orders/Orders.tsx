import { useGetMyOrdersQuery } from "@/slices/ordersApiSlice"
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, ChevronDown, CreditCard, ShoppingBag, MapPin } from "lucide-react"
import { useState, type JSX } from "react"
import Loader from "@/Components/Loader"

const statusConfig: Record<string, { label: string; icon: JSX.Element; color: string; cardColor: string; bg: string; stepIndex: number }> = {
    pending:    { label: "Pending",    icon: <Clock size={16} />,        color: "text-amber-500",  cardColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",   bg: "bg-amber-500",  stepIndex: 0 },
    processing: { label: "Processing", icon: <Package size={16} />,      color: "text-blue-500",   cardColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",      bg: "bg-blue-500",   stepIndex: 1 },
    shipped:    { label: "Shipped",    icon: <Truck size={16} />,        color: "text-purple-500", cardColor: "text-purple-500 bg-purple-500/10 border-purple-500/20", bg: "bg-purple-500", stepIndex: 2 },
    delivered:  { label: "Delivered",  icon: <CheckCircle2 size={16} />, color: "text-green-500",  cardColor: "text-green-500 bg-green-500/10 border-green-500/20",   bg: "bg-green-500",  stepIndex: 3 },
    cancelled:  { label: "Cancelled",  icon: <XCircle size={16} />,      color: "text-red-500",    cardColor: "text-red-500 bg-red-500/10 border-red-500/20",         bg: "bg-red-500",    stepIndex: -1 },
}

// ── Horizontal timeline (mobile-friendly) ─────────────────────────────────
const HorizontalTimeline = ({ steps, activeIndex }: { steps: { label: string; date: string }[]; activeIndex: number }) => (
    <div className="flex items-start gap-0 w-full">
        {steps.map((step, i) => {
            const done = i <= activeIndex
            const current = i === activeIndex
            return (
                <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                    {/* connector line */}
                    {i > 0 && (
                        <div className={`absolute top-[9px] right-1/2 w-full h-[2px] -z-10 transition-all ${done ? "bg-a" : "bg-gb"}`} />
                    )}
                    {/* dot */}
                    <div className={`w-[18px] h-[18px] rounded-full border-2 transition-all shrink-0 z-10 ${current ? "bg-a border-a scale-125 shadow-[0_0_12px_rgba(79,142,255,0.5)]" : done ? "bg-a border-a" : "bg-card border-gb"}`} />
                    {/* label */}
                    <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider mt-2 leading-tight transition-all ${done ? "text-text" : "text-muted opacity-40"}`}>
                        {step.label}
                    </p>
                    {step.date && (
                        <p className={`text-[8px] sm:text-[9px] font-mono mt-1 transition-all ${done ? "text-a" : "text-muted opacity-30"}`}>
                            {step.date}
                        </p>
                    )}
                </div>
            )
        })}
    </div>
)

// ── Order Card ─────────────────────────────────────────────────────────────
const OrderCard = ({ order, isOpen, onToggle }: any) => {
    const config = statusConfig[order.status] || statusConfig.pending

    const deliverySteps = [
        { label: "Placed", date: new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short' }).format(new Date(order.createdAt)) },
        { label: "Processing", date: order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? "Verified" : "" },
        { label: "Shipped", date: order.status === 'shipped' || order.status === 'delivered' ? "Dispatched" : "" },
        { label: "Delivered", date: order.status === 'delivered' ? "Received" : "" },
    ]

    return (
        <div className={`bg-card border rounded-2xl sm:rounded-3xl transition-all duration-300 ${isOpen ? "border-a/40 shadow-[0_8px_40px_rgba(79,142,255,0.08)] ring-1 ring-a/10" : "border-gb shadow-sm hover:shadow-md hover:border-gb/80"}`}>

            {/* ── HEADER (always visible) ── */}
            <div onClick={onToggle} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 cursor-pointer gap-3 sm:gap-5">

                {/* Left: icon + order info */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border ${config.cardColor}`}>
                        {config.icon}
                    </div>
                    <div className="min-w-0">
                        <p className="text-a font-mono text-xs sm:text-sm font-bold uppercase tracking-wider truncate">#{order.orderNumber}</p>
                        <p className="text-muted text-[10px] sm:text-[11px] font-bold uppercase font-mono tracking-wide mt-0.5 truncate">
                            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(order.createdAt))} · {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                </div>

                {/* Right: price + status + chevron */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 pl-14 sm:pl-0">
                    <span className="text-text font-black text-lg sm:text-2xl tracking-tight">${order.totalPrice.toLocaleString()}</span>

                    <div className={`hidden sm:flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border ${config.cardColor}`}>
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${order.status !== 'delivered' && order.status !== 'cancelled' ? "bg-current" : ""}`} />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                        </span>
                        {config.label}
                    </div>

                    {/* Mobile-only status dot */}
                    <div className={`sm:hidden flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${config.cardColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {config.label}
                    </div>

                    <ChevronDown className={`text-muted transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} size={18} />
                </div>
            </div>

            {/* ── EXPANDED DETAILS ── */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="border-t border-gb">
                    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

                        {/* ── DELIVERY TIMELINE ── */}
                        {order.status !== 'cancelled' && (
                            <div className="bg-surf/50 border border-gb rounded-2xl p-4 sm:p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <MapPin size={14} className="text-a" />
                                    <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-a">Delivery Progress</h3>
                                </div>
                                <HorizontalTimeline steps={deliverySteps} activeIndex={config.stepIndex} />
                            </div>
                        )}

                        {order.status === 'cancelled' && (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 sm:p-6 flex items-center gap-3">
                                <XCircle size={20} className="text-red-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-black text-red-500 uppercase tracking-wide">Order Cancelled</p>
                                    <p className="text-[11px] text-red-400/70 mt-0.5">This order has been cancelled and will not be processed.</p>
                                </div>
                            </div>
                        )}

                        {/* ── PRODUCTS LIST ── */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ShoppingBag size={14} className="text-a" />
                                <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-a">
                                    Items ({order.orderItems.length})
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2 sm:gap-3">
                                {order.orderItems.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 sm:gap-4 bg-surf border border-gb p-3 sm:p-4 rounded-xl sm:rounded-2xl group hover:border-a/30 transition-colors">
                                        <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl border border-gb p-1.5 sm:p-2 flex shrink-0 items-center justify-center overflow-hidden">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-text text-xs sm:text-sm truncate">{item.name}</p>
                                            <p className="text-[9px] sm:text-[10px] text-text2 uppercase font-mono tracking-wide mt-1 opacity-70">
                                                Qty: {item.qty} <span className="mx-1.5 opacity-30">·</span> ${item.price} each
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-black text-text text-xs sm:text-sm">${(item.price * item.qty).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── LOGISTICS + PRICE BREAKDOWN (side by side on lg) ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                            {/* Payment & Shipping Info */}
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <CreditCard size={14} className="text-a" />
                                    <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-a">Logistics & Billing</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-surf border border-gb p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-3 opacity-50">Payment</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-bg border border-gb flex items-center justify-center text-base">
                                                {order.paymentMethod === 'paypal' ? '🔵' : '💳'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-text uppercase tracking-wider">{order.paymentMethod}</p>
                                                <p className={`text-[9px] font-black mt-0.5 uppercase ${order.isPaid ? "text-green-500" : "text-amber-500"}`}>
                                                    {order.isPaid ? "Paid" : "Pending"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-surf border border-gb p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-3 opacity-50">Ship To</p>
                                        <p className="text-[11px] font-bold text-text2 leading-relaxed">
                                            {order.shippingAddress?.streetNumber ?? "N/A"} {order.shippingAddress?.buildingNumber ?? ""}<br />
                                            {order.shippingAddress?.city ?? "N/A"}, {order.shippingAddress?.country ?? "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-surf/50 border border-gb rounded-xl sm:rounded-2xl p-4 sm:p-5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-4 opacity-50">Price Breakdown</p>
                                <div className="space-y-2.5">
                                    {[
                                        { label: "Subtotal", val: (order.totalPrice - order.taxPrice - order.shippingPrice) },
                                        { label: "Tax", val: order.taxPrice },
                                        { label: "Shipping", val: order.shippingPrice },
                                    ].map((p, i) => (
                                        <p key={i} className="flex justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wide font-mono">
                                            <span className="text-muted">{p.label}</span>
                                            <span className="text-text2">${p.val.toLocaleString()}</span>
                                        </p>
                                    ))}
                                    <div className="border-t border-gb pt-3 mt-3">
                                        <p className="flex justify-between text-sm font-black uppercase tracking-wide">
                                            <span className="text-text">Total</span>
                                            <span className="text-a">${order.totalPrice.toLocaleString()}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Main Orders Page ──────────────────────────────────────────────────────
export default function Orders() {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery()
    const [searchQuery, setSearchQuery] = useState("")
    const [openOrder, setOpenOrder] = useState<string | null>(null)

    if (isLoading) return <Loader message="Loading orders..." />
    if (error) return <div className="p-20 text-center text-red-500 font-mono">Access Denied: History unavailable</div>

    const filteredOrders = orders?.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    const numPending = orders?.filter((o) => o.status === "pending").length || 0
    const numDelivered = orders?.filter((o) => o.status === "delivered").length || 0
    const numProcessing = orders?.filter((o) => o.status === "processing").length || 0
    const totalSpent = orders?.reduce((acc, o) => acc + (o.totalPrice || 0), 0) || 0

    return (
        <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40 py-6 sm:py-10">

            {/* Breadcrumbs */}
            <div className="font-mono flex text-[0.7rem] uppercase tracking-[0.2em] text-muted mb-6 sm:mb-8">
                <span className="text-text2 opacity-60">Home</span>
                <span className="mx-2 opacity-30">/</span>
                <span className="text-a font-bold">Orders</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8 mb-8 sm:mb-12">
                <div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none bg-linear-to-r from-a to-a3 bg-clip-text text-transparent">
                        My Orders
                    </h1>
                    <h5 className="text-[10px] sm:text-[11px] font-bold uppercase font-mono tracking-[0.2em] sm:tracking-[0.3em] mt-2 sm:mt-3 text-text2 opacity-70">
                        History & Real-time Tracking
                    </h5>
                </div>

                {/* Stat cards */}
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    {[
                        { label: "Volume", val: orders?.length || 0, color: "shadow-blue-500", text: "text-text" },
                        { label: "Completed", val: numDelivered, color: "shadow-green-700", text: "text-green-700" },
                        { label: "Active", val: numProcessing + numPending, color: "shadow-blue-500", text: "text-blue-700" },
                        { label: "Lifetime", val: `$${totalSpent.toLocaleString()}`, color: "shadow-green-700", text: "text-green-700" },
                    ].map((s, i) => (
                        <div key={i} className={`border-2 shadow-xs ${s.color} px-6 sm:px-10 h-fit hover:shadow-[0_-1px_5px_rgba(0,0,0,0.2)] py-1 bg-surf flex-col flex items-center justify-center rounded-2xl`}>
                            <span className={`font-display text-lg sm:text-xl ${s.text}`}>{s.val}</span>
                            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold text-text2 tracking-widest">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Tabs & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 py-5 sm:py-6 border-y border-gb">
                {/* Status pills — horizontal scroll on mobile */}
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto no-scrollbar">
                    {Object.keys(statusConfig).map((key, i) => {
                        const s = statusConfig[key]
                        return (
                            <div key={i} className="flex items-center gap-2 bg-card border border-gb px-3 sm:px-4 py-2 rounded-full transition-all hover:border-a/30 group cursor-default shrink-0">
                                <span className={`${s.color} opacity-80 group-hover:opacity-100 transition-opacity`}>{s.icon}</span>
                                <span className="text-[11px] sm:text-xs font-bold text-text2 tracking-tight">{s.label}</span>
                                <span className="w-5 h-5 flex items-center justify-center bg-gb rounded-full text-[10px] font-black text-text">
                                    {orders?.filter(o => o.status === key).length || 0}
                                </span>
                            </div>
                        )
                    })}
                </div>

                <div className="relative group w-full sm:w-72 md:w-80 shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text2 opacity-40 group-focus-within:text-a group-focus-within:opacity-100 transition-all" size={16} />
                    <input
                        type="text"
                        placeholder="Search order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-card border border-gb pl-11 pr-4 py-3 rounded-xl sm:rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-a/20 focus:border-a transition-all placeholder:opacity-30"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-10">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 border-2 border-dashed border-gb rounded-2xl sm:rounded-3xl bg-surf/10">
                        <Package size={40} className="mx-auto text-muted opacity-20 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest font-mono text-muted">No records found</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            isOpen={openOrder === order._id}
                            onToggle={() => setOpenOrder(openOrder === order._id ? null : order._id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}