import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const rafRef  = useRef<number>(0);
  const inView  = useInView(spanRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration  = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * to));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, to]);

  return <span ref={spanRef}>{count}{suffix}</span>;
}
