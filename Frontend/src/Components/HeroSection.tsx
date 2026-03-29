import AnimatedDot from "@/Components/AnimatedDot";
import { Carousel } from "@/Components/Carousel";
import { Button } from "@/Components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Play, type LucideIcon } from "lucide-react";
import { type ReactNode, useRef } from "react";

export interface FloatingCard {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  position: string;
  delay?: number;
}

export interface HeroSectionProps {
  badge: string;
  headline: ReactNode;
  subtext: string;
  primaryBtnLabel: string;
  secondaryBtnLabel: string;
  floatingCards: FloatingCard[];
}

export default function HeroSection({
  badge,
  headline,
  subtext,
  primaryBtnLabel,
  secondaryBtnLabel,
  floatingCards,
}: HeroSectionProps) {

  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 w-[calc(100%-40px)] md:w-[calc(100%-80px)] mt-16 md:mt-24 ms-5 md:ms-10">
      {/* Left: text + CTAs */}
      <div className="flex-1 flex-col">
        {/* Badge pill */}
        <span className="bg-surf border border-gb py-1 font-mono text-xs tracking-[1px] uppercase px-3 rounded-3xl flex items-center gap-3 w-fit shadow-sm text-text2">
          <AnimatedDot size="sm" />
          {badge}
        </span>

        {headline}

        {/* Subtext */}
        <p className="mt-4 md:max-w-1/2 text-text2 text-lg leading-relaxed">
          {subtext}
        </p>

        {/* CTAs */}
        <div className="flex gap-4 mt-8">
          <Button
            size="lg"
            variant="ghost"
            className="bg-black dark:bg-white dark:text-black dark:border dark:border-black text-white hover:scale-110 dark:hover:text-white hover:-translate-y-0.5 transition-all rounded-2xl h-12 shadow-2xl font-body text-[15px] font-semibold"
          >
            {primaryBtnLabel} <ArrowRight size={16} />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="border border-gb bg-glass backdrop-blur-sm text-text hover:bg-gb hover:text-text rounded-2xl h-12 shadow-2xl font-body text-[15px] font-medium"
          >
            <Play size={15} className="fill-black dark:text-a" /> {secondaryBtnLabel}
          </Button>
        </div>
      </div>

      {/* Right: carousel + floating cards — hidden on mobile */}
      <div ref={constraintsRef} className="hidden md:block md:max-w-[30%] max-w-75 shrink-0 self-center me-30 mt-15 relative">
        <Carousel />

        {floatingCards.map((card, i) => (
          <motion.div
            key={i}
            drag
            dragConstraints={constraintsRef}
            dragTransition={{ power: 0.5 }}
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: card.delay ?? i,
            }}
            className={`absolute ${card.position} w-36`}
          >
            <Card className="py-3 gap-2 bg-surf/80 backdrop-blur-md border-gb shadow-lg">
              <CardHeader className="px-4 gap-1.5">
                <CardTitle className="flex items-center gap-2 text-[13px] text-text">
                  <card.icon size={14} className={`${card.iconColor} shrink-0`} />
                  {card.title}
                </CardTitle>
                <CardDescription className="text-[11px] leading-snug">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
