"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── Hero: plays on mount, no scroll trigger ───────────────────────
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          "[data-hero-eyebrow]",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
        .fromTo(
          "[data-hero-h1]",
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "expo.out" },
          "-=0.15"
        )
        .fromTo(
          "[data-hero-meta] > *",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 },
          "-=0.65"
        );

      // ─── B: clip-path reveal (section nums + titles) ───────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.0,
            ease: "expo.out",
            delay: parseFloat(el.dataset.gsapDelay ?? "0"),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // ─── A: fade-up for individual blocks ──────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap-fade]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: parseFloat(el.dataset.gsapDelay ?? "0"),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // ─── A: stagger-fade-up for grid/list children ─────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap-stagger]").forEach((container) => {
        gsap.fromTo(
          Array.from(container.children),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            stagger: 0.07,
            scrollTrigger: { trigger: container, start: "top 82%", once: true },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
