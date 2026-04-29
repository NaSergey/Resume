"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function refreshLenis() { lenis?.resize(); }
export function stopLenis()    { lenis?.stop(); }
export function startLenis()   { lenis?.start(); }

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

    // Tell ScrollTrigger to read scroll position from Lenis, not native scroll.
    // Without this, ST reads window.scrollY which can lag behind Lenis's
    // animated value, causing the pin to engage at wrong positions.
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (value !== undefined && lenis) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis?.scroll ?? 0;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis!.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.scrollerProxy(document.body, undefined as never);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
