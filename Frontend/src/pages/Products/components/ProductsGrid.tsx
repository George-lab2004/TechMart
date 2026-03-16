import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, Grid3X3, List, ChevronDown,
  X, Filter, ChevronLeft, ChevronRight,
} from "lucide-react";
import CountUp from "@/Components/CountUp";
import ProductCard from "./ProductCard";
import type { Product } from "./ProductCard";

function SkeletonCard({ isListView }: { isListView: boolean }) {
  if (isListView) {
    return (
      <div className="flex overflow-hidden rounded-2xl border border-gb bg-surf animate-pulse h-32">
        <div className="w-44 shrink-0 bg-surf2" />
        <div className="flex-1 p-5 flex flex-col gap-3 justify-center">
          <div className="h-2.5 bg-gb rounded-full w-1/4" />
          <div className="h-4 bg-gb rounded-full w-3/4" />
          <div className="h-2.5 bg-gb rounded-full w-1/2" />
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-[22px] border border-gb bg-surf animate-pulse overflow-hidden">
      <div className="h-50 bg-surf2" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-2 bg-gb rounded-full w-1/4" />
        <div className="h-4 bg-gb rounded-full w-2/3" />
        <div className="h-2 bg-gb rounded-full w-1/3" />
        <div className="flex justify-between items-center mt-1">
          <div className="h-7 bg-gb rounded-full w-1/4" />
          <div className="h-9 w-9 bg-gb rounded-xl" />
        </div>
      </div>
    </div>
  );
}

const brands = [
  { brand: "Apple",   count: 48 },
  { brand: "Samsung", count: 35 },
  { brand: "Sony",    count: 27 },
  { brand: "Dell",    count: 22 },
  { brand: "LG",      count: 18 },
  { brand: "Bose",    count: 14 },
];

const ratings = [
  { stars: 5, count: 84 },
  { stars: 4, count: 63 },
  { stars: 3, count: 41 },
  { stars: 2, count: 18 },
  { stars: 1, count: 9 },
];

const SORT_OPTIONS = [
  { label: "Featured",          key: "featured"   },
  { label: "Price: Low \u2192 High", key: "price-asc"  },
  { label: "Price: High \u2192 Low", key: "price-desc" },
  { label: "Top Rated",         key: "rating"     },
];

const ITEMS_PER_PAGE = 6;

interface ProductsGridProps {
  sorted: Product[];
  isFiltering: boolean;
  isListView: boolean;
  setIsListView: (v: boolean) => void;
  priceRange: number;
  setPriceRange: (v: number) => void;
  priceActive: boolean;
  setPriceActive: (v: boolean) => void;
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  setSelectedBrands: (v: string[]) => void;
  selectedRatings: number[];
  toggleRating: (s: number) => void;
  setSelectedRatings: (v: number[]) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortKey: string;
  setSortKey: (v: string) => void;
  filterDrawerOpen: boolean;
  setFilterDrawerOpen: (v: boolean) => void;
  clearAll: () => void;
}

// ─── Pagination helper ──────────────────────────────────────────────────────
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

// ─── Sidebar panel (shared between desktop sidebar + mobile drawer) ─────────
function FilterPanels({
  priceRange, setPriceRange, priceActive, setPriceActive,
  selectedBrands, toggleBrand, setSelectedBrands,
  selectedRatings, toggleRating, setSelectedRatings,
  bg = "bg-surf",
}: Pick<ProductsGridProps,
  "priceRange" | "setPriceRange" | "priceActive" | "setPriceActive" |
  "selectedBrands" | "toggleBrand" | "setSelectedBrands" |
  "selectedRatings" | "toggleRating" | "setSelectedRatings"
> & { bg?: string }) {
  return (
    <>
      {/* Price Range */}
      <div className={`${bg} border border-gb p-5 rounded-2xl flex flex-col gap-5`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[2px] text-muted">Price Range</h3>
          <span className="text-[11px] font-mono text-muted">USD</span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted mb-0.5">Min</span>
            <span className="text-sm font-semibold font-mono text-text2">$0</span>
          </div>
          <span className="text-xl font-bold font-mono text-a tabular-nums">
            {priceActive ? `$${priceRange.toLocaleString()}` : "Any"}
          </span>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted mb-0.5">Max</span>
            <span className="text-sm font-semibold font-mono text-text2">$3,000</span>
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-a pointer-events-none"
               style={{ width: `${(priceRange / 3000) * 100}%` }} />
          <input type="range" min="0" max="3000" step="50" value={priceRange}
            onChange={(e) => { setPriceActive(true); setPriceRange(Number(e.target.value)); }}
            className="relative w-full h-1 rounded-full appearance-none bg-gb accent-blue-500 cursor-pointer" />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-muted">
          <span>$0</span><span>$750</span><span>$1500</span><span>$2250</span><span>$3000</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div className={`${bg} border border-gb p-5 rounded-2xl flex flex-col gap-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[2px] text-muted">Brand</h3>
          <button onClick={() => setSelectedBrands([])}
            className="text-[11px] font-medium text-a hover:underline cursor-pointer transition">Reset</button>
        </div>
        <div className="flex flex-col gap-2">
          {brands.map((item, index) => (
            <motion.label key={item.brand}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
              className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <input type="checkbox" checked={selectedBrands.includes(item.brand)}
                  onChange={() => toggleBrand(item.brand)}
                  className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer" />
                <span className="text-sm text-text2 group-hover:text-a transition">{item.brand}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-muted">
                <CountUp to={item.count} suffix="" />
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className={`${bg} border border-gb p-5 rounded-2xl flex flex-col gap-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[2px] text-muted">Rating</h3>
          <button onClick={() => setSelectedRatings([])}
            className="text-[11px] font-medium text-a hover:underline cursor-pointer transition">Reset</button>
        </div>
        <div className="flex flex-col gap-2">
          {ratings.map((item, index) => (
            <motion.label key={item.stars}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
              className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <input type="checkbox" checked={selectedRatings.includes(item.stars)}
                  onChange={() => toggleRating(item.stars)}
                  className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer" />
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-3.5 h-3.5 ${i < item.stars ? "text-yellow-400 fill-yellow-400" : "text-muted fill-current"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-text2 group-hover:text-a transition">& up</span>
              </div>
              <span className="text-xs font-mono font-semibold text-muted">
                <CountUp to={item.count} suffix="" />
              </span>
            </motion.label>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function ProductsGrid({
  sorted, isFiltering, isListView, setIsListView,
  priceRange, setPriceRange, priceActive, setPriceActive,
  selectedBrands, toggleBrand, setSelectedBrands,
  selectedRatings, toggleRating, setSelectedRatings,
  searchQuery, setSearchQuery,
  sortKey, setSortKey,
  filterDrawerOpen, setFilterDrawerOpen,
  clearAll,
}: ProductsGridProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the sorted results change (deferred to avoid sync setState-in-effect)
  useEffect(() => {
    const t = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(t);
  }, [sorted]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated  = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const firstItem  = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const lastItem   = Math.min(currentPage * ITEMS_PER_PAGE, sorted.length);

  return (
    <>
      <div className="flex flex-col lg:flex-row mt-6 gap-4">

        {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-64 shrink-0 flex-col font-body gap-4">
          <FilterPanels
            priceRange={priceRange} setPriceRange={setPriceRange}
            priceActive={priceActive} setPriceActive={setPriceActive}
            selectedBrands={selectedBrands} toggleBrand={toggleBrand} setSelectedBrands={setSelectedBrands}
            selectedRatings={selectedRatings} toggleRating={toggleRating} setSelectedRatings={setSelectedRatings}
          />
        </div>

        {/* ── Right column ───────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile Filters */}
            <button onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden h-10 px-4 flex items-center gap-2 text-sm text-text2 border border-gb bg-surf rounded-xl hover:border-a/40 transition-colors">
              <Filter size={14} />
              <span>Filters</span>
            </button>

            {/* Search */}
            <div className="relative flex-1 min-w-40">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-9 pr-4 text-sm rounded-xl border border-gb bg-surf text-text placeholder-muted outline-none focus:border-a transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-a2">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button onClick={() => setSortOpen(o => !o)}
                className="h-10 px-4 flex items-center gap-2 text-sm text-text2 border border-gb bg-surf rounded-xl hover:border-a/40 transition-colors">
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.key === sortKey)?.label}</span>
                <ChevronDown size={12} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0,  scale: 1    }}
                    exit={{    opacity: 0, y: -6, scale: 0.97 }}
                    className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-gb bg-surf2 backdrop-blur-xl overflow-hidden shadow-xl"
                  >
                    {SORT_OPTIONS.map(o => (
                      <button key={o.key}
                        onClick={() => { setSortKey(o.key); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortKey === o.key ? "text-a bg-a/10" : "text-text2 hover:bg-gb hover:text-text"
                        }`}>
                        {o.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View toggle */}
            <div className="flex items-center border border-gb bg-surf rounded-xl overflow-hidden h-10">
              <button onClick={() => setIsListView(false)}
                className={`w-10 h-full flex items-center justify-center transition-colors ${!isListView ? "bg-a/15 text-a" : "text-muted hover:text-text2"}`}>
                <Grid3X3 size={14} />
              </button>
              <button onClick={() => setIsListView(true)}
                className={`w-10 h-full flex items-center justify-center transition-colors ${isListView ? "bg-a/15 text-a" : "text-muted hover:text-text2"}`}>
                <List size={14} />
              </button>
            </div>

            {/* Clear all */}
            {(selectedBrands.length > 0 || selectedRatings.length > 0 || searchQuery) && (
              <button onClick={clearAll}
                className="h-10 px-4 flex items-center gap-1.5 text-xs text-a2 border border-a2/20 bg-a2/5 rounded-xl hover:bg-a2/10 transition-colors">
                <X size={12} /> Clear All
              </button>
            )}

            <span className="text-xs text-muted ml-auto font-mono">{sorted.length} results</span>
          </div>

          {/* Product grid / list */}
          {isFiltering ? (
            <div className={isListView ? "flex flex-col gap-4" : "grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <SkeletonCard key={i} isListView={isListView} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span className="text-5xl">🔍</span>
              <p className="text-text2 text-sm">No products match your filters.</p>
              <button onClick={clearAll} className="mt-2 px-5 py-2 rounded-xl text-xs font-bold bg-a text-white hover:opacity-90 transition">Clear Filters</button>
            </div>
          ) : (
            <div className={isListView ? "flex flex-col gap-4" : "grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}>
              <AnimatePresence mode="popLayout">
                {paginated.map(p => (
                  <ProductCard key={p._id} p={p} isListView={isListView} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {!isFiltering && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-6">
              {/* Showing X–Y of Z */}
              <p className="text-xs font-mono text-muted">
                Showing <span className="text-text2">{firstItem}–{lastItem}</span> of <span className="text-text2">{sorted.length}</span> products
              </p>

              {/* Page controls */}
              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl border border-gb bg-surf flex items-center justify-center text-text2
                             hover:border-a hover:text-a transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Page numbers */}
                {getPageNumbers(currentPage, totalPages).map((page, i) =>
                  page === "…" ? (
                    <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-xs text-muted select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl border text-xs font-semibold font-mono transition-all duration-150
                        ${currentPage === page
                          ? "bg-a border-a text-white shadow-[0_2px_12px_var(--ag)]"
                          : "border-gb bg-surf text-text2 hover:border-a hover:text-a"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-xl border border-gb bg-surf flex items-center justify-center text-text2
                             hover:border-a hover:text-a transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-surf border-r border-gb overflow-y-auto lg:hidden flex flex-col gap-4 p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold uppercase tracking-[2px] text-muted">Filters</h2>
                <button onClick={() => setFilterDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg bg-glass border border-gb flex items-center justify-center text-text2 hover:text-a transition-colors">
                  <X size={14} />
                </button>
              </div>

              <FilterPanels
                bg="bg-bg"
                priceRange={priceRange} setPriceRange={setPriceRange}
                priceActive={priceActive} setPriceActive={setPriceActive}
                selectedBrands={selectedBrands} toggleBrand={toggleBrand} setSelectedBrands={setSelectedBrands}
                selectedRatings={selectedRatings} toggleRating={toggleRating} setSelectedRatings={setSelectedRatings}
              />

              <div className="flex gap-3 mt-auto pt-2">
                <button onClick={clearAll}
                  className="flex-1 h-10 rounded-xl border border-gb text-xs font-semibold text-text2 hover:text-a hover:border-a transition-colors">
                  Clear All
                </button>
                <button onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-a text-white text-xs font-bold hover:opacity-90 transition-opacity">
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
