"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";
import { MagneticButton } from "@/shared/ui/MagneticButton";
import { ProjectModal } from "./ProjectModal";
import { PROJECTS, type Project } from "@/shared/data";
import { useLang } from "@/shared/providers/LangProvider";

/**
 * Projects — deep animation system.
 *
 * Horizontal scroll:
 * - ScrollTrigger pin + scrub 1.5
 * - Velocity tracking: EMA of progress delta → card-inner rotationY lean
 * - Spring-back to neutral when velocity drops below threshold
 *
 * Card hover:
 * - rotationX/Y toward cursor (12°)
 * - Three inner layers (back/mid/front) shift at different X/Y rates
 *   creating a genuine parallax depth illusion within the card
 * - Orb glow follows cursor inside card
 *
 * Card enter viewport:
 * - Number scramble/glitch effect via IntersectionObserver
 */
export function Projects() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  /* ── Entrance + horizontal scroll + velocity tilt ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const track   = trackRef.current;
      const pinWrap = pinWrapRef.current;
      if (!track || !pinWrap) return;

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      const trig = {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      };

      gsap.fromTo(".proj-tag",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
      );
      gsap.fromTo(".proj-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: trig }
      );

      // Velocity state
      let lastProgress  = 0;
      let smoothVel     = 0;
      let springBackRaf = 0;

      const springBackCards = () => {
        const inners = track.querySelectorAll<HTMLElement>(".card-inner");
        gsap.to(inners, {
          rotationY: 0,
          duration:  1.0,
          ease:      "elastic.out(1.3, 0.45)",
          overwrite: "auto",
        });
      };

      const hST = ScrollTrigger.create({
        trigger:             pinWrap,
        start:               "top top",
        end:                 () => `+=${Math.abs(getScrollAmount())}`,
        pin:                 true,
        pinType:             "transform",
        // anticipatePin removed — with Lenis it reads smoothed velocity
        // and fires 100-150px too early, causing the teleport
        scrub:               1,
        invalidateOnRefresh: true,

        onUpdate: (self) => {
          gsap.set(track, { x: getScrollAmount() * self.progress });

          const delta = self.progress - lastProgress;
          lastProgress = self.progress;
          smoothVel = smoothVel * 0.55 + delta * 0.45;

          const tiltDeg = Math.max(-18, Math.min(18, smoothVel * -1400));
          const inners  = track.querySelectorAll<HTMLElement>(".card-inner");
          gsap.to(inners, {
            rotationY: tiltDeg,
            duration:  0.25,
            ease:      "power2.out",
            overwrite: "auto",
          });

          cancelAnimationFrame(springBackRaf);
          springBackRaf = requestAnimationFrame(() => {
            if (Math.abs(smoothVel) < 0.0008) springBackCards();
          });
        },

        onLeave:     springBackCards,
        onLeaveBack: springBackCards,
      });

      // Cards reveal
      gsap.fromTo(
        ".proj-card",
        { clipPath: "inset(100% 0 0 0)", opacity: 0 },
        {
          clipPath:  "inset(0% 0 0 0)",
          opacity:   1,
          duration:  0.9,
          stagger:   0.1,
          ease:      "expo.out",
          scrollTrigger: { ...trig, start: "top 70%", once: true },
          onComplete() {
            gsap.set(".proj-card", { clearProps: "clipPath" });
          },
        }
      );

      return () => {
        hST.kill();
        cancelAnimationFrame(springBackRaf);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Number glitch on card entering scroll viewport ── */
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".proj-card");
    if (!cards) return;
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
    const observers: IntersectionObserver[] = [];

    cards.forEach((card) => {
      const numEl = card.querySelector<HTMLElement>(".proj-num");
      if (!numEl) return;
      const original = numEl.textContent ?? "";

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          let iter = 0;
          const id = setInterval(() => {
            numEl.textContent = original
              .split("")
              .map((ch, i) => (i < iter || ch === " " ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
              .join("");
            iter += 0.8;
            if (iter >= original.length) {
              clearInterval(id);
              numEl.textContent = original;
            }
          }, 35);
        },
        { threshold: 0.3 }
      );
      io.observe(card);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Card hover: 3D tilt + inner parallax layers ── */
  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card  = e.currentTarget;
    const inner = card.querySelector<HTMLElement>(".card-inner");
    if (!inner) return;

    const rect = card.getBoundingClientRect();
    const rx   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    const ry   = ((e.clientX - rect.left) / rect.width  - 0.5) * -2;
    const cx   = e.clientX - rect.left - rect.width  / 2;
    const cy   = e.clientY - rect.top  - rect.height / 2;

    // Outer tilt
    gsap.to(inner, {
      rotationX: rx * 12,
      rotationY: ry * 12,
      duration:  0.28,
      ease:      "power2.out",
      transformPerspective: 900,
      overwrite: "auto",
    });

    // Three depth layers shift at different rates → parallax depth
    const layers: Array<{ sel: string; mult: number }> = [
      { sel: ".layer-back",  mult: 0.10 },
      { sel: ".layer-mid",   mult: 0.22 },
      { sel: ".layer-front", mult: 0.38 },
    ];
    layers.forEach(({ sel, mult }) => {
      const el = inner.querySelector<HTMLElement>(sel);
      if (el) {
        gsap.to(el, { x: cx * mult, y: cy * mult, duration: 0.32, ease: "power2.out", overwrite: "auto" });
      }
    });

    // Orb glow follows
    const orb = inner.querySelector<HTMLElement>(".card-orb");
    if (orb) gsap.to(orb, { x: cx * 0.45, y: cy * 0.45, duration: 0.4, ease: "power2.out" });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector<HTMLElement>(".card-inner");
    if (!inner) return;

    gsap.to(inner, {
      rotationX: 0, rotationY: 0,
      duration: 0.9, ease: "elastic.out(1.25, 0.42)", overwrite: "auto",
    });
    [".layer-back", ".layer-mid", ".layer-front"].forEach((sel) => {
      const el = inner.querySelector<HTMLElement>(sel);
      if (el) gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1.2, 0.4)" });
    });
    const orb = inner.querySelector<HTMLElement>(".card-orb");
    if (orb) gsap.to(orb, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1.2, 0.4)" });
  };

  return (
    <section id="projects" ref={sectionRef}>
      {/* Pinned horizontal scroll — heading lives inside the pin */}
      <div ref={pinWrapRef} className="flex flex-col" style={{ height: "100vh" }}>
        {/* Heading — stationary inside pinned area */}
        <div className="shrink-0 pt-[clamp(20px,6vw,80px)] px-[clamp(20px,6vw,80px)] pb-[clamp(16px,2vh,28px)]">
          <div className="proj-tag mb-4 opacity-0">
            <SectionTag index="04" label="Projects" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <h2
              className="proj-heading opacity-0 font-bold"
              style={{ fontSize: "var(--text-h2)", color: "var(--color-ink)" }}
            >
              {t.projects.heading}
            </h2>
            <MagneticButton href="https://github.com/NaSergey" variant="outline" size="sm">
              GitHub →
            </MagneticButton>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex items-center shrink-0 px-[clamp(20px,6vw,80px)] gap-6 py-4 h-[clamp(420px,60vh,580px)]"
        >
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="proj-card flex-shrink-0 opacity-0 w-[clamp(240px,26vw,360px)] h-full perspective-[1100px]"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
              onClick={() => setActive(project)}
              data-cursor-hover
            >
              {/* glass-hi (backdrop-filter) lives on the outer shell; preserve-3d on the inner — they must not share an element */}
              <div
                className="card-inner h-full relative"
                style={{ transformStyle: "preserve-3d", borderRadius: "4px" }}
              >
                {/* glass backdrop — separate element so backdrop-filter doesn't break preserve-3d */}
                <div
                  className="noise absolute inset-0 pointer-events-none z-10"
                  style={{
                    borderRadius: "4px",
                    background: "rgba(18, 18, 42, 0.96)",
                    border: `1px solid ${project.rawColor}55`,
                    boxShadow: `0 0 0 1px ${project.rawColor}15, inset 0 1px 0 ${project.rawColor}20`,
                    backdropFilter: "blur(16px) saturate(160%)",
                    WebkitBackdropFilter: "blur(16px) saturate(160%)",
                  }}
                />
                <div
                  className="relative h-full flex flex-col justify-between z-10"
                  style={{ padding: "clamp(24px, 3vw, 40px)" }}
                >
                {/* Orb */}
                <div
                  className="card-orb absolute w-56 h-56 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${project.rawColor}18 0%, transparent 70%)`,
                    top: "10%", left: "10%",
                    filter: "blur(35px)",
                  }}
                />

                {/* BACK layer — num + year */}
                <div className="layer-back relative z-10">
                  <div className="flex items-center justify-between">
                    <span
                      className="proj-num font-mono text-label tracking-[0.2em] uppercase"
                      style={{ color: project.rawColor, opacity: 0.8 }}
                    >
                      {project.num}
                    </span>
                    <span className="font-mono text-label" style={{ color: "var(--color-ink-faint)" }}>
                      {project.year === "Будет позже" ? t.projects.comingSoon : project.year}
                    </span>
                  </div>
                </div>

                {/* MID layer — category + title */}
                <div className="layer-mid relative z-10">
                  <p
                    className="font-mono text-label tracking-widest uppercase mb-3"
                    style={{ color: "var(--color-ink-faint)" }}
                  >
                    {project.category}
                  </p>
                  <h3
                    className="font-bold leading-tight mb-4"
                    style={{ fontSize: "var(--text-h3)", color: "var(--color-ink)" }}
                  >
                    {project.title}
                  </h3>
                </div>

                {/* FRONT layer — desc + stack + link */}
                <div className="layer-front relative z-10 flex flex-col">
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-ink-dim)" }}>
                    {t.projects.descs[project.id as keyof typeof t.projects.descs] ?? project.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="font-mono text-[10px] tracking-wider px-2 py-1"
                        style={{
                          color:        project.rawColor,
                          border:       `1px solid ${project.rawColor}30`,
                          borderRadius: "2px",
                          background:   `${project.rawColor}08`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.link}
                    className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase mt-auto"
                    style={{ color: project.rawColor }}
                    data-cursor-hover
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget.querySelector(".arrow"), { x: 5, duration: 0.25, ease: "power2.out" });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget.querySelector(".arrow"), { x: 0, duration: 0.5, ease: "elastic.out(1.5, 0.4)" });
                    }}
                  >
                    <span>{t.projects.viewProject}</span>
                    <span className="arrow" style={{ display: "inline-block" }}>→</span>
                  </a>
                </div>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px z-20"
                  style={{ background: `linear-gradient(90deg, transparent, ${project.rawColor}60, transparent)` }}
                />
                </div>{/* end content wrapper */}
              </div>{/* end card-inner */}
            </div>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
