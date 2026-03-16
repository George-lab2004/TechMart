import { useState, useEffect } from 'react'
import {
  type CarouselApi,
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
} from '@/Components/ui/carousel'
import { Zap, Shield, Cpu, Wifi, Battery } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    name: 'ProBook Ultra X1',
    category: 'Laptop',
    price: '$1,299',
    bg: 'from-blue-500/10 to-a/5',
    icon: '💻',
    badge: 'Best Seller',
    badgeColor: 'bg-a/10 text-a',
    features: [
      { icon: Cpu,     label: 'M3 Pro Chip' },
      { icon: Battery, label: '22hr Battery' },
      { icon: Zap,     label: '140W Charge' },
    ],
  },
  {
    id: 2,
    name: 'NovaBuds Pro',
    category: 'Audio',
    price: '$249',
    bg: 'from-a2/10 to-a2/5',
    icon: '🎧',
    badge: 'New',
    badgeColor: 'bg-a3/10 text-a3',
    features: [
      { icon: Shield, label: 'ANC Pro'      },
      { icon: Wifi,   label: 'Lossless Audio' },
      { icon: Battery, label: '36hr Playback' },
    ],
  },
  {
    id: 3,
    name: 'VisionWatch S2',
    category: 'Wearable',
    price: '$399',
    bg: 'from-a3/10 to-a3/5',
    icon: '⌚',
    badge: 'Limited',
    badgeColor: 'bg-a2/10 text-a2',
    features: [
      { icon: Zap,     label: 'Always-On Display' },
      { icon: Shield,  label: 'Health Sensors'    },
      { icon: Battery, label: '7-Day Battery'     },
    ],
  },
  {
    id: 4,
    name: 'PixelFrame 4K',
    category: 'Monitor',
    price: '$799',
    bg: 'from-yellow-400/10 to-yellow-400/5',
    icon: '🖥️',
    badge: 'Top Rated',
    badgeColor: 'bg-a/10 text-a',
    features: [
      { icon: Zap,  label: '4K 144Hz'    },
      { icon: Cpu,  label: 'HDR 1000'    },
      { icon: Wifi, label: 'USB-C 140W'  },
    ],
  },
]

export function Carousel() {
  const [api, setApi]         = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount]     = useState(0)

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

  return (
    <div className="w-full flex flex-col items-center gap-5">

      <CarouselRoot setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="bg-surf border border-gb rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-colors">

                {/* Top — image area */}
                <div className={`bg-linear-to-br ${slide.bg} flex items-center justify-center h-72 relative`}>
                  <span className="text-[90px] leading-none select-none drop-shadow-lg">{slide.icon}</span>
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
                    {slide.features.map(({ icon: Icon, label }) => (
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


