import Loader from "@/Components/Loader"
import { Card, CardContent } from "@/Components/ui/card";
import { useGetCategoriesQuery, type category } from "@/slices/categorySlice"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react";
function CategroiesSection() {
    const { data, isLoading, isError } = useGetCategoriesQuery()
    const categories: category[] = data?.result ?? [];
    if (isLoading) return <Loader />
    if (isError) return <p className="text-center py-20 text-muted">Failed to load categories.</p>;

    return (
        <div className="py-12">
            <h2 className="text-4xl font-display uppercase tracking-widest mb-8 px-4 text-text">Top Categories</h2>
            <div className="flex items-center justify-end px-4 mb-2 gap-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    Scroll for more
                </span>

                <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-10 pt-4 no-scrollbar scroll-smooth px-4">

                {categories.map((cat) => (
                    <Card
                        key={cat._id}
                        className="flex-none w-80 h-64 cursor-pointer hover:scale-105 transition-all duration-500 relative overflow-hidden border-none group shadow-lg dark:shadow-2xl [--card-bg:white] dark:[--card-bg:var(--dynamic-bg,var(--surf))]"
                        style={{
                            backgroundColor: "var(--card-bg)",
                            "--dynamic-bg": cat.color,
                            boxShadow: cat.glowColor
                                ? undefined // Let Tailwind handle shadow unless it's a glow
                                : undefined,
                        } as React.CSSProperties}
                    >
                        <CardContent
                            className="p-6 flex flex-col items-center justify-center h-full text-center relative"
                            style={{
                                boxShadow: cat.glowColor ? `inset 0 0 40px ${cat.glowColor}30` : undefined
                            }}
                        >
                            {/* Animated Highlight */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white/20 dark:bg-white/10 pointer-events-none" />

                            {/* IMAGE */}
                            <div className="h-48 w-48 mb-6 flex items-center justify-center group-hover:rotate-3 transition-transform duration-500 relative z-10">
                                <img
                                    src={cat.images?.[0]?.url}
                                    alt={cat.images?.[0]?.alt}
                                    className="max-w-full max-h-full object-contain filter drop-shadow-xl"
                                />
                            </div>

                            {/* NAME */}
                            <h3 className={`font-display text-2xl uppercase tracking-widest relative z-10 transition-colors duration-500 ${cat.color ? 'text-text dark:text-white' : 'text-text'}`}>
                                {cat.name}
                            </h3>

                            {/* DESCRIPTION */}

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default CategroiesSection