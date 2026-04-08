import { useState, useMemo } from "react"
import { ThumbsUp, Star, X } from "lucide-react"
import { useCreateReviewMutation, useGetProductReviewsQuery } from "@/slices/productApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import toast from "react-hot-toast"

// ── Types ────────────────────────────────────────────────────
interface Review {
  _id: string
  user: string
  name: string
  rating: number
  title: string
  comment: string
  createdAt: string
}

interface RatingBreakdown {
  five: number; four: number; three: number; two: number; one: number
}

interface Props {
  productId: string
  rating: number
  numReviews: number
  ratingBreakdown: RatingBreakdown
}

// ── Star renderer ─────────────────────────────────────────────
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={`transition-colors ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-none text-muted"}`}
        />
      ))}
    </div>
  )
}

// ── Interactive star picker ───────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={`transition-colors ${i <= (hover || value) ? "fill-amber-400 text-amber-400" : "fill-none text-muted"}`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-xs font-mono text-text2">
          {["", "Poor", "Fair", "Good", "Great", "Excellent"][value]}
        </span>
      )}
    </div>
  )
}

// ── Rating bar row ────────────────────────────────────────────
function BarRow({ star, count, total, active, onClick }: {
  star: number; count: number; total: number; active: boolean; onClick: () => void
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3 group cursor-pointer" onClick={onClick}>
      <span className="font-mono text-[10px] text-text2 w-9 text-right shrink-0">
        {star} star
      </span>
      <div className="flex-1 h-[6px] rounded-full bg-gb overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${active ? "bg-a" : "bg-amber-400 group-hover:bg-amber-300"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-muted w-7 shrink-0">{pct}%</span>
    </div>
  )
}

// ── Review card ───────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [voted, setVoted] = useState(false)
  const initials = review.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  const colors = [
    "bg-blue-500/10 text-blue-500",
    "bg-pink-500/10 text-pink-500",
    "bg-green-500/10 text-green-500",
    "bg-purple-500/10 text-purple-500",
    "bg-amber-500/10 text-amber-500",
  ]
  const colorClass = colors[review.name.charCodeAt(0) % colors.length]

  return (
    <div className="bg-card border border-gb rounded-2xl p-5 hover:border-gb/60 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${colorClass}`}>
            {initials}
          </div>
          <div>
            <div className="font-bold text-sm text-text">{review.name}</div>
            <span className="font-mono text-[9px] text-muted">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric"
              })}
            </span>
          </div>
        </div>
        <Stars rating={review.rating} size={14} />
      </div>

      {/* Content */}
      <div className="font-bold text-[15px] text-text mb-2">{review.title}</div>
      <p className="text-sm text-text2 leading-relaxed">{review.comment}</p>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gb">
        <span className="text-xs text-muted">Helpful?</span>
        <button
          onClick={() => setVoted(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wide uppercase border transition-all duration-200
            ${voted ? "bg-a/10 border-a/30 text-a" : "border-gb text-text2 hover:border-a/40 hover:text-text"}`}
        >
          <ThumbsUp size={11} className={voted ? "fill-a" : ""} />
          {voted ? "Voted" : "Yes"}
        </button>
      </div>
    </div>
  )
}

// ── Write Review Modal ────────────────────────────────────────
function WriteReviewModal({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [createReview, { isLoading }] = useCreateReviewMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) return toast.error("Please select a rating")
    if (!title.trim()) return toast.error("Please add a title")
    if (!comment.trim()) return toast.error("Please add a comment")

    try {
      await createReview({ productId, title, rating, comment }).unwrap()
      toast.success("Review submitted!")
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card border border-gb rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black uppercase tracking-wide text-text">Write a Review</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gb hover:bg-gb/80 transition-colors">
            <X size={16} className="text-text2" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              className="w-full bg-surf border border-gb px-4 py-3 rounded-xl text-sm font-bold text-text focus:outline-none focus:ring-2 focus:ring-a/20 focus:border-a transition-all placeholder:text-muted/40"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Review</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              className="w-full bg-surf border border-gb px-4 py-3 rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-a/20 focus:border-a transition-all placeholder:text-muted/40 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-a text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-a/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Sort options ──────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "high", label: "Highest Rated" },
  { value: "low", label: "Lowest Rated" },
]

// ── Main component ────────────────────────────────────────────
export default function RatingSection({ productId, rating, numReviews, ratingBreakdown }: Props) {
  const [activeStar, setActiveStar] = useState(0)
  const [sort, setSort] = useState("recent")
  const [showModal, setShowModal] = useState(false)

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { data: reviewsData } = useGetProductReviewsQuery(productId, { skip: !userInfo })

  const reviews: Review[] = reviewsData?.result?.reviews ?? []

  const { total, breakdown } = useMemo(() => {
    const b = ratingBreakdown || { five: 0, four: 0, three: 0, two: 0, one: 0 }
    let t = (b.five || 0) + (b.four || 0) + (b.three || 0) + (b.two || 0) + (b.one || 0)

    // Fallback: If breakdown is empty but we have reviews, calculate from reviews array
    if (t === 0 && reviews.length > 0) {
      const calcB: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      reviews.forEach(r => {
        const star = Math.round(r.rating)
        if (star >= 1 && star <= 5) calcB[star]++
      })
      return { total: reviews.length, breakdown: calcB }
    }

    const numericBreakdown: Record<number, number> = {
      5: b.five, 4: b.four, 3: b.three, 2: b.two, 1: b.one
    }

    return { total: t, breakdown: numericBreakdown }
  }, [ratingBreakdown, reviews])

  const filtered = useMemo(() => {
    let r = [...reviews]
    if (activeStar) r = r.filter(x => x.rating === activeStar)
    if (sort === "high") r.sort((a, b) => b.rating - a.rating)
    if (sort === "low") r.sort((a, b) => a.rating - b.rating)
    if (sort === "recent") r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return r
  }, [reviews, activeStar, sort])

  const toggleStar = (s: number) => setActiveStar(prev => prev === s ? 0 : s)

  const handleWriteReview = () => {
    if (!userInfo) return toast.error("Please sign in to write a review")
    setShowModal(true)
  }

  return (
    <section className="py-10">
      {/* Label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-4 h-px bg-muted" />
        <span className="font-mono text-[10px] tracking-[3px] uppercase text-muted">Customer Reviews</span>
      </div>

      {/* Overview — score + bars */}
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 mb-8">
        {/* Score card */}
        <div className="bg-surf border border-gb rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center">
          <div className="font-display text-6xl leading-none text-text">{rating.toFixed(1)}</div>
          <Stars rating={rating} size={18} />
          <div className="text-sm text-text2">{numReviews.toLocaleString()} reviews</div>
        </div>

        {/* Bars */}
        <div className="flex flex-col justify-center gap-2.5">
          {[5, 4, 3, 2, 1].map(s => (
            <BarRow
              key={s}
              star={s}
              count={breakdown[s] ?? 0}
              total={total}
              active={activeStar === s}
              onClick={() => toggleStar(s)}
            />
          ))}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setActiveStar(0)}
          className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200
            ${!activeStar ? "bg-a/10 border-a/30 text-a" : "border-gb text-text2 hover:border-a/30 hover:text-text"}`}
        >
          All Stars
        </button>
        {[5, 4, 3, 2, 1].map(s => (
          <button
            key={s}
            onClick={() => toggleStar(s)}
            className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200
              ${activeStar === s ? "bg-a/10 border-a/30 text-a" : "border-gb text-text2 hover:border-a/30 hover:text-text"}`}
          >
            {s} Stars
          </button>
        ))}
      </div>

      {/* Sort row */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm text-text2">
          Showing {filtered.length.toLocaleString()} of {numReviews.toLocaleString()} reviews
        </span>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="font-mono text-[11px] tracking-wide px-3 py-2 rounded-xl border border-gb bg-card text-text2 outline-none focus:border-a/40 transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Reviews list */}
      {!userInfo ? (
        <div className="text-center py-16 border-2 border-dashed border-gb rounded-2xl bg-surf/10">
          <Star size={40} className="mx-auto text-muted opacity-20 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest font-mono text-muted">Sign in to view reviews</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gb rounded-2xl bg-surf/10">
              <Star size={40} className="mx-auto text-muted opacity-20 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest font-mono text-muted">No reviews yet — be the first!</p>
            </div>
          ) : (
            filtered.map(r => <ReviewCard key={r._id} review={r} />)
          )}
        </div>
      )}

      {/* Write review button */}
      <button
        onClick={handleWriteReview}
        className="w-full mt-6 h-12 rounded-2xl border border-gb bg-card font-bold text-sm text-text2 hover:border-a/30 hover:text-text transition-all duration-200"
      >
        Write a Review
      </button>

      {/* Modal */}
      {showModal && <WriteReviewModal productId={productId} onClose={() => setShowModal(false)} />}
    </section>
  )
}
