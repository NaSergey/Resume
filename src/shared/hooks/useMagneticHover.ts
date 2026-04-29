"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

interface MagneticOptions {
  strength?: number;
  innerStrength?: number;
  skewStrength?: number; // skew proportional to cursor velocity across the surface
  ease?: string;
  duration?: number;
}

/**
 * Magnetic hover with velocity-based skew distortion.
 *
 * Outer element: displaces softly.
 * Inner element: displaces more aggressively + skews in movement direction.
 * On enter: small scale jolt (the button "wakes up").
 * On leave: damped elastic spring — not just one bounce, but genuine decay.
 */
export function useMagneticHover<
  T extends HTMLElement = HTMLButtonElement,
  I extends HTMLElement = HTMLSpanElement,
>({
  strength      = 0.38,
  innerStrength = 0.68,
  skewStrength  = 3.5,   // max degrees of skew
  ease          = "power2.out",
  duration      = 0.45,
}: MagneticOptions = {}) {
  const outerRef = useRef<T>(null);
  const innerRef = useRef<I>(null);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const onMouseEnter = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    // Scale jolt: shrink slightly then spring beyond 1 before settling
    gsap.fromTo(
      el,
      { scale: 0.94 },
      { scale: 1, duration: 0.45, ease: "elastic.out(2.5, 0.5)" }
    );
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = outerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;

      // Velocity across the button surface (normalised by size)
      const velX = (e.clientX - prevMouseRef.current.x) / rect.width;
      const velY = (e.clientY - prevMouseRef.current.y) / rect.height;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      const skewX = velX * skewStrength * 60;  // degrees
      const skewY = velY * skewStrength * 40;

      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        ease,
        duration,
        overwrite: "auto",
      });

      if (innerRef.current) {
        gsap.to(innerRef.current, {
          x:     dx * innerStrength,
          y:     dy * innerStrength,
          skewX: Math.max(-skewStrength, Math.min(skewStrength, skewX)),
          skewY: Math.max(-skewStrength * 0.6, Math.min(skewStrength * 0.6, skewY)),
          ease,
          duration: duration * 0.8,
          overwrite: "auto",
        });
      }
    },
    [strength, innerStrength, skewStrength, ease, duration]
  );

  const onMouseLeave = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;

    // Damped elastic spring — overshoots then decays, like a physical spring
    gsap.to(el, {
      x: 0,
      y: 0,
      ease:     "elastic.out(1.35, 0.38)",
      duration: 1.0,
      overwrite: "auto",
    });

    if (innerRef.current) {
      gsap.to(innerRef.current, {
        x:    0,
        y:    0,
        skewX: 0,
        skewY: 0,
        ease:     "elastic.out(1.6, 0.42)",
        duration: 0.9,
        overwrite: "auto",
      });
    }
  }, []);

  return { outerRef, innerRef, onMouseEnter, onMouseMove, onMouseLeave };
}
