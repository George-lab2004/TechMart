import { type ReactNode } from 'react'
import { Search, ChevronDown, Filter } from 'lucide-react'

interface Option {
  label: string
  value: string
}

interface FilterConfig {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
}

interface SortConfig {
  value: string
  onChange: (value: string) => void
  options: Option[]
}

interface AdminTableProps<T> {
  headers: string[]
  data: T[]
  renderRow: (item: T, index: number) => ReactNode
  // Search
  onSearchChange?: (value: string) => void
  searchTerm?: string
  searchPlaceholder?: string
  // Filters (up to 3 as requested)
  filters?: FilterConfig[]
  // Sorting (specifically for products page)
  sortConfig?: SortConfig
  isLoading?: boolean
  emptyMessage?: string
}

/**
 * A highly scalable and reusable Admin Table component.
 * Features a dynamic toolbar for searching, multiple filtering, and sorting.
 * Maintains the premium "TechMart" aesthetic with glassmorphism and custom borders.
 */
function AdminTable<T>({
  headers,
  data,
  renderRow,
  onSearchChange,
  searchTerm = "",
  searchPlaceholder = "SEARCH PROTOCOL...",
  filters = [],
  sortConfig,
  isLoading,
  emptyMessage = "No matching records synchronization found."
}: AdminTableProps<T>) {

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      {/* ── TOOLBAR ────────────────────────────────────────── */}
      {(onSearchChange || filters.length > 0 || sortConfig) && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surf2/50 backdrop-blur-sm p-5 rounded-2xl border border-gb shadow-inner-sm">

          {/* Search Field */}
          {onSearchChange && (
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-a transition-colors"
                size={16}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-white border border-gb rounded-xl pl-12 pr-4 py-2.5 text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-a/10 focus:border-a transition-all placeholder:opacity-30"
              />
            </div>
          )}

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {filters.slice(0, 3).map((filter, idx) => (
              <div key={idx} className="relative group min-w-[140px]">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted scale-75 opacity-50" size={14} />
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gb rounded-xl pl-9 pr-10 py-2.5 text-[10px] font-bold uppercase tracking-widest text-text2 cursor-pointer focus:outline-none focus:border-a/50 transition-all hover:bg-ag/5"
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted group-hover:text-a transition-colors" size={12} />
              </div>
            ))}

            {sortConfig && (
              <div className="relative group min-w-[160px]">
                <select
                  value={sortConfig.value}
                  onChange={(e) => sortConfig.onChange(e.target.value)}
                  className="w-full appearance-none bg-ag/10 border border-a/20 rounded-xl px-5 py-2.5 pr-10 text-[10px] font-bold uppercase tracking-widest text-a cursor-pointer focus:outline-none focus:border-a/50 transition-all hover:bg-ag/20"
                >
                  {sortConfig.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-a" size={12} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TABLE ─────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl shadow-xl shadow-black/5 dark:shadow-white/5 border border-gb bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 divide-y divide-gb">
            <thead className="text-[10px] text-text uppercase tracking-widest font-mono bg-surf2 border-b border-gb">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 font-bold ${header.toLowerCase().includes('price') ? 'text-right' :
                      header.toLowerCase().includes('stock') || header.toLowerCase().includes('rating') || header.toLowerCase().includes('reviews') || header.toLowerCase().includes('sales') || header.toLowerCase().includes('actions') || header.toLowerCase().includes('warranty') || header.toLowerCase().includes('return') ? 'text-center' : ''
                      }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gb bg-bg">
              {isLoading ? (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-20 text-center">
                    <div className="font-bebas text-2xl tracking-[0.3em] opacity-20 animate-pulse">
                      SYNCHRONIZING TERMINAL...
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => renderRow(item, index))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-20 text-center">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted opacity-60">
                      {emptyMessage}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminTable
