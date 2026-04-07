import { useState, useEffect } from 'react'
import {
  type CarouselApi,
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
} from '@/Components/ui/carousel'
import { Zap, Shield, Cpu, Wifi, Battery, Smartphone, Watch, Headphones, Monitor, Speaker, Mouse, Laptop } from 'lucide-react'
import { useGetTopSellingProductsQuery } from '@/slices/productApiSlice'

// Map categories to icons
const CAT_ICONS: Record<string, any> = {
    Laptop: Laptop,
    Audio: Headphones,
    Wearable: Watch,
    Monitor: Monitor,
    Accessories: Mouse,
    Smartphone: Smartphone,
    Speaker: Speaker,
}

// Map tech specs to Lucide icons
const SPEC_ICONS: Record<string, any> = {
    Chip: Cpu,
    Battery: Battery,
    Charge: Zap,
    Security: Shield,
    Wifi: Wifi,
    Wireless: Wifi,
    ANC: Shield,
    Refresh: Zap,
}

const getSpecIcon = (label: string) => {
    const key = Object.keys(SPEC_ICONS).find(k => label.includes(k))
    return key ? SPEC_ICONS[key] : Zap
}



export function Carousel({ onActiveChange }: { onActiveChange?: (index: number) => void }) {
  const [api, setApi]         = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount]     = useState(0)

  const { data: topData, isLoading } = useGetTopSellingProductsQuery()
  const products = topData?.result || []

  const slides = products.map((p: any) => ({
    id: p._id,
    name: p.name,
    category: p.category?.name || 'Tech',
    price: `$${p.price.toLocaleString()}`,
    bg: p.cardGlowColor ? `from-[${p.cardGlowColor}]/20 to-transparent` : p.category?.glowColor ? `from-[${p.category.glowColor}]/20 to-transparent` : 'from-a/10 to-transparent',
    icon: p.images?.[0]?.url || p.quickSpecs?.[0]?.icon || CAT_ICONS[p.category?.name] || '📦',
    badge: p.badge || 'Trending',
    badgeColor: 'bg-a/10 text-a',
    features: (p.quickSpecs || []).slice(0, 3).map((s: any) => ({
        icon: getSpecIcon(s.label),
        label: s.value
    }))
  }))

  useEffect(() => {
    onActiveChange?.(current)
  }, [current, onActiveChange])

  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }
    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => { api.off('select', onSelect); api.off('reInit', onSelect) }
  }, [api])

  if (isLoading) return <div className="h-[400px] w-full bg-surf animate-pulse rounded-3xl border border-gb" />
  if (!slides.length) return null

  return (
    <div className="w-full flex flex-col items-center gap-5">

      <CarouselRoot setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="bg-surf border border-gb rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-colors">

                {/* Top — image area */}
                <div className={`bg-linear-to-br ${slide.bg} flex items-center justify-center h-72 relative`}>
                  {typeof slide.icon === 'string' && slide.icon.startsWith('http') ? (
                    <img src={slide.icon} alt={slide.name} className="h-56 w-auto object-contain drop-shadow-2xl select-none" />
                  ) : typeof slide.icon === 'string' ? (
                    <span className="text-[90px] leading-none select-none drop-shadow-lg">{slide.icon}</span>
                  ) : (
                    <slide.icon size={90} className="text-white drop-shadow-lg" />
                  )}
                  <span className={`absolute top-4 right-4 text-[10px] font-mono font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${slide.badgeColor} border border-current/20`}>
                    {slide.badge}
                  </span>
                </div>

                {/* Bottom — info */}
                <div className="p-10 ">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[2px] text-muted mb-1">{slide.category}</p>
                      <h3 className="text-xl font-display font-bold text-text tracking-wide">{slide.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-muted font-mono mb-1">FROM</p>
                      <p className="text-xl font-bold font-display text-a">{slide.price}</p>
                    </div>
                  </div>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {slide.features.map(({ icon: Icon, label }: { icon: any; label: string }) => (
                      <span key={label} className="flex items-center gap-1.5 bg-bg border border-gb rounded-xl px-3 py-1.5 text-[12px] font-body text-text2">
                        <Icon size={12} className="text-a shrink-0" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselRoot>

      {/* Dot navigation — no arrows */}
      <div className="flex items-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => api?.scrollTo(i, false)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? 'w-6 h-2 bg-a'
                : 'w-2 h-2 bg-muted hover:bg-text2'
            }`}
          />
        ))}
      </div>

    </div>
  )
}


