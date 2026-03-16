import GridBackground from "@/Components/GridBackground";
import HeroHeadline from "@/Components/HeroHeadline";
import HeroSection from "@/Components/HeroSection";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Zap } from "lucide-react";

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
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <HeroSection
        badge="New Drop — Limited Stock"
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
              {heroCards.map((card, i) => (
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
        subtext="Curated premium electronics for those who refuse to compromise. From concept to cart — in seconds."
        primaryBtnLabel="Explore Collection"
        secondaryBtnLabel="Watch Story"
        floatingCards={heroCards}
      />
    </div>
  );
}


