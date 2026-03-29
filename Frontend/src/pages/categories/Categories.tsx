import GridBackground from '@/Components/GridBackground'
import HeroHeadline from '@/Components/HeroHeadline'
import { motion } from 'framer-motion'
import { Laptop, Mouse, Smartphone, Headphones, Gamepad2, Tv2, Watch, Camera, ChevronRight } from 'lucide-react'
import CountUp from '@/Components/CountUp'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useGetCategoriesQuery, type category } from '@/slices/categoryApiSlice'

const stats = [
    { value: 12, suffix: "K", label: "Users" },
    { value: 8, suffix: "K", label: "Orders" },
    { value: 12, suffix: "K", label: "Products" },
];

const floatingIcons = [
    { icon: Mouse, style: { top: "4%", left: "50%", marginLeft: -28 }, delay: 0.2, size: 28 },
    { icon: Smartphone, style: { top: "12%", left: "12%" }, delay: 0, size: 28 },
    { icon: Headphones, style: { top: "12%", right: "8%" }, delay: 0.4, size: 28 },
    { icon: Gamepad2, style: { top: "44%", left: "2%" }, delay: 0.8, size: 26 },
    { icon: Tv2, style: { top: "44%", right: "2%" }, delay: 1.2, size: 26 },
    { icon: Watch, style: { top: "74%", left: "12%" }, delay: 0.6, size: 26 },
    { icon: Camera, style: { top: "74%", right: "8%" }, delay: 1.0, size: 26 },
];

function Categories() {
    const { data: catData, isLoading } = useGetCategoriesQuery();
    const categories = catData?.result || [];

    return (
        <div className="relative pb-32">
            <GridBackground />

            {/* Breadcrumb */}
            <div className="font-mono flex text-[0.75rem] text-muted mb-8 uppercase tracking-widest">
                <span className="text-text2">Home</span>&nbsp;/ ALL Categories
            </div>

            {/* Hero Hub */}
            <div className="mb-20">
                <HeroHeadline
                    line1="Shop by" line2="Category" line3="Catalog" size="text-8xl"
                />

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mt-12">
                    <div className="flex flex-col gap-8 max-w-xl">
                        <p className="text-text2 text-lg font-medium leading-relaxed opacity-80">
                            Discover our curated collection of premium electronics. From high-performance laptops to cutting-edge wearables, we bring you the tools of the future.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {stats.map((item, i: number) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.15 }}
                                    className="flex flex-col items-center justify-center px-8 py-6
                                           bg-surf border border-gb rounded-3xl shadow-sm
                                           hover:bg-surf2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                                    <div className="text-2xl font-black text-text">
                                        <CountUp to={item.value} suffix={item.suffix} /><span className="text-a">+</span>
                                    </div>
                                    <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-muted">{item.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Floating Hub — desktop only */}
                    <div className="hidden lg:block relative w-80 h-112 shrink-0 -mt-60 me-20 overflow-visible">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-48 rounded-full bg-a/10 blur-[80px] animate-pulse" />
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <motion.div
                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-[2.5rem] bg-surf/30 border-2 border-gb shadow-2xl flex items-center justify-center backdrop-blur-xl"
                            >
                                <Laptop size={44} className="text-a shadow-[0_0_20px_var(--a)]" />
                            </motion.div>
                        </div>

                        {floatingIcons.map(({ icon: Icon, style: s, delay, size }, i: number) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -10, 0],
                                    rotate: [0, 3, 0, -3, 0]
                                }}
                                transition={{
                                    opacity: { duration: 0.5, delay: i * 0.1 },
                                    scale: { duration: 0.5, delay: i * 0.1 },
                                    y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay },
                                    rotate: { duration: 5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay }
                                }}
                                style={s}
                                className="absolute z-20 w-16 h-16 rounded-2xl bg-surf/30 border border-gb shadow-lg flex items-center justify-center backdrop-blur-md hover:border-a/40 hover:shadow-[0_0_30px_-5px_var(--a)] transition-all group"
                            >
                                <Icon size={size} className="text-a opacity-60 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Full Category Grid */}
            <div className="mt-20">
                <div className="flex justify-between items-end mb-12">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Collections</h2>
                        <div className="w-20 h-1 bg-a rounded-full" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Explore {categories.length} segments</p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(n => <div key={n} className="h-64 bg-surf animate-pulse rounded-3xl border border-gb" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat: category, i: number) => (
                            <Link to={`/products?category=${cat.name}`} key={cat._id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className="group relative bg-surf border border-gb rounded-[2.5rem] overflow-hidden hover:border-a/20 transition-all duration-500"
                                >
                                    <div className="aspect-16/10 overflow-hidden relative">
                                        <img
                                            src={cat.images?.[0]?.url || 'https://images.unsplash.com/photo-1519389950473-acc7569d4035?q=80&w=2070&auto=format&fit=crop'}
                                            alt={cat.name}
                                            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/20 to-transparent opacity-80" />

                                        <div className="absolute bottom-8 left-8 right-8">
                                            <div className="flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-a mb-1">Catalog Item</span>
                                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-text">{cat.name}</h3>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-a text-white flex items-center justify-center shadow-[0_10px_20px_-5px_var(--a)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100">
                                                    <ChevronRight size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-8 py-6 flex justify-between items-center border-t border-gb/10">
                                        <span className="text-[10px] font-mono text-muted uppercase tracking-widest leading-none">High Fidelity Series</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(dot => <div key={dot} className="w-1 h-1 rounded-full bg-a opacity-20" />)}
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Categories
