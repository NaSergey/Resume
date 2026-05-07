"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export type CursorState = "default" | "hover" | "click" | "hidden";

/**
 * Drives the custom cursor with velocity-based physics:
 * - Dot follows instantly (gsap.set)
 * - Ring lerps to position AND rotates + stretches in direction of movement
 * - Trail refs: 2 ghost rings that chase the ring with increasing delay
 * - On hover: ring expands with color fill
 * - On click: squish + elastic spring back
 */
export function useCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const t1Ref   = useRef<HTMLDivElement>(null); // trail 1
  const t2Ref   = useRef<HTMLDivElement>(null); // trail 2
  const [state, setState] = useState<CursorState>("hidden");
  const [isTouch, setIsTouch] = useState(true);

  // Effect 1: detect touch once (before rendering cursor elements)
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(false);
    }
  }, []);

  // Effect 2: GSAP setup runs after isTouch=false causes cursor divs to mount
  useEffect(() => {
    if (isTouch) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    const t1   = t1Ref.current;
    const t2   = t2Ref.current;
    if (!dot || !ring) return;

    // position off-screen until first mousemove; GSAP owns the full transform
    gsap.set(
      [dot, ring, ...(t1 ? [t1] : []), ...(t2 ? [t2] : [])],
      { xPercent: -50, yPercent: -50, x: -200, y: -200 },
    );

    // Velocity state — exponential moving average
    let prevX = 0, prevY = 0;
    let vx = 0, vy = 0;
    let curX = 0, curY = 0;
    let rafId = 0;

    // RAF loop drives velocity and ring stretch/rotate independent of mousemove
    function tick() {
      vx = vx * 0.72 + (curX - prevX) * 0.28;
      vy = vy * 0.72 + (curY - prevY) * 0.28;
      prevX = curX;
      prevY = curY;

      const speed  = Math.sqrt(vx * vx + vy * vy);
      const angle  = Math.atan2(vy, vx) * (180 / Math.PI);
      // Stretch proportional to speed, max 55%
      const stretch = Math.min(speed * 0.045, 0.55);

      gsap.set(ring, {
        rotation: angle,
        scaleX: 1 + stretch,
        scaleY: Math.max(0.5, 1 - stretch * 0.6),
        overwrite: false,
      });

      // Dot gets a subtle directional skew at high velocity
      if (speed > 4) {
        gsap.set(dot, {
          skewX: vx * 0.35,
          skewY: vy * 0.2,
          overwrite: false,
        });
      } else {
        gsap.set(dot, { skewX: 0, skewY: 0, overwrite: false });
      }

      rafId = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
      setState(prev => prev === "hidden" ? "default" : prev);

      gsap.set(dot, { x: curX, y: curY });

      // Ring follows with soft lag
      gsap.to(ring, {
        x: curX, y: curY,
        duration: 0.14,
        ease: "power3.out",
        overwrite: "auto",
      });

      // Trails: each chases the previous with increasing lag
      if (t1) {
        gsap.to(t1, { x: curX, y: curY, duration: 0.28, ease: "power2.out", overwrite: "auto" });
      }
      if (t2) {
        gsap.to(t2, { x: curX, y: curY, duration: 0.46, ease: "power2.out", overwrite: "auto" });
      }
    };

    const onDown = () => {
      setState("click");
      gsap.to([dot, ring], { scale: 0.55, duration: 0.12, ease: "power3.in", overwrite: true });
    };

    const onUp = () => {
      setState("default");
      // Elastic spring back — feels like the cursor "pops"
      gsap.to(dot,  { scale: 1, duration: 0.55, ease: "elastic.out(2.2, 0.45)", overwrite: true });
      gsap.to(ring, { scale: 1, duration: 0.55, ease: "elastic.out(1.8, 0.4)",  overwrite: true });
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a") || t.closest("button") || t.closest("[data-cursor-hover]")) {
        setState("hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = e.relatedTarget as HTMLElement | null;
      if (!t?.closest("a") && !t?.closest("button") && !t?.closest("[data-cursor-hover]")) {
        setState("default");
      }
    };

    const onDocLeave = () => setState(prev => prev === "click" ? prev : "hidden");

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.documentElement.addEventListener("mouseleave", onDocLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
    };
  }, [isTouch]);

  return { dotRef, ringRef, t1Ref, t2Ref, state, isTouch };
}
