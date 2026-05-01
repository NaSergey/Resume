"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SlashIcon } from "./SlashIcon";

interface Props {
  className?: string;
}

export function AnimatedSlashIcon({ className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = () => {
      gsap.timeline()
        .to(el, { x: -5, duration: 0.25, ease: "power2.inOut" })
        .to(el, { x: 5,  duration: 0.25, ease: "power2.inOut" })
        .to(el, { x: 0,  duration: 0.2,  ease: "power2.out" });
    };

    const id = setInterval(anim, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      <SlashIcon className={className} />
    </span>
  );
}
