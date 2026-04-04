import { cn } from "@/lib/utils"

// ── Primitive shimmer bar ────────────────────────────────────────────────────
function Bar({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg bg-gb",
                "before:absolute before:inset-0",
                "before:translate-x-[-100%]",
                "before:animate-[shimmer_1.8s_infinite]",
                "before:bg-gradient-to-r",
                "before:from-transparent before:via-white/[0.06] before:to-transparent",
                className
            )}
        />
    )
}

// ── Full-page skeleton ───────────────────────────────────────────────────────
export default function PageLoader() {
    return (
        <div className="relative min-h-screen bg-bg overflow-hidden">

            {/* faint grid background — same as real pages */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    backgroundImage: `
            linear-gradient(var(--gb) 1px, transparent 1px),
            linear-gradient(90deg, var(--gb) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                    maskImage:
                        "radial-gradient(ellipse at 50% 0%, black 0%, transparent 55%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse at 50% 0%, black 0%, transparent 55%)",
                }}
            />

            {/* ── NAVBAR SKELETON ── */}
            <div className="fixed top-[14px] left-1/2 z-50 -translate-x-1/2 w-[calc(100%-80px)] max-w-[1200px]">
                <div className="h-[56px] rounded-2xl bg-card border border-gb flex items-center justify-between px-5 gap-4">
                    {/* logo */}
                    <Bar className="h-4 w-32" />
                    {/* nav pills */}
                    <div className="flex gap-2">
                        <Bar className="h-8 w-20 rounded-full" />
                        <Bar className="h-8 w-20 rounded-full" />
                        <Bar className="h-8 w-20 rounded-full" />
                    </div>
                    {/* right side */}
                    <div className="flex items-center gap-2">
                        <Bar className="h-8 w-28 rounded-xl" />
                        <Bar className="h-6 w-6 rounded-full" />
                    </div>
                </div>
            </div>

            {/* ── PAGE CONTENT ── */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-[60px] pt-[104px] pb-20 space-y-10">

                {/* breadcrumb */}
                <div className="flex items-center gap-2">
                    <Bar className="h-3 w-14" />
                    <Bar className="h-3 w-2" />
                    <Bar className="h-3 w-24" />
                </div>

                {/* page title block */}
                <div className="space-y-3">
                    <Bar className="h-4 w-24" />
                    <Bar className="h-14 w-80" />
                    <Bar className="h-4 w-64" />
                </div>

                {/* ── CONTENT AREA — adapts to most pages ── */}
                <div className="grid grid-cols-3 gap-6">

                    {/* main column */}
                    <div className="col-span-2 space-y-4">
                        {/* big card */}
                        <div className="rounded-2xl bg-card border border-gb p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Bar className="h-5 w-40" />
                                <Bar className="h-8 w-24 rounded-xl" />
                            </div>
                            <Bar className="h-48 w-full rounded-xl" />
                            <Bar className="h-4 w-full" />
                            <Bar className="h-4 w-5/6" />
                            <Bar className="h-4 w-4/6" />
                        </div>

                        {/* second card */}
                        <div className="rounded-2xl bg-card border border-gb p-6 space-y-4">
                            <Bar className="h-5 w-32" />
                            <div className="grid grid-cols-2 gap-4">
                                <Bar className="h-24 rounded-xl" />
                                <Bar className="h-24 rounded-xl" />
                                <Bar className="h-24 rounded-xl" />
                                <Bar className="h-24 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* side column */}
                    <div className="col-span-1 space-y-4">
                        <div className="rounded-2xl bg-card border border-gb p-6 space-y-4">
                            <Bar className="h-5 w-28" />
                            <Bar className="h-4 w-full" />
                            <Bar className="h-4 w-5/6" />
                            <Bar className="h-4 w-4/6" />
                            <div className="pt-2 space-y-2 border-t border-gb">
                                <Bar className="h-3 w-full" />
                                <Bar className="h-3 w-full" />
                                <Bar className="h-3 w-3/4" />
                            </div>
                            <Bar className="h-11 w-full rounded-xl" />
                        </div>

                        <div className="rounded-2xl bg-card border border-gb p-6 space-y-3">
                            <Bar className="h-5 w-24" />
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Bar className="h-10 w-10 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Bar className="h-3 w-full" />
                                        <Bar className="h-3 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}