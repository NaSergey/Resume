"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FlickerTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function FlickerText({ children, className, style }: FlickerTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const COLORS = ["#00d4ff", "#9d4edd", "#00ff87", "#fff12d"];
    const randColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

    const breathe = () => {
      gsap.to(el, {
        opacity: 0.2 + Math.random() * 0.4,
        duration: 0.8 + Math.random() * 1.2,
        ease: "sine.inOut",
        onComplete: breathe,
      });
    };
    breathe();

    const burst = () => {
      const color = randColor();
      const tl = gsap.timeline({
        onComplete: () => gsap.delayedCall(1.2 + Math.random() * 2.5, burst),
      });
      tl.set(el, { opacity: 0 })
        .set(el, { opacity: 1,   color },              "+=0.04")
        .set(el, { opacity: 0.1 },                     "+=0.06")
        .set(el, { opacity: 0.8, color: randColor() }, "+=0.03")
        .set(el, { opacity: 0 },                       "+=0.02")
        .set(el, { opacity: 0.9, color: randColor() }, "+=0.05")
        .set(el, { opacity: 0.2 },                     "+=0.03")
        .set(el, { opacity: 0.35 },                    "+=0.04");
    };

    const delay = gsap.delayedCall(0.8 + Math.random() * 1.5, burst);
    return () => { delay.kill(); gsap.killTweensOf(el); };
  }, []);

  return <p ref={ref} className={className} style={style}>{children}</p>;
}
