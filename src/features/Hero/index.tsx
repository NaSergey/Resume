"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { GridBackground } from "./GridBackground";
import { MagneticButton } from "@/shared/ui/MagneticButton";
import { SlashIcon } from "@/shared/ui/SlashIcon";
import { useLang } from "@/shared/providers/LangProvider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero section — deep animation system.
 *
 * Entrance timeline:
 * 0.0s  — label fades in
 * 0.3s  — chars fall in: random y-distance, random rotationZ, blur → sharp, stagger from random
 * 1.8s  — shockwave: scale cascade ripples left → right across settled chars
 * 2.0s  — role: each word clips from bottom with overshoot
 * 2.4s  — meta items alternate y-directions (odd up, even down)
 * 2.7s  — CTAs spring in with back.out
 * 3.0s  — scroll indicator
 *
 * Parallax:
 * - Canvas (slowest, 30%)
 * - Glow orbs (20% + spring-track cursor)
 * - Content (15%, fades at 60%)
 *
 * Mouse:
 * - Orb 1 (cyan) drifts toward cursor with spring physics
 * - Orb 2 (purple) drifts away from cursor (parallax counter-motion)
 *
 * Scroll velocity:
 * - On first scroll, chars get a brief skewX jolt proportional to velocity
 */
export function Hero() {
  const { t } = useLang();
  const wrapRef    = useRef<HTMLElement>(null);
  const charsRef   = useRef<HTMLElement[]>([]);
  const labelRef   = useRef<HTMLDivElement>(null);
  const roleRef    = useRef<HTMLDivElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const orb1Ref    = useRef<HTMLDivElement>(null);
  const orb2Ref    = useRef<HTMLDivElement>(null);
  const orb3Ref    = useRef<HTMLDivElement>(null);

  /* ── collect char elements ── */
  useEffect(() => {
    if (!wrapRef.current) return;
    charsRef.current = Array.from(
      wrapRef.current.querySelectorAll<HTMLElement>(".hero-char")
    );
  }, []);

  /* ── entrance timeline ── */
  useEffect(() => {
    const chars = charsRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // 1. Label
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: -12, letterSpacing: "0.5em" },
        { opacity: 1, y: 0, letterSpacing: "0.25em", duration: 0.7, ease: "power3.out" },
        0
      );

      // 2. Chars — each has random starting rotationZ and y distance
      if (chars.length) {
        // Randomise starting state per char (set before tween so GSAP captures it)
        chars.forEach((c) => {
          const randY = 60 + Math.random() * 80;          // 60–140px
          const randRz = (Math.random() - 0.5) * 30;     // ±15°
          const randX = (Math.random() - 0.5) * 20;
          gsap.set(c, {
            y: randY,
            x: randX,
            rotationZ: randRz,
            opacity: 0,
            filter: "blur(10px)",
            transformOrigin: "50% 100%",
          });
        });

        tl.to(
          chars,
          {
            y: 0,
            x: 0,
            rotationZ: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.0,
            ease: "power4.out",
            stagger: {
              amount: 0.65,
              from: "random",
              ease: "power2.inOut",
            },
          },
          0.3
        );

        // 3. Shockwave — scale pulse cascades start → end after all chars landed
        tl.to(
          chars,
          {
            scaleY: 1.12,
            scaleX: 0.94,
            duration: 0.12,
            ease: "power2.out",
            stagger: { amount: 0.3, from: "start" },
          },
          1.6
        );
        tl.to(
          chars,
          {
            scaleY: 1,
            scaleX: 1,
            duration: 0.22,
            ease: "elastic.out(2.5, 0.5)",
            stagger: { amount: 0.3, from: "start" },
          },
          "<0.1"
        );
      }

      // 4. Role — each word clips from bottom (Y axis) with overshoot
      if (roleRef.current) {
        const words = Array.from(
          roleRef.current.querySelectorAll<HTMLElement>(".role-word")
        );
        if (words.length) {
          gsap.set(words, { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 12 });
          tl.to(
            words,
            {
              clipPath: "inset(0 0 0% 0)",
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: "power3.out",
            },
            1.85
          );
        }
      }

      // 5. Meta — alternating up/down entrance
      if (metaRef.current) {
        const items = Array.from(metaRef.current.children) as HTMLElement[];
        items.forEach((item, i) => {
          const dir = i % 2 === 0 ? 24 : -24;
          gsap.set(item, { y: dir, opacity: 0 });
          tl.to(
            item,
            { y: 0, opacity: 1, duration: 0.55, ease: "back.out(1.8)" },
            2.1 + i * 0.08
          );
        });
      }

      // 6. CTAs with spring pop
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { y: 28, opacity: 0, scale: 0.85 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            stagger: 0.14,
            ease: "back.out(2.0)",
          },
          2.45
        );
      }

      // 7. Scroll indicator
      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          2.85
        );
      }
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  /* ── glow orb spring-tracking cursor ── */
  useEffect(() => {
    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;
    const orb3 = orb3Ref.current;
    if (!orb1 || !orb2) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth  - 0.5);  // -0.5 → 0.5
      const ny = (e.clientY / window.innerHeight - 0.5);

      // Cyan orb drifts toward cursor (same direction)
      gsap.to(orb1, {
        x: nx * 80,
        y: ny * 55,
        duration: 2.2,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Purple orb counter-drifts (opposite direction — parallax depth illusion)
      gsap.to(orb2, {
        x: -nx * 55,
        y: -ny * 40,
        duration: 2.8,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Centre orb pulses on extreme cursor positions
      if (orb3) {
        const dist = Math.sqrt(nx * nx + ny * ny);
        gsap.to(orb3, {
          scale: 1 + dist * 0.4,
          opacity: 0.06 + dist * 0.08,
          duration: 1.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── scroll parallax (multi-layer) ── */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      // Layer 1 — canvas grid (slowest)
      if (bgLayerRef.current) {
        gsap.to(bgLayerRef.current, {
          y: "32%",
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top top", end: "bottom top", scrub: true },
        });
      }

      // Layer 2 — content compresses + fades
      const contentEls = wrap.querySelectorAll(".hero-content-layer");
      gsap.to(contentEls, {
        y: "-14%",
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top top", end: "60% top", scrub: true },
      });

      // Scroll velocity → chars skewX jolt (once, on first real scroll)
      let lastProgress = 0;
      let skewApplied = false;
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          if (skewApplied) return;
          const vel = (self.progress - lastProgress) * 60;
          lastProgress = self.progress;
          if (Math.abs(vel) > 0.5 && charsRef.current.length) {
            skewApplied = true;
            gsap.to(charsRef.current, {
              skewX: vel * 8,
              duration: 0.15,
              stagger: { amount: 0.2, from: "start" },
              ease: "power3.out",
              onComplete: () => {
                gsap.to(charsRef.current, {
                  skewX: 0,
                  duration: 0.5,
                  stagger: { amount: 0.2, from: "start" },
                  ease: "elastic.out(1.4, 0.4)",
                });
              },
            });
          }
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={wrapRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-grid noise"
    >
      {/* Canvas dot grid */}
      <div ref={bgLayerRef} className="absolute inset-0">
        <GridBackground />
      </div>

      {/* Glow orbs — individually tracked via refs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          ref={orb1Ref}
          className="absolute rounded-full"
          style={{
            width: "640px", height: "640px",
            top: "8%", left: "-12%",
            background: "radial-gradient(circle, rgba(0,212,255,0.09) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          ref={orb2Ref}
          className="absolute rounded-full"
          style={{
            width: "520px", height: "520px",
            bottom: "8%", right: "-8%",
            background: "radial-gradient(circle, rgba(157,78,221,0.11) 0%, transparent 70%)",
            filter: "blur(65px)",
          }}
        />
        <div
          ref={orb3Ref}
          className="absolute rounded-full"
          style={{
            width: "320px", height: "320px",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)",
            filter: "blur(50px)",
            opacity: 0.04,
          }}
        />
      </div>

      {/* Content */}
      <div
        className="hero-content-layer relative z-10 section-wrap w-full"
        style={{ paddingTop: "120px", paddingBottom: "80px" }}
      >
        {/* System label */}
        <div
          ref={labelRef}
          className="opacity-0 mb-8 inline-flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase"
          style={{ color: "var(--color-cyan)", letterSpacing: "0.25em" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full dot-breathe flex-shrink-0"
            style={{ background: "var(--color-cyan)" }}
          />
          <span className="flicker inline-flex items-center">SYS:<SlashIcon width={16} height={11} />PORTFOLIO_v2.0</span>
          <span style={{ color: "var(--color-ink-faint)" }}>■</span>
          <span className="basis-full sm:hidden" />
          <span style={{ color: "var(--color-ink-faint)" }}>INITIALIZING</span>
          <span className="blink" style={{ color: "var(--color-cyan)" }}>_</span>
        </div>

        {/* Name */}
        <div
          className="relative mb-2"
          style={{ perspective: "1000px", perspectiveOrigin: "50% 60%" }}
        >
          <h1
            className="font-sans font-bold leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: "var(--text-hero)", color: "var(--color-ink)" }}
          >
            <span className="block">
              {t.hero.name.line1.split("").map((c, i) => (
                <span
                  key={`n-${i}`}
                  className="hero-char split-char"
                  style={{ display: "inline-block", opacity: 0, willChange: "transform, opacity, filter", transformOrigin: "50% 100%" }}
                >
                  {c}
                </span>
              ))}
            </span>

            <span className="block">
              {t.hero.name.line2main.split("").map((c, i) => (
                <span
                  key={`s-${i}`}
                  className="hero-char split-char"
                  style={{ display: "inline-block", opacity: 0, willChange: "transform, opacity, filter", transformOrigin: "50% 100%" }}
                >
                  {c}
                </span>
              ))}
              {t.hero.name.line2end.split("").map((c, i) => (
                <span
                  key={`y-${i}`}
                  className="hero-char split-char"
                  style={{
                    display: "inline-block",
                    opacity: 0,
                    color: "var(--color-cyan)",
                    textShadow: "0 0 40px var(--color-cyan-glow), 0 0 80px rgba(0,212,255,0.2)",
                    willChange: "transform, opacity, filter",
                    transformOrigin: "50% 100%",
                  }}
                >
                  {c}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Role */}
        <div ref={roleRef} className="mb-12">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {["Frontend Engineer", "—", "React · Next.js · TypeScript"].map((word) => (
              <span
                key={word}
                className="role-word"
                style={{
                  display: "inline-block",
                  fontSize: word === "—" ? "clamp(14px, 2vw, 24px)" : undefined,
                  color: word === "—" ? "var(--color-ink-faint)" :
                         word === "React · Next.js · TypeScript" ? "var(--color-ink-faint)" : "var(--color-ink-dim)",
                  fontFamily: word === "React · Next.js · TypeScript" ? "var(--font-mono)" : undefined,
                  letterSpacing: "-0.01em",
                  fontWeight: word === "Frontend Engineer" ? 300 : undefined,
                  clipPath: "inset(0 0 100% 0)",
                  opacity: 0,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Meta strip */}
        <div ref={metaRef} className="flex flex-wrap gap-x-8 gap-y-4 mb-12">
          {[
            { id: "exp",    label: t.hero.metaLabels.experience, value: "4+",   unit: t.hero.metaUnits.experience },
            { id: "proj",   label: t.hero.metaLabels.projects,   value: "8+",   unit: "" },
            { id: "status", label: t.hero.metaLabels.status,     value: "Open", unit: t.hero.metaUnits.status },
            { id: "loc",    label: t.hero.metaLabels.location,   value: "СПб",  unit: t.hero.metaUnits.location },
          ].map((m) => (
            <div key={m.id} className="flex flex-col gap-1" style={{ opacity: 0 }}>
              <span
                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "var(--color-ink-faint)" }}
              >
                {m.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="font-sans font-semibold text-2xl"
                  style={{ color: "var(--color-cyan)" }}
                >
                  {m.value}
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--color-ink-dim)" }}>
                  {m.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-wrap gap-4">
          <MagneticButton href="#projects" variant="primary" size="lg" className="opacity-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            {t.hero.cta}
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="hero-content-layer opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "var(--color-ink-faint)" }}
        >
          Scroll
        </span>
        <div
          className="w-px h-12 relative overflow-hidden"
          style={{ background: "rgba(0,212,255,0.15)" }}
        >
          <div
            className="absolute inset-x-0 h-4"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--color-cyan))",
              animation: "scroll-bar 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scroll-bar {
          0%   { top: -16px; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { top: 48px; opacity: 0; }
        }
      `}</style>

      <CornerDeco position="tl" />
      <CornerDeco position="br" />
    </section>
  );
}

function CornerDeco({ position }: { position: "tl" | "br" }) {
  const isTL = position === "tl";
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top:    isTL ? "20px" : undefined,
        bottom: !isTL ? "20px" : undefined,
        left:   isTL ? "20px" : undefined,
        right:  !isTL ? "20px" : undefined,
      }}
      aria-hidden
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d={isTL ? "M0 20 L0 0 L20 0" : "M40 20 L40 40 L20 40"}
          stroke="rgba(0,212,255,0.3)"
          strokeWidth="1"
        />
        <circle
          cx={isTL ? 0 : 40}
          cy={isTL ? 0 : 40}
          r="3"
          fill="var(--color-cyan)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
