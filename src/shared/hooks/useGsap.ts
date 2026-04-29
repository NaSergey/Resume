"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps a GSAP animation factory in a scoped context tied to a container ref.
 * Cleanup (revert) is automatic on unmount or deps change.
 *
 * Usage:
 *   const ref = useGsap((gsap, ctx) => {
 *     gsap.from(".item", { opacity: 0, stagger: 0.1 });
 *   });
 *   return <div ref={ref}>…</div>
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  factory: (g: typeof gsap, ctx: gsap.Context) => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      factory(gsap, ctx);
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
