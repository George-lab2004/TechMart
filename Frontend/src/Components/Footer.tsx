import AnimatedDot from './AnimatedDot'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { useGetCategoriesQuery, type category } from "@/slices/categoryApiSlice"

const Footer = () => {
    const { data, isLoading, isError } = useGetCategoriesQuery()

    if (isLoading) return <p className="text-center py-20 text-muted">Loading categories...</p>;
    if (isError) return <p className="text-center py-20 text-muted">Failed to load categories.</p>;

    const categories: category[] = data?.result ?? [];

    return (
        <div className="bg-surf border-t border-gb py-12 px-10 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand Section */}
                <div className="flex flex-col gap-6 col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2">
                        <span className="flex  ">
                            <AnimatedDot color="dot-gray" size="lg" />

                        </span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter leading-none bg-linear-to-r from-gray-600 to-blue-900 bg-clip-text text-transparent">
                            TechMart
                        </h1>
                    </div>
                    <p className="text-text2 text-[11px] font-bold uppercase font-mono tracking-widest leading-relaxed opacity-60">
                        Premium tech gadgets for those who demand the best. Curated, tested, and delivered with care.
                    </p>
                    <div className="flex gap-4">
                        {[
                            { Icon: Facebook, label: "Facebook" },
                            { Icon: Twitter, label: "Twitter" },
                            { Icon: Instagram, label: "Instagram" },
                            { Icon: Youtube, label: "Youtube" }
                        ].map(({ Icon, label }, i) => (
                            <span 
                                key={i} 
                                role="button"
                                aria-label={`Visit our ${label} page`}
                                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-r from-gray-600 to-blue-900 text-white shadow-lg  hover:scale-110 transition-all cursor-pointer group"
                            >
                                <Icon size={18} className="text-white" />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Categories Section */}
                <div className="flex flex-col gap-6">
                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] bg-linear-to-r from-gray-600 to-blue-900 bg-clip-text text-transparent">Shop Categories</h5>
                    <div className="flex flex-col gap-3">
                        {categories.map((cat) => (
                            <span key={cat._id} className="text-[11px] font-bold uppercase font-mono tracking-widest text-text2 hover:text-blue-900 transition-colors cursor-pointer opacity-70 hover:opacity-100">
                                {cat.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Company Section */}
                <div className="flex flex-col gap-6">
                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] bg-linear-to-r from-gray-600 to-blue-900 bg-clip-text text-transparent">Platform</h5>
                    <div className="flex flex-col gap-3">
                        {['Support', 'Privacy Policy', 'Terms of Service', 'Affiliate'].map((link) => (
                            <span key={link} className="text-[11px] font-bold uppercase font-mono tracking-widest text-text2 hover:text-blue-900 transition-colors cursor-pointer opacity-70 hover:opacity-100">
                                {link}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="flex flex-col gap-6">
                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] bg-linear-to-r from-gray-600 to-blue-900 bg-clip-text text-transparent">Stay Updated</h5>
                    <div className="relative group">
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full bg-card border border-gb py-3 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-gray-600 to-blue-900 text-white py-1.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-20 pt-8 border-t border-gb flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-muted">
                <p>© 2026 TechMart Global. All Rights Reserved.</p>
                <div className="flex gap-8">
                    <span>Privacy</span>
                    <span>TOS</span>
                    <span>Sitemap</span>
                </div>
            </div>
        </div>
    )
}

export default Footer

