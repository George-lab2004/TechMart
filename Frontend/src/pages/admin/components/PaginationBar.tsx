import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationBarProps {
    page: number
    pages: number
    total: number
    limit: number
    onChange: (page: number) => void
}

export default function PaginationBar({ page, pages, total, limit, onChange }: PaginationBarProps) {
    if (pages <= 1) return null

    const from = (page - 1) * limit + 1
    const to   = Math.min(page * limit, total)

    // Show at most 5 page buttons centred on the current page
    const getPageNumbers = () => {
        const delta = 2
        const range: number[] = []
        for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
            range.push(i)
        }
        // Always include first and last
        if (range[0] > 1) {
            range.unshift(-1) // left ellipsis sentinel
            range.unshift(1)
        }
        if (range[range.length - 1] < pages) {
            range.push(-2) // right ellipsis sentinel
            range.push(pages)
        }
        return range
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gb mt-0">
            {/* Count label */}
            <span className="text-[10px] font-mono text-muted">
                {from}–{to} of {total.toLocaleString()} results
            </span>

            {/* Buttons */}
            <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                    disabled={page <= 1}
                    onClick={() => onChange(page - 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-gb text-text2 hover:border-a/40 hover:text-a disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={14} />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, idx) =>
                    p < 0 ? (
                        <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-[10px] text-muted select-none">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold border transition-all
                                ${p === page
                                    ? "bg-a text-white border-a shadow-sm shadow-a/30"
                                    : "border-gb text-text2 hover:border-a/40 hover:text-a"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    disabled={page >= pages}
                    onClick={() => onChange(page + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-gb text-text2 hover:border-a/40 hover:text-a disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    )
}
