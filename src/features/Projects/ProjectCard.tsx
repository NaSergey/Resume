"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/shared/data";
import { useLang } from "@/shared/providers/LangProvider";

const LAYERS = [
  { key: "back",  mult: 0.10 },
  { key: "mid",   mult: 0.22 },
  { key: "front", mult: 0.38 },
] as const;

type LayerKey = typeof LAYERS[number]["key"];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

interface Props {
  project: Project;
  onOpen: (p: Project) => void;
}

export function ProjectCard({ project, onOpen }: Props) {
  const { t } = useLang();

  const cardRef   = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const numRef    = useRef<HTMLSpanElement>(null);
  const orbRef    = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Record<LayerKey, HTMLDivElement | null>>({ back: null, mid: null, front: null });

  useEffect(() => {
    const numEl = numRef.current;
    const card  = cardRef.current;
    if (!numEl || !card) return;
    const original = numEl.textContent ?? "";

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      let iter = 0;
      const id = setInterval(() => {
        numEl.textContent = original
          .split("")
          .map((ch, i) => (i < iter || ch === " " ? ch : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]))
          .join("");
        iter += 0.8;
        if (iter >= original.length) { clearInterval(id); numEl.textContent = original; }
      }, 35);
    }, { threshold: 0.3 });

    io.observe(card);
    return () => io.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const inner = innerRef.current;
    if (!inner) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    const ry = ((e.clientX - rect.left) / rect.width  - 0.5) * -2;
    const cx = e.clientX - rect.left - rect.width  / 2;
    const cy = e.clientY - rect.top  - rect.height / 2;

    gsap.to(inner, {
      rotationX: rx * 12, rotationY: ry * 12,
      duration: 0.28, ease: "power2.out",
      transformPerspective: 900, overwrite: "auto",
    });

    LAYERS.forEach(({ key, mult }) => {
      const el = layerRefs.current[key];
      if (el) gsap.to(el, { x: cx * mult, y: cy * mult, duration: 0.32, ease: "power2.out", overwrite: "auto" });
    });

    const orb = orbRef.current;
    if (orb) gsap.to(orb, { x: cx * 0.45, y: cy * 0.45, duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;

    gsap.to(inner, { rotationX: 0, rotationY: 0, duration: 0.9, ease: "elastic.out(1.25, 0.42)", overwrite: "auto" });
    LAYERS.forEach(({ key }) => {
      const el = layerRefs.current[key];
      if (el) gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1.2, 0.4)" });
    });
    const orb = orbRef.current;
    if (orb) gsap.to(orb, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1.2, 0.4)" });
  };

  return (
    <div
      ref={cardRef}
      className="proj-card flex-shrink-0 opacity-0 w-[clamp(240px,26vw,360px)] h-full perspective-[1100px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
      data-cursor-hover
    >
      <div
        ref={innerRef}
        className="card-inner h-full relative"
        style={{ borderRadius: "4px", willChange: "transform" }}
      >
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
          <div
            ref={orbRef}
            className="card-orb absolute w-56 h-56 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${project.rawColor}18 0%, transparent 70%)`,
              top: "10%", left: "10%",
            }}
          />

          <div ref={(el) => { layerRefs.current.back = el; }} className="layer-back relative z-10">
            <div className="flex items-center justify-between">
              <span
                ref={numRef}
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

          <div ref={(el) => { layerRefs.current.mid = el; }} className="layer-mid relative z-10">
            <p className="font-mono text-label tracking-widest uppercase mb-3" style={{ color: "var(--color-ink-faint)" }}>
              {project.category}
            </p>
            <h3 className="font-bold leading-tight mb-4" style={{ fontSize: "var(--text-h3)", color: "var(--color-ink)" }}>
              {project.title}
            </h3>
          </div>

          <div ref={(el) => { layerRefs.current.front = el; }} className="layer-front relative z-10 flex flex-col">
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-ink-dim)" }}>
              {t.projects.descs[project.id as keyof typeof t.projects.descs] ?? project.desc}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[10px] tracking-wider px-2 py-1"
                  style={{
                    color: project.rawColor,
                    border: `1px solid ${project.rawColor}30`,
                    borderRadius: "2px",
                    background: `${project.rawColor}08`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <ProjectLink href={project.link} color={project.rawColor} label={t.projects.viewProject} />
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-px z-20"
            style={{ background: `linear-gradient(90deg, transparent, ${project.rawColor}60, transparent)` }}
          />
        </div>
      </div>
    </div>
  );
}

function ProjectLink({ href, color, label }: { href: string; color: string; label: string }) {
  const arrowRef = useRef<HTMLSpanElement>(null);
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase mt-auto"
      style={{ color }}
      data-cursor-hover
      onMouseEnter={() => { if (arrowRef.current) gsap.to(arrowRef.current, { x: 5, duration: 0.25, ease: "power2.out" }); }}
      onMouseLeave={() => { if (arrowRef.current) gsap.to(arrowRef.current, { x: 0, duration: 0.5, ease: "elastic.out(1.5, 0.4)" }); }}
    >
      <span>{label}</span>
      <span ref={arrowRef} style={{ display: "inline-block" }}>→</span>
    </a>
  );
}
