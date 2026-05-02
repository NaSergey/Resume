"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let overlayEl: HTMLDivElement | null = null;

export function refreshLenis()    { lenis?.resize(); }
export function stopLenis()       { lenis?.stop(); }
export function startLenis()      { lenis?.start(); }
export function syncLenisTarget() { if (lenis) lenis.scrollTo(lenis.scroll, { immediate: true }); }

export function scrollTo(target: string) {
  const el = document.querySelector(target);
  if (el && lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -65 });
  }
}

export function navigateTo(target: string) {
  const el = document.querySelector(target);
  if (!el || !lenis) return;

  if (!lenis || !overlayEl) {
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 65;
    window.scrollTo({ top, behavior: lenis ? "auto" : "smooth" });
    return;
  }

  overlayEl.style.pointerEvents = "all";

  gsap.fromTo(overlayEl,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.22,
      ease: "power2.in",
      onComplete() {
        const currentScroll  = lenis!.scroll;
        const elTop          = (el as HTMLElement).getBoundingClientRect().top + currentScroll;
        const goingBackward  = elTop < currentScroll;

        if (goingBackward) {
          const st = ScrollTrigger.getAll().find(
            (s) => s.vars.scrub && s.pin && (el as HTMLElement).contains(s.trigger as Element | null)
          );
          lenis!.scrollTo(st ? st.end - 1 : (el as HTMLElement), { immediate: true, offset: st ? 0 : -65 });
          ScrollTrigger.refresh();
          if (st?.animation) {
            // Reset silently then seek to end — guarantees onUpdate fires even if already at 1
            st.animation.progress(0, true);
            st.animation.progress(1);
          }
        } else {
          lenis!.scrollTo(el as HTMLElement, { immediate: true, offset: -65 });
          ScrollTrigger.refresh();
        }

        gsap.to(overlayEl!, {
          opacity: 0,
          duration: 0.32,
          delay: 0.05,
          ease: "power2.out",
          onComplete() {
            if (overlayEl) overlayEl.style.pointerEvents = "none";
          },
        });
      },
    }
  );
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    overlayEl = ref.current;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis!.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      overlayEl = null;
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return (
    <>
      {children}
      <div
        ref={ref}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--color-bg)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 9990,
        }}
      />
    </>
  );
}
