import { useGetMyOrdersQuery } from "@/slices/ordersApiSlice"
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, ChevronDown, CreditCard, ShoppingBag, MapPin, ChevronRight } from "lucide-react"
import { useState, type JSX } from "react"

const statusConfig: Record<string, { label: string; icon: JSX.Element; color: string; cardColor: string; stepIndex: number }> = {
    pending: { label: "Pending", icon: <Clock size={16} />, color: "text-amber-500", cardColor: "text-amber-500 bg-amber-500/10 border-amber-500/20", stepIndex: 0 },
    processing: { label: "Processing", icon: <Package size={16} />, color: "text-blue-500", cardColor: "text-blue-500 bg-blue-500/10 border-blue-500/20", stepIndex: 1 },
    shipped: { label: "Shipped", icon: <Truck size={16} />, color: "text-purple-500", cardColor: "text-purple-500 bg-purple-500/10 border-purple-500/20", stepIndex: 2 },
    delivered: { label: "Delivered", icon: <CheckCircle2 size={16} />, color: "text-green-500", cardColor: "text-green-500 bg-green-500/10 border-green-500/20", stepIndex: 3 },
    cancelled: { label: "Cancelled", icon: <XCircle size={16} />, color: "text-red-500", cardColor: "text-red-500 bg-red-500/10 border-red-500/20", stepIndex: -1 },
}

const TimelineStep = ({ label, date, active, current, isLast }: any) => (
    <div className="flex gap-4 min-h-[60px]">
        <div className="flex flex-col items-center">
            <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${current ? "bg-a border-a scale-125 shadow-[0_0_10px_rgba(var(--a-rgb),0.5)]" : active ? "bg-a border-a" : "bg-transparent border-gb"}`} />
            {!isLast && <div className={`w-0.5 grow mt-1 mb-1 transition-all ${active ? "bg-a" : "bg-gb"}`} />}
        </div>
        <div className={`pb-6 transition-all ${active ? "opacity-100" : "opacity-30"}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-text leading-none">{label}</p>
            {date && <p className="text-[9px] font-mono text-muted mt-1.5 uppercase tracking-tighter">{date}</p>}
        </div>
    </div>
)

const OrderCard = ({ order, isOpen, onToggle }: any) => {
    const [showPriceDetails, setShowPriceDetails] = useState(false)
    const config = statusConfig[order.status] || statusConfig.pending

    const deliverySteps = [
        { label: "Order Placed", date: new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short' }).format(new Date(order.createdAt)) },
        { label: "Processing", date: order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? "Verified" : "" },
        { label: "On The Way", date: order.status === 'shipped' || order.status === 'delivered' ? "Dispatched" : "" },
        { label: "Delivered", date: order.status === 'delivered' ? "Received" : "" },
    ]

    return (
        <div className={`bg-glass border border-gb rounded-3xl backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 ${isOpen ? "border-a/40 shadow-2xl ring-2 ring-a/5" : ""}`}>
            {/* Header */}
            <div onClick={onToggle} className="flex items-center justify-between p-6 cursor-pointer">
                <div className="flex items-center gap-5 flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${config.cardColor}`}>
                        {config.icon}
                    </div>
                    <div>
                        <p className="text-a font-mono text-sm font-bold uppercase tracking-wider">#{order.orderNumber}</p>
                        <p className="text-muted text-[11px] font-bold uppercase font-mono tracking-widest mt-1">
                            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(order.createdAt))} · {order.orderItems.length} {order.orderItems.length === 1 ? 'Item' : 'Items'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-text font-black text-2xl tracking-tight">${order.totalPrice.toLocaleString()}</span>
                        <p className="text-[10px] text-muted font-bold tracking-widest uppercase">Total Paid</p>
                    </div>
                    <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${config.cardColor}`}>
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${order.status !== 'delivered' && order.status !== 'cancelled' ? "bg-current" : ""}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 bg-current`}></span>
                        </span>
                        {order.status}
                    </div>
                    <ChevronDown className={`text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={20} />
                </div>
            </div>

            {/* Expanded Content */}
            <div className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-[1200px] opacity-100 border-t border-gb" : "max-h-0 opacity-0"}`}>
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-surf/5">
                    {/* Left: Items & Timeline */}
                    <div className="space-y-10">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingBag size={14} className="text-a" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-a">Products Purchased</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                {order.orderItems.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4 bg-surf shadow-inner border border-gb p-4 rounded-3xl group hover:border-a/30 transition-colors">
                                        <div className="w-14 h-14 bg-white rounded-2xl border border-gb p-2 flex shrink-0 items-center justify-center overflow-hidden">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="font-bold text-text text-sm truncate">{item.name}</p>
                                            <p className="text-[9px] text-text2 uppercase font-mono tracking-widest mt-1.5 opacity-70">
                                                Qty: {item.qty} <span className="mx-2 opacity-30">|</span> ${item.price} each
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-black text-text text-sm">${(item.price * item.qty).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-8 text-a">
                                <MapPin size={14} />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Delivery Progress</h3>
                            </div>
                            <div className="pl-2">
                                {deliverySteps.map((step, i) => (
                                    <TimelineStep
                                        key={i}
                                        {...step}
                                        active={i <= config.stepIndex}
                                        current={i === config.stepIndex}
                                        isLast={i === deliverySteps.length - 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment & Breakdown */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-6 text-a">
                                <CreditCard size={14} />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Logistics & Billing</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="bg-surf border border-gb p-6 rounded-3xl shadow-inner group hover:border-a/20 transition-all">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-4 opacity-50">Payment Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-bg border border-gb flex items-center justify-center text-base">
                                            {order.paymentMethod === 'paypal' ? '🔵' : '💳'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-text uppercase tracking-wider">{order.paymentMethod}</p>
                                            <p className={`text-[9px] font-black mt-1 uppercase ${order.isPaid ? "text-green-500" : "text-amber-500"}`}>
                                                {order.isPaid ? `Success` : "Pending"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-surf border border-gb p-6 rounded-3xl shadow-inner group hover:border-a/20 transition-all">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-4 opacity-50">Ship To</p>
                                    <p className="text-[11px] font-bold text-text2 leading-relaxed">
                                        {order.shippingAddress.streetNumber} {order.shippingAddress.buildingNumber}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Price Action */}
                        <div className="relative">
                            <div className={`bg-bg border border-gb p-6 rounded-[2.5rem] transition-all duration-300 ${showPriceDetails ? "bg-surf/20" : ""}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted opacity-60">Final Settlement</p>
                                        <p className="text-3xl font-black text-text tracking-tighter">${order.totalPrice.toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowPriceDetails(!showPriceDetails) }}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-gb transition-all hover:bg-a hover:text-white hover:border-a ${showPriceDetails ? "bg-a text-white border-a" : "bg-surf text-text2"}`}
                                    >
                                        <ChevronRight size={24} className={`transition-transform duration-300 ${showPriceDetails ? "rotate-90" : ""}`} />
                                    </button>
                                </div>

                                <div className={`transition-all duration-300 overflow-hidden ${showPriceDetails ? "max-h-40 opacity-100 mt-6 pt-6 border-t border-gb/50" : "max-h-0 opacity-0"}`}>
                                    <div className="space-y-3 px-2">
                                        {[
                                            { label: "Subtotal", val: (order.totalPrice - order.taxPrice - order.shippingPrice) },
                                            { label: "Handling Fee", val: order.taxPrice },
                                            { label: "Dispatch Fee", val: order.shippingPrice },
                                        ].map((p, i) => (
                                            <p key={i} className="flex justify-between text-[11px] font-bold uppercase tracking-widest font-mono">
                                                <span className="text-muted">{p.label}</span>
                                                <span className="text-text2">${p.val.toLocaleString()}</span>
                                            </p>
                                        ))}
                                        <p className="flex justify-between text-xs font-black uppercase tracking-widest border-t border-gb pt-3 mt-3 text-a">
                                            <span>Payable</span>
                                            <span>${order.totalPrice.toLocaleString()}</span>
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

export default function Orders() {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery()
    const [searchQuery, setSearchQuery] = useState("")
    const [openOrder, setOpenOrder] = useState<string | null>(null)

    if (isLoading) return <div className="p-20 text-center uppercase tracking-widest font-mono text-sm opacity-50">Verifying History...</div>
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
        <div className="mx-40 py-10">
            {/* Breadcrumbs */}
            <div className="font-mono flex text-[0.7rem] uppercase tracking-[0.2em] text-muted mb-8">
                <span className="text-text2 opacity-60">Home</span>
                <span className="mx-2 opacity-30">/</span>
                <span className="text-a font-bold">Orders</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                <div className="flex-col">
                    <h1 className="text-6xl font-black uppercase tracking-tighter leading-none bg-linear-to-r from-a to-a3 bg-clip-text text-transparent">
                        My Orders
                    </h1>
                    <h5 className="text-[11px] font-bold uppercase font-mono tracking-[0.3em] mt-3 text-text2 opacity-70">
                        History & Real-time Tracking
                    </h5>
                </div>

                <div className="flex gap-4">
                    {[
                        { label: "Volume", val: orders?.length || 0, color: "shadow-blue-500", text: "text-text" },
                        { label: "Completed", val: numDelivered, color: "shadow-green-700", text: "text-green-700" },
                        { label: "Active", val: numProcessing + numPending, color: "shadow-blue-500", text: "text-blue-700" },
                        { label: "Lifetime", val: `$${totalSpent.toLocaleString()}`, color: "shadow-green-700", text: "text-green-700" },
                    ].map((s, i) => (
                        <div key={i} className={`border-2 shadow-xs ${s.color} px-10 h-fit hover:shadow-[0_-1px_5px_rgba(0,0,0,0.2)] py-1 mt-10 bg-surf flex-col flex items-center justify-center rounded-2xl`}>
                            <span className={`font-display text-xl ${s.text}`}>{s.val}</span>
                            <span className="font-mono text-[10px] uppercase font-bold text-text2 tracking-widest">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Tabs & Search */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mt-12 py-8 border-y border-gb">
                <div className="flex flex-wrap gap-3" >
                    {Object.keys(statusConfig).map((key, i) => {
                        const s = statusConfig[key];
                        return (
                            <div key={i} className="flex items-center gap-2.5 bg-card border border-gb px-5 py-2.5 rounded-full transition-all hover:border-a/30 group cursor-default">
                                <span className={`${s.color} opacity-80 group-hover:opacity-100 transition-opacity`}>{s.icon}</span>
                                <span className="text-xs sm:text-sm font-bold text-text2 tracking-tight">{s.label}</span>
                                <span className="w-5 h-5 flex items-center justify-center bg-gb rounded-full text-[10px] font-black text-text">
                                    {orders?.filter(o => o.status === key).length || 0}
                                </span>
                            </div>
                        )
                    })}
                </div>

                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text2 opacity-40 group-focus-within:text-a group-focus-within:opacity-100 transition-all" size={18} />
                    <input
                        type="text"
                        placeholder="Search track ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-card border border-gb pl-12 pr-6 py-3.5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-a/20 focus:border-a transition-all placeholder:opacity-30"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="flex flex-col gap-6 mt-12">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gb rounded-4xl bg-surf/10">
                        <Package size={48} className="mx-auto text-muted opacity-20 mb-4" />
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