import { useGetOrdersQuery, useUpdateOrderStatusMutation, type IOrder } from "@/slices/ordersApiSlice"
import { useState } from "react"
import AdminHeader from "../components/AdminHeader"
import AdminStatCard from "../components/AdminStatCard"
import AdminTable from "../components/AdminTable"
import toast from "react-hot-toast"
import OrderDetailsModal from "./OrderDetailsModal"


function Orders() {
    const { data, isLoading, error } = useGetOrdersQuery()
    const [updateStatus] = useUpdateOrderStatusMutation()

    // ── UI State ─────────────────────────
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [sortBy, setSortBy] = useState("newest")
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)

    if (isLoading)
        return (
            <div className="p-8 text-center font-bebas text-2xl tracking-widest opacity-20 animate-pulse">
                SYNCHRONIZING ORDERS...
            </div>
        )

    if (error)
        return (
            <div className="p-8 text-center text-red-500 font-mono text-xs">
                Error loading orders.
            </div>
        )

    const orders: IOrder[] = data ?? []

    // ── Stats ────────────────────────────
    const totalOrders = orders.length
    const paidOrders = orders.filter(o => o.isPaid).length
    const deliveredOrders = orders.filter(o => o.status === "delivered").length
    const pendingOrders = orders.filter(o => o.status === "pending").length

    // ── Filter / Search / Sort ───────────
    const filteredOrders = orders
        .filter(order => {
            const matchesSearch =
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order._id.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter ? order.status === statusFilter : true

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            if (sortBy === "priceHigh") return b.totalPrice - a.totalPrice
            if (sortBy === "priceLow") return a.totalPrice - b.totalPrice
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateStatus({ orderId: id, status }).unwrap()
            toast.success(`Order status updated to ${status}`)
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || "Failed to update status")
            console.error("Failed to update status:", err)
        }
    }

    return (
        <>
            {/* ── Header ───────────────────── */}
            <AdminHeader
                title="Orders"
                description="Manage customer orders"
            />

            {/* ── Stats ───────────────────── */}
            <div className="flex flex-wrap gap-5 justify-center mb-8">
                <AdminStatCard label="Total Orders" value={totalOrders} />
                <AdminStatCard label="Paid" value={paidOrders} textClass="text-a3" />
                <AdminStatCard label="Delivered" value={deliveredOrders} textClass="text-green-600" />
                <AdminStatCard label="Pending" value={pendingOrders} textClass="text-orange-600" />
            </div>

            {/* ── Table ───────────────────── */}
            <AdminTable
                headers={[
                    "#",
                    "Order",
                    "User",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Date",
                    "Actions"
                ]}
                data={filteredOrders}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={[
                    {
                        label: "Status",
                        value: statusFilter,
                        onChange: setStatusFilter,
                        options: [
                            { label: "Pending", value: "pending" },
                            { label: "Processing", value: "processing" },
                            { label: "Shipped", value: "shipped" },
                            { label: "Delivered", value: "delivered" },
                            { label: "Cancelled", value: "cancelled" }
                        ]
                    }
                ]}
                sortConfig={{
                    value: sortBy,
                    onChange: setSortBy,
                    options: [
                        { label: "Newest First", value: "newest" },
                        { label: "Highest Price", value: "priceHigh" },
                        { label: "Lowest Price", value: "priceLow" }
                    ]
                }}
                renderRow={(order, index) => (
                    <tr
                        key={order._id}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-a/5 border-t border-gb transition-all cursor-pointer group/row"
                    >
                        {/* Index */}
                        <td className="px-6 py-4 font-mono text-[10px]">
                            {index + 1}
                        </td>

                        {/* Order */}
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-text">
                                    #{order.orderNumber}
                                </span>
                                <span className="text-[10px] opacity-40 font-mono">
                                    {order._id.slice(-6)}
                                </span>
                            </div>
                        </td>

                        {/* User */}
                        <td>
                            <div className="flex flex-col">
                                <span>{order.user?.name} </span>
                                <span className="text-[10px] opacity-50">
                                    {order.user?.email}
                                </span>
                            </div>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4 text-center font-mono text-[10px]">
                            {order.orderItems.length}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 text-right">
                            <span className="font-bold text-text">
                                ${order.totalPrice}
                            </span>
                        </td>

                        {/* Payment */}
                        <td className="px-6 py-4 text-center">
                            <span
                                className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${order.isPaid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {order.isPaid ? "Paid" : "Unpaid"}
                            </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                            <span
                                className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${order.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "pending"
                                        ? "bg-orange-100 text-orange-700"
                                        : order.status === "cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-center font-mono text-[10px]">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                                <select
                                    value={order.status}
                                    onClick={(e) => e.stopPropagation()} // Prevent modal from opening
                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                    className="bg-surf border border-gb rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-text outline-none focus:border-a transition-all relative z-10"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </td>
                    </tr>
                )}
            />

            {/* ── Details Modal ──────────────── */}
            {selectedOrder && (
                <OrderDetailsModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                />
            )}
        </>
    )
}

export default Orders