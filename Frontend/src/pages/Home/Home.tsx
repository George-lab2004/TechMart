import { useState } from "react";
import GridBackground from "@/Components/GridBackground";
import HeroHeadline from "@/Components/HeroHeadline";
import HeroSection from "@/Components/HeroSection";
import Marquee from "./Components/marquee";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Zap, Cpu, Battery, Wifi } from "lucide-react";
import CategroiesSection from "./Components/categroiesSection";
import { useGetTopSellingProductsQuery } from "@/slices/productApiSlice";

const SPEC_ICONS: Record<string, any> = {
  Chip: Cpu,
  Battery: Battery,
  Charge: Zap,
  Security: ShieldCheck,
  Wifi: Wifi,
  Wireless: Wifi,
  ANC: ShieldCheck,
  Refresh: Zap,
}

const getSpecIcon = (label: string, defaultIcon: any) => {
  const key = Object.keys(SPEC_ICONS).find(k => label.includes(k))
  return key ? SPEC_ICONS[key] : defaultIcon
}

const heroCards = [
  {
    icon: Truck,
    iconColor: "text-a",
    title: "Free Shipping",
    description: "On all orders over $50",
    position: "-top-10 -left-10",
    delay: 0,
  },
  {
    icon: ShieldCheck,
    iconColor: "text-a3",
    title: "2yr Warranty",
    description: "Covered on every product",
    position: "-top-10 -right-10",
    delay: 1,
  },
  {
    icon: Zap,
    iconColor: "text-a2",
    title: "Next Day",
    description: "Order by 2PM for same-day",
    position: "-bottom-10 -right-10",
    delay: 2,
  },
];

export default function Home() {
  const { data: topData } = useGetTopSellingProductsQuery()
  const [activeIndex, setActiveIndex] = useState(0)
  
  const topProduct = topData?.result?.[activeIndex] || topData?.result?.[0]

  const dynamicCards = topProduct && topProduct.quickSpecs && topProduct.quickSpecs.length >= 3
    ? [
        {
          icon: getSpecIcon(topProduct.quickSpecs[0].label, Truck),
          iconColor: "text-a",
          title: topProduct.quickSpecs[0].label,
          description: topProduct.quickSpecs[0].value,
          position: "-top-10 -left-10",
          delay: 0,
        },
        {
          icon: getSpecIcon(topProduct.quickSpecs[1].label, ShieldCheck),
          iconColor: "text-a3",
          title: topProduct.quickSpecs[1].label,
          description: topProduct.quickSpecs[1].value,
          position: "-top-10 -right-10",
          delay: 1,
        },
        {
          icon: getSpecIcon(topProduct.quickSpecs[2].label, Zap),
          iconColor: "text-a2",
          title: topProduct.quickSpecs[2].label,
          description: topProduct.quickSpecs[2].value,
          position: "-bottom-10 -right-10",
          delay: 2,
        },
      ]
    : heroCards;

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <HeroSection
        badge={topProduct ? `Top Seller — ${topProduct.name}` : "New Drop — Limited Stock"}
        headline={
          <>
            <HeroHeadline
              line1="Future"
              line2="Tech"
              line3="Awaits"
              size="text-9xl"
            />
            {/* Mobile-only feature chips — rendered below headline, never beside it */}
            <div className="flex md:hidden items-center gap-2 flex-wrap mt-3">
              {dynamicCards.map((card, i) => (
                <motion.div key={i}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surf border border-gb shadow-sm">
                  <card.icon size={12} className={card.iconColor} />
                  <span className="font-body text-[11px] text-text2 whitespace-nowrap">{card.title}</span>
                </motion.div>
              ))}
            </div>
          </>
        }
        subtext={topProduct?.description || "Curated premium electronics for those who refuse to compromise. From concept to cart — in seconds."}
        primaryBtnLabel="Explore Collection"
        secondaryBtnLabel="Watch Story"
        floatingCards={dynamicCards}
        onActiveChange={(index) => setActiveIndex(index)}
      />
      <div className="mt-20">
        <Marquee />
      </div>
      <div className="mt-20">
        <CategroiesSection />
      </div>
    </div>
  );
}


