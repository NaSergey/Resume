"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";

gsap.registerPlugin(ScrollTrigger);

const JOBS = [
  {
    id: "j1",
    company: "Acme Digital",
    role: "Senior Frontend Engineer",
    period: "2022 — н.в.",
    duration: "2 года",
    type: "Full-time",
    stack: ["React", "Next.js", "TypeScript", "GSAP"],
    desc: "Архитектура дизайн-системы на 200+ компонентов. Оптимизация Core Web Vitals: LCP с 4.2s до 1.1s. Внедрение micro-frontend подхода для масштабирования команды.",
    highlight: true,
  },
  {
    id: "j2",
    company: "Fintech Corp",
    role: "Frontend Engineer",
    period: "2020 — 2022",
    duration: "2 года",
    type: "Full-time",
    stack: ["Vue.js", "TypeScript", "D3.js"],
    desc: "Разработка финтех-дашборда с real-time данными. Реализация сложных D3 визуализаций. Ответственен за DX — storybook, тесты, CI/CD пайплайн.",
    highlight: false,
  },
  {
    id: "j3",
    company: "Agency XYZ",
    role: "Frontend Developer",
    period: "2018 — 2020",
    duration: "2 года",
    type: "Full-time",
    stack: ["React", "CSS", "GSAP"],
    desc: "Разработка award-winning лендингов и промо-сайтов. Работа с международными брендами. Фокус на интерактивные анимации и нестандартные UI решения.",
    highlight: false,
  },
];

/**
 * Experience section.
 *
 * Animations:
 * - Timeline line draws from top to bottom via scaleY + ScrollTrigger scrub
 * - Each job entry: connector dot pops in, card slides from right
 * - Active card expands with height animation via GSAP (not CSS max-height hack)
 * - Scroll-pinned on desktop: timeline stays fixed while cards scroll
 */
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>("j1");

  /* ── Timeline draw animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const trig = {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      };

      // Tag / heading
      gsap.fromTo(
        ".exp-tag",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
      );
      gsap.fromTo(
        ".exp-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: trig }
      );

      // Timeline line scaleY from 0 → 1 with scrub
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline-wrap",
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.5,
            },
          }
        );
      }

      // Cards stagger from right
      gsap.fromTo(
        ".exp-card",
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: { ...trig, start: "top 70%" },
        }
      );

      // Dots pop in
      gsap.fromTo(
        ".timeline-dot",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.18,
          ease: "back.out(1.8)",
          scrollTrigger: { ...trig, start: "top 70%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeJob = JOBS.find((j) => j.id === activeId)!;

  return (
    <section id="experience" ref={sectionRef}>
      <div className="section-wrap">
        <div className="exp-tag mb-4 opacity-0">
          <SectionTag index="03" label="Experience" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
          <h2
            className="exp-heading opacity-0 font-bold"
            style={{ fontSize: "var(--text-h2)", color: "var(--color-ink)" }}
          >
            Опыт работы
          </h2>
          <p
            className="font-mono text-sm"
            style={{ color: "var(--color-ink-faint)" }}
          >
            6+ years · 3 companies
          </p>
        </div>

        {/* Timeline layout */}
        <div className="timeline-wrap grid md:grid-cols-[80px_1fr] lg:grid-cols-[80px_1fr_360px] gap-0">
          {/* Vertical line + dots */}
          <div className="relative hidden md:block">
            <div
              ref={lineRef}
              className="timeline-line"
              style={{ transformOrigin: "top center" }}
            />
            <div className="relative z-10 flex flex-col gap-0">
              {JOBS.map((job, i) => {
                const isActive = job.id === activeId;
                const DOT_SPACING = 120;
                return (
                  <div
                    key={job.id}
                    className="timeline-dot"
                    style={{ marginTop: i === 0 ? 0 : `${DOT_SPACING}px`, position: "relative" }}
                    onClick={() => setActiveId(job.id)}
                  >
                    <div
                      className="w-3 h-3 rounded-full absolute -left-[5px]"
                      style={{
                        background: isActive ? "var(--color-cyan)" : "var(--color-ink-ghost)",
                        border: `1px solid ${isActive ? "var(--color-cyan)" : "rgba(255,255,255,0.1)"}`,
                        boxShadow: isActive ? "0 0 12px var(--color-cyan-glow)" : "none",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job list */}
          <div className="flex flex-col gap-4">
            {JOBS.map((job) => {
              const isActive = job.id === activeId;
              return (
                <div
                  key={job.id}
                  className="exp-card opacity-0"
                  onClick={() => setActiveId(job.id)}
                  data-cursor-hover
                >
                  <div
                    className="glass-hi clip-corner p-6 transition-all duration-300"
                    style={{
                      borderColor: isActive ? "rgba(0,212,255,0.3)" : "var(--color-border)",
                      background: isActive ? "rgba(0,212,255,0.04)" : undefined,
                    }}
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {job.highlight && (
                            <span
                              className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5"
                              style={{
                                color: "var(--color-cyan)",
                                border: "1px solid rgba(0,212,255,0.3)",
                                borderRadius: "2px",
                              }}
                            >
                              Current
                            </span>
                          )}
                          <span
                            className="font-sans font-semibold text-base"
                            style={{ color: isActive ? "var(--color-ink)" : "var(--color-ink-dim)" }}
                          >
                            {job.role}
                          </span>
                        </div>
                        <span
                          className="font-mono text-[12px]"
                          style={{ color: isActive ? "var(--color-cyan)" : "var(--color-ink-faint)" }}
                        >
                          {job.company}
                        </span>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div
                          className="font-mono text-[11px]"
                          style={{ color: "var(--color-ink-dim)" }}
                        >
                          {job.period}
                        </div>
                        <div
                          className="font-mono text-[10px]"
                          style={{ color: "var(--color-ink-faint)" }}
                        >
                          {job.duration}
                        </div>
                      </div>
                    </div>

                    {/* Expandable body */}
                    {isActive && (
                      <ExpandBody job={job} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right detail panel — desktop only */}
          <div className="hidden lg:block pl-8">
            <DetailPanel job={activeJob} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpandBody({ job }: { job: typeof JOBS[0] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { height: 0, opacity: 0, y: -10 },
      { height: "auto", opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
    return () => {
      if (ref.current) {
        gsap.set(ref.current, { clearProps: "all" });
      }
    };
  }, []);

  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <p
        className="text-sm leading-relaxed mt-4 mb-4"
        style={{ color: "var(--color-ink-dim)" }}
      >
        {job.desc}
      </p>
      <div className="flex flex-wrap gap-2">
        {job.stack.map((s) => (
          <span
            key={s}
            className="font-mono text-[10px] tracking-wider px-2 py-1"
            style={{
              color: "var(--color-cyan)",
              border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: "2px",
              background: "rgba(0,212,255,0.04)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function DetailPanel({ job }: { job: typeof JOBS[0] }) {
  return (
    <div
      className="glass-hi clip-corner p-6 sticky top-24"
      style={{ borderColor: "rgba(0,212,255,0.2)" }}
    >
      <div className="mb-6">
        <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--color-ink-faint)" }}>
          Currently viewing
        </p>
        <h3 className="font-bold text-lg mb-1" style={{ color: "var(--color-cyan)" }}>
          {job.company}
        </h3>
        <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>{job.role}</p>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { label: "Period", value: job.period },
          { label: "Duration", value: job.duration },
          { label: "Type", value: job.type },
        ].map((row) => (
          <div key={row.label} className="flex justify-between">
            <span className="font-mono text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
              {row.label}
            </span>
            <span className="font-mono text-[11px]" style={{ color: "var(--color-ink-dim)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className="h-px w-full mb-6"
        style={{ background: "var(--color-border)" }}
      />

      <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-dim)" }}>
        {job.desc}
      </p>
    </div>
  );
}
