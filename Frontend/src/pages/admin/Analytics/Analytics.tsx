import { motion } from "framer-motion"
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { 
    TrendingUp, Users, 
    ShoppingBag, Loader2, AlertCircle, 
    Calendar, Download
} from 'lucide-react'
import { useGetAnalyticsQuery } from "@/slices/adminApiSlice"

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const CustomTooltip = ({ active, payload, label, prefix = "" }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-bg/90 backdrop-blur-xl border border-gb p-4 rounded-2xl shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-text2 mb-1">{label}</p>
                <p className="text-sm font-black text-a">
                    {prefix}{payload[0].value.toLocaleString()}
                </p>
            </div>
        )
    }
    return null
}

export default function Analytics() {
    const { data: analytics, isLoading, error } = useGetAnalyticsQuery({})

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
                <Loader2 className="w-10 h-10 text-a animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text2 animate-pulse">
                    Parsing Quantum Data Streams...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-a2/10 border border-a2/20 p-12 rounded-[40px] flex flex-col items-center gap-4 text-center max-w-md mx-auto mt-20">
                <AlertCircle className="text-a2 w-16 h-16 mb-4" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Mission Critical Failure</h3>
                <p className="text-xs text-text2 leading-relaxed opacity-70">
                    The analytics engine failed to synchronize with the main-frame. Please verify your clearance levels.
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-8 py-4 bg-a2 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-a2/20 hover:scale-105 transition-all"
                >
                    Hard Reset
                </button>
            </div>
        )
    }

    const { stats, charts } = analytics || {}

    // Format Data
    const revenueData = charts?.revenueByMonth?.map((d: any) => ({ name: MONTHS[d._id], revenue: d.revenue }))
    const ordersData = charts?.ordersByMonth?.map((d: any) => ({ name: MONTHS[d._id], orders: d.orders }))
    const productsData = charts?.topProducts?.map((d: any) => ({ name: d.name, value: d.totalSold }))
    const statusData = charts?.orderStatus?.map((d: any) => ({ name: d._id.toUpperCase(), value: d.count }))
    const usersData = charts?.usersGrowth?.map((d: any) => ({ name: MONTHS[d._id], users: d.users }))

    return (
        <div className="space-y-12 pb-20">
            {/* 🚀 Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Market Intelligence</h1>
                    <p className="text-xs text-text2 font-bold uppercase tracking-widest opacity-60">Real-time performance metrics & forecasting</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-gb rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-a/40 transition-all">
                        <Calendar size={14} className="text-a" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-a text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-a/20 hover:scale-105 transition-all">
                        <Download size={14} />
                        Export Data
                    </button>
                </div>
            </div>

            {/* 📈 Primary Trends */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Growth (Area Chart) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-gb p-8 rounded-[40px] relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-black text-text2 uppercase tracking-[0.2em] mb-1">Revenue Stream</p>
                            <h3 className="text-2xl font-black tracking-tighter">${stats?.totalRevenue?.toLocaleString()}</h3>
                        </div>
                        <TrendingUp size={24} className="text-a opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip prefix="$" />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#6366f1" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* User Acquisition (Line Chart) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-card border border-gb p-8 rounded-[40px]"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-black text-text2 uppercase tracking-[0.2em] mb-1">User Acquisition</p>
                            <h3 className="text-2xl font-black tracking-tighter">{stats?.totalUsers?.toLocaleString()} Users</h3>
                        </div>
                        <Users size={24} className="text-a3 opacity-20" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={usersData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Line 
                                    type="stepAfter" 
                                    dataKey="users" 
                                    stroke="#10b981" 
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* 📊 Deep Analytics Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Order Volume (Bar Chart) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    className="bg-card border border-gb p-8 rounded-[40px] col-span-2"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text2">Order Volume Dynamics</h4>
                        <ShoppingBag size={18} className="text-a opacity-30" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ordersData}>
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                                />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#ffffff05' }} content={<CustomTooltip />} />
                                <Bar 
                                    dataKey="orders" 
                                    fill="#6366f1" 
                                    radius={[10, 10, 0, 0]} 
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Status distribution (Pie Chart) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                    className="bg-card border border-gb p-8 rounded-[40px]"
                >
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text2 mb-10">Order Status Matrix</h4>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {statusData?.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                        {statusData?.map((entry: any, index: number) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* 🏆 Top Products (Horizontal Bars) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-card border border-gb p-10 rounded-[40px]"
            >
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-ag rounded-2xl flex items-center justify-center">
                        <TrendingUp size={24} className="text-a" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black tracking-tighter uppercase leading-none mb-1">Elite Inventory</h4>
                        <p className="text-[10px] font-bold text-text2 uppercase tracking-widest opacity-60">Top performing assets by sales volume</p>
                    </div>
                </div>

                <div className="space-y-8 max-w-4xl">
                    {productsData?.map((product: any, idx: number) => (
                        <div key={idx} className="space-y-2 group">
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                <span className="group-hover:text-a transition-colors">{product.name}</span>
                                <span className="text-text2">{product.value} Units</span>
                            </div>
                            <div className="h-4 bg-bg border border-gb rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(product.value / Math.max(...productsData.map((p: any) => p.value))) * 100}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 + idx * 0.1, ease: "circOut" }}
                                    className="h-full bg-ag border-r-4 border-a"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
