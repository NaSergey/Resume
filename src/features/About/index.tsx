"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 4, suffix: "+", label: "Лет опыта" },
  { value: 8, suffix: "+", label: "Проектов" },
  { value: 6, suffix: "+", label: "Работодателей" },
  { value: 25, suffix: "+", label: "Технологий" },
];

const TRAITS = [
  "Performance-first thinking",
  "Design-system architecture",
  "Complex animation engineering",
  "Cross-functional collaboration",
];

/**
 * About section.
 *
 * Animations:
 * - Section tag slides from left on scroll enter
 * - Main text reveals via clip-path mask (lines, staggered)
 * - Stats count up from 0 on enter
 * - Trait tags stagger in from bottom-right with scale
 * - Portrait frame draws in via SVG stroke animation
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const traitsRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trig = {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      };

      // Tag slide
      gsap.fromTo(
        tagRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
      );

      // Heading: word-by-word clip-path reveal
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".about-word");
        gsap.fromTo(
          words,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { ...trig, start: "top 75%" },
          }
        );
      }

      // Body text
      if (bodyRef.current) {
        const paras = bodyRef.current.querySelectorAll("p");
        gsap.fromTo(
          paras,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: { ...trig, start: "top 70%" },
          }
        );
      }

      // Stats counter
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll<HTMLElement>(".stat-item");
        items.forEach((item) => {
          const valueEl = item.querySelector<HTMLElement>(".stat-value");
          if (!valueEl) return;
          const end = parseInt(item.dataset.value ?? "0", 10);

          gsap.fromTo(
            item,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { ...trig, start: "top 65%" },
              stagger: 0.1,
            }
          );

          ScrollTrigger.create({
            trigger: item,
            start: "top 75%",
            once: true,
            onEnter: () => {
              const counter = { val: 0 };
              gsap.to(counter, {
                val: end,
                duration: 1.8,
                ease: "power2.out",
                onUpdate() {
                  if (valueEl) valueEl.textContent = Math.round(counter.val).toString();
                },
              });
            },
          });
        });
      }

      // Trait tags
      if (traitsRef.current) {
        gsap.fromTo(
          traitsRef.current.children,
          { x: 20, opacity: 0, scale: 0.9 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.4)",
            scrollTrigger: { ...trig, start: "top 65%" },
          }
        );
      }

      // SVG frame draw-in
      if (frameRef.current) {
        const paths = frameRef.current.querySelectorAll("path, rect, line");
        paths.forEach((p) => {
          const len = (p as SVGGeometryElement).getTotalLength?.() ?? 200;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(p, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: { ...trig, start: "top 70%" },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef}>
      <div className="section-wrap">
        <div ref={tagRef} className="mb-12 opacity-0">
          <SectionTag index="01" label="About Me" />
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-16 xl:gap-24">
          {/* Left — text content */}
          <div>
            <h2
              ref={headingRef}
              className="font-sans font-bold mb-8 leading-[1.05]"
              style={{ fontSize: "var(--text-h2)", color: "var(--color-ink)" }}
            >
              {["Я строю", "интерфейсы,", "которые", "ощущаются."].map((word) => (
                <span
                  key={word}
                  className="about-word inline-block mr-[0.25em]"
                  style={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                >
                  {word}
                </span>
              ))}
            </h2>

            <div
              ref={bodyRef}
              className="space-y-5 max-w-xl"
              style={{ color: "var(--color-ink-dim)", lineHeight: 1.75, fontSize: "15px" }}
            >
              <p>
                4+ лет я занимаюсь frontend-разработкой — от стартапов на начальном этапе до
                enterprise-систем с миллионной аудиторией. Специализируюсь на React-экосистеме,
                сложных анимациях и архитектуре дизайн-систем.
              </p>
              <p>
                Для меня код — это не просто инструмент. Я думаю как motion designer и системный
                архитектор одновременно: каждое взаимодействие должно быть осмысленным,
                каждый пиксель — намеренным.
              </p>
              <p>
                Open to interesting projects and full-time positions.
              </p>
            </div>

            {/* Trait tags */}
            <div ref={traitsRef} className="flex flex-wrap gap-2 mt-8">
              {TRAITS.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] tracking-wider uppercase px-3 py-1.5"
                  style={{
                    color: "var(--color-cyan)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(0,212,255,0.04)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="flex flex-col gap-8">
            {/* SVG portrait frame */}
            <div className="relative">
              <svg
                ref={frameRef}
                viewBox="0 0 320 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                aria-hidden
              >
                <rect x="1" y="1" width="318" height="318" stroke="rgba(0,212,255,0.25)" strokeWidth="1" />
                <path d="M1 40 L1 1 L40 1"           stroke="var(--color-cyan)" strokeWidth="1.5" />
                <path d="M279 1 L319 1 L319 40"       stroke="var(--color-cyan)" strokeWidth="1.5" />
                <path d="M319 279 L319 319 L279 319"  stroke="var(--color-cyan)" strokeWidth="1.5" />
                <path d="M40 319 L1 319 L1 279"       stroke="var(--color-cyan)" strokeWidth="1.5" />
                <line x1="1" y1="160" x2="319" y2="160" stroke="rgba(0,212,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="8" y="314" fontFamily="monospace" fontSize="9" fill="rgba(0,212,255,0.4)">ID:NS-01</text>
                <text x="220" y="314" fontFamily="monospace" fontSize="9" fill="rgba(0,212,255,0.4)">STATUS:ACTIVE</text>
              </svg>

              {/* Avatar */}
              <div className="absolute inset-4 overflow-hidden">
                <Image
                  src="/photo/avatara.png"
                  alt="avatar"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* Stats grid */}
            <div ref={statsRef} className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="stat-item opacity-0 p-4 glass-hi clip-corner-sm"
                  data-value={s.value}
                >
                  <div
                    className="font-sans font-bold text-3xl leading-none mb-1"
                    style={{ color: "var(--color-cyan)" }}
                  >
                    <span className="stat-value">0</span>
                    <span>{s.suffix}</span>
                  </div>
                  <div
                    className="font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: "var(--color-ink-faint)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
