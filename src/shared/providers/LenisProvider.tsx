"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

let lenis: Lenis | null = null;

export function scrollTo(target: string) {
  const el = document.querySelector(target);
  if (el && lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -88 });
  }
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    function raf(time: number) {
      lenis!.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
