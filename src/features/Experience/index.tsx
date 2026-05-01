"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";
import { syncLenisTarget } from "@/shared/providers/LenisProvider";
import { JOBS, type Job } from "@/shared/data";
import { useLang } from "@/shared/providers/LangProvider";

gsap.registerPlugin(ScrollTrigger);


export function Experience() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const thumbRef   = useRef<HTMLDivElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>("j1");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trig = {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      };

      gsap.fromTo(".exp-tag",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
      );
      gsap.fromTo(".exp-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: trig }
      );


      gsap.fromTo(".exp-card",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { ...trig, start: "top 70%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const updateThumb = () => {
    const list  = listRef.current;
    const thumb = thumbRef.current;
    if (!list || !thumb) return;
    const { scrollTop, scrollHeight, clientHeight } = list;
    const thumbH = Math.max(40, (clientHeight / scrollHeight) * clientHeight);
    const thumbY = (scrollTop / (scrollHeight - clientHeight || 1)) * (clientHeight - thumbH);
    thumb.style.height = `${thumbH}px`;
    thumb.style.top    = `${thumbY}px`;
  };

  useEffect(() => { updateThumb(); }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onWheel = (e: WheelEvent) => {
      if (!list.contains(e.target as Node)) return;
      const { scrollTop, scrollHeight, clientHeight } = list;
      const canScroll = (e.deltaY > 0 && scrollTop + clientHeight < scrollHeight - 1)
                     || (e.deltaY < 0 && scrollTop > 0);
      if (canScroll) {
        e.preventDefault();
        e.stopImmediatePropagation();
        list.scrollBy({ top: e.deltaY, behavior: "instant" });
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;
    const color = JOBS.find((j) => j.id === activeId)?.color ?? "var(--color-cyan)";
    thumb.style.background = color;
    thumb.style.boxShadow  = `0 0 8px ${color}`;
  }, [activeId]);

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
            {t.experience.heading}
          </h2>
          <p className="font-mono text-sm" style={{ color: "var(--color-ink-faint)" }}>
            {t.experience.subtitle}
          </p>
        </div>

        <div className="timeline-wrap grid lg:grid-cols-[40px_1fr_380px] gap-0">

          {/* Scrollbar track + thumb */}
          <div className="relative hidden lg:block" style={{ height: "480px" }}>
            <div
              ref={thumbRef}
              className="absolute rounded-full"
              style={{
                top: 0,
                left: "calc(50% - 1.5px)",
                width: "3px",
                background: "var(--color-cyan)",
                boxShadow: "0 0 8px var(--color-cyan)",
                transition: "top 0.12s ease",
              }}
            />
          </div>

          {/* Scrollable card list */}
          <div
            ref={listRef}
            className="flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden"
            style={{ maxHeight: "480px", scrollbarWidth: "none" }}
            onMouseEnter={syncLenisTarget}
            onScroll={updateThumb}
          >
            {JOBS.map((job) => {
              const isActive = job.id === activeId;
              return (
                <div
                  key={job.id}
                  className="exp-card opacity-0 p-5 clip-corner"
                  onClick={() => setActiveId(job.id)}
                  style={{
                    border: `1px solid ${isActive ? `${job.color}70` : "var(--color-border)"}`,
                    background: isActive ? `${job.color}08` : "var(--color-surface)",
                    boxShadow: isActive ? `0 0 20px ${job.color}14` : "none",
                    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {job.highlight && (
                          <span
                            className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5"
                            style={{
                              color: job.color,
                              border: `1px solid ${job.color}50`,
                              borderRadius: "2px",
                            }}
                          >
                            Latest
                          </span>
                        )}
                        <span
                          className="font-mono font-semibold text-base"
                          style={{
                            color: isActive ? job.color : "var(--color-ink-dim)",
                            textShadow: isActive ? `0 0 14px ${job.color}90` : "none",
                            transition: "color 0.2s, text-shadow 0.2s",
                          }}
                        >
                          {job.company}
                        </span>
                      </div>
                      <span
                        className="font-mono text-label"
                        style={{ color: "var(--color-ink-faint)" }}
                      >
                        {job.role}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-label" style={{ color: "var(--color-ink-dim)" }}>
                        {job.period}
                      </div>
                      <div className="font-mono text-[10px]" style={{ color: "var(--color-ink-faint)" }}>
                        {t.experience.durations[job.id as keyof typeof t.experience.durations] ?? job.duration}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right — detail panel */}
          <div className="hidden lg:block pl-8">
            <DetailPanel job={activeJob} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailPanel({ job }: { job: Job }) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(job);

  // Initial mount
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { x: 80, opacity: 0, rotation: 4 },
      { x: 0, opacity: 1, rotation: 0, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (job.id === displayed.id) return;
    const el = ref.current;
    if (!el) return;

    gsap.killTweensOf(el);

    // Throw out to the right
    gsap.to(el, {
      x: 220,
      opacity: 0,
      rotation: 12,
      scale: 0.9,
      duration: 0.25,
      ease: "power3.in",
      onComplete: () => {
        setDisplayed(job);
        // Fly in from the right
        gsap.fromTo(el,
          { x: 160, opacity: 0, rotation: -8, scale: 0.95 },
          { x: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.38, ease: "power3.out" }
        );
      },
    });
  }, [job.id]);

  return (
    <div
      ref={ref}
      className="glass-hi clip-corner p-6 sticky top-24"
      style={{ borderColor: `${displayed.color}35`, transition: "border-color 0.3s ease" }}
    >
      <div className="mb-6">
        <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: displayed.color }}>
          Currently viewing
        </p>
        <h3 className="font-bold text-lg mb-1" style={{ color: displayed.color, textShadow: `0 0 16px ${displayed.color}60` }}>
          {displayed.company}
        </h3>
        <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>{displayed.role}</p>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { label: "Period",   value: displayed.period },
          { label: "Duration", value: displayed.duration },
          { label: "Type",     value: displayed.type },
        ].map((row) => (
          <div key={row.label} className="flex justify-between">
            <span className="font-mono text-label" style={{ color: "var(--color-ink-faint)" }}>{row.label}</span>
            <span className="font-mono text-label" style={{ color: "var(--color-ink-dim)" }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px w-full mb-6" style={{ background: "var(--color-border)" }} />

      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-ink-dim)" }}>
        {t.experience.jobs[displayed.id as keyof typeof t.experience.jobs] ?? displayed.desc}
      </p>

      <div className="flex flex-wrap gap-2">
        {displayed.stack.map((s) => (
          <span
            key={s}
            className="font-mono text-[10px] tracking-wider px-2 py-1"
            style={{
              color: displayed.color,
              border: `1px solid ${displayed.color}40`,
              borderRadius: "2px",
              background: `${displayed.color}08`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
