import { PowerGlitch } from "powerglitch";
import { useEffect, type ReactNode } from "react";

interface HeroHeadlineProps {
  line1: string;
  line2: string;
  line3: string;
  size: string;
  line1Side?: ReactNode;
  line2Side?: ReactNode;
}

export default function HeroHeadline({ line1, line2, line3, size, line1Side, line2Side }: HeroHeadlineProps) {
  useEffect(() => {
    PowerGlitch.glitch(".glitch", {
      playMode: "always",
      timing: { duration: 1000, iterations: 2 },
      pulse: { scale: 1.1 },
    });
  }, []);

  return (
    <>
      {/* Line 1 — glitch effect */}
      <div className={`flex items-center gap-3 uppercase relative ${size} overflow-visible mt-4 font-bold font-display tracking-[3px] text-text`}>
        <div className="relative overflow-hidden">
          <div className="glitch">{line1}</div>
          <div className="absolute -top-13 animate-header text-a2 opacity-60 pointer-events-none">
            {line1}
          </div>
        </div>
        {line1Side}
      </div>

      {/* Line 2 — accent color */}
      <div className={`flex items-center gap-3 uppercase ${size} font-bold font-display tracking-[3px] bg-linear-to-r from-blue-500 to-gray-900 bg-clip-text text-transparent`}>
        <span>{line2}</span>
        {line2Side}
      </div>

      {/* Line 3 — outlined */}
      <div
        className={`ppercase ${size} font-bold font-display tracking-[3px]`}
        style={{
          WebkitTextStroke: "1.5px var(--muted)",
          WebkitTextFillColor: "transparent",
        }}
      >
        {line3}
      </div>
    </>
  );
}
