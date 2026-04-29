"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";

gsap.registerPlugin(ScrollTrigger);

const SKILL_GROUPS = [
  {
    category: "Core",
    color: "var(--color-cyan)",
    rawColor: "#00d4ff",
    skills: [
      { name: "TypeScript",     level: 95 },
      { name: "React / Next.js", level: 95 },
      { name: "CSS / Tailwind",  level: 90 },
      { name: "Node.js",         level: 75 },
    ],
  },
  {
    category: "Animation",
    color: "var(--color-purple)",
    rawColor: "#9d4edd",
    skills: [
      { name: "GSAP",           level: 90 },
      { name: "Framer Motion",  level: 85 },
      { name: "CSS Animations", level: 92 },
      { name: "Three.js / R3F", level: 60 },
    ],
  },
  {
    category: "Tooling",
    color: "#00ff87",
    rawColor: "#00ff87",
    skills: [
      { name: "Webpack / Vite", level: 85 },
      { name: "Docker",         level: 70 },
      { name: "CI/CD",          level: 75 },
      { name: "Figma",          level: 80 },
    ],
  },
];

const TECH_TAGS = [
  "React", "Next.js", "TypeScript", "Node.js", "GraphQL",
  "PostgreSQL", "Redis", "Docker", "AWS", "Figma",
  "GSAP", "Framer Motion", "Tailwind CSS", "Zustand", "React Query",
];

/**
 * Skills section — enhanced animation system.
 *
 * New interactions:
 * - Hovered card gets 3D tilt toward cursor.
 * - Sibling cards lean AWAY (neighbor repulsion): opposite rotationY + subtle x-push.
 * - On leave, all cards spring back with elastic damping.
 * - Progress bar dots are hidden (scale 0) until the bar fill reaches them,
 *   then they pop in with a spring bounce (elastic.out).
 * - Tech tags: on hover, neighbouring tags scatter slightly, hovered tag scales up.
 */
export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Scroll-triggered entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const trig = {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      };

      gsap.fromTo(
        ".skills-tag",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
      );

      gsap.fromTo(
        ".skills-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: trig }
      );

      // Cards entrance: expo.out (sharper deceleration than power3)
      gsap.fromTo(
        ".skill-group",
        { rotationY: -30, rotationX: 12, y: 70, opacity: 0, scale: 0.96 },
        {
          rotationY: 0,
          rotationX: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.0,
          stagger: 0.14,
          ease: "expo.out",
          scrollTrigger: { ...trig, start: "top 70%" },
        }
      );

      // Progress bars + dot pop
      sectionRef.current?.querySelectorAll<HTMLElement>(".skill-bar-fill").forEach((bar) => {
        const target = parseFloat(bar.dataset.level ?? "0") / 100;
        const dot = bar.parentElement?.querySelector<HTMLElement>(".skill-bar-dot");

        // Dot starts collapsed
        if (dot) gsap.set(dot, { scale: 0 });

        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: target,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            onComplete: () => {
              if (!dot) return;
              // Pop with spring: overshoot → settle
              gsap.fromTo(
                dot,
                { scale: 0 },
                { scale: 1, duration: 0.7, ease: "elastic.out(2.8, 0.45)" }
              );
            },
          }
        );
      });

      // Tech tags stagger pop
      gsap.fromTo(
        ".tech-tag",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: { each: 0.04, from: "random" },
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: ".tech-cloud",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Hover: tilt hovered card, repel siblings ── */
  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, hoveredIndex: number) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      const ry = ((e.clientX - rect.left) / rect.width  - 0.5) * -2;

      // Hovered card tilts toward cursor
      gsap.to(card, {
        rotationX: rx * 10,
        rotationY: ry * 10,
        scale: 1.02,
        duration: 0.28,
        ease: "power2.out",
        transformPerspective: 900,
        overwrite: "auto",
      });

      // Sibling cards lean away and slightly shrink (depth repulsion)
      const allCards = sectionRef.current?.querySelectorAll<HTMLElement>(".skill-group");
      allCards?.forEach((sibling, i) => {
        if (i === hoveredIndex) return;
        const direction = i < hoveredIndex ? -1 : 1; // lean away from hovered
        gsap.to(sibling, {
          rotationY: direction * 14,
          x:         direction * 10,
          scale:     0.97,
          duration:  0.35,
          ease:      "power2.out",
          transformPerspective: 900,
          overwrite: "auto",
        });
      });
    },
    []
  );

  const handleCardMouseLeave = useCallback(
    (_e: React.MouseEvent<HTMLDivElement>, _hoveredIndex: number) => {
      // Reset all cards (hovered + siblings) with staggered elastic spring
      const allCards = sectionRef.current?.querySelectorAll<HTMLElement>(".skill-group");
      allCards?.forEach((card, i) => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          x:         0,
          scale:     1,
          duration:  0.85,
          delay:     i * 0.04,
          ease:      "elastic.out(1.3, 0.42)",
          overwrite: "auto",
        });
      });
    },
    []
  );

  return (
    <section id="skills" ref={sectionRef}>
      <div className="section-wrap">
        <div className="skills-tag mb-4 opacity-0">
          <SectionTag index="02" label="Skills" />
        </div>

        <h2
          className="skills-heading opacity-0 font-bold mb-16"
          style={{ fontSize: "var(--text-h2)", color: "var(--color-ink)" }}
        >
          Технический стек
        </h2>

        {/* Skill groups */}
        <div
          className="grid md:grid-cols-3 gap-6 mb-20"
          style={{ perspective: "1200px" }}
        >
          {SKILL_GROUPS.map((group, groupIndex) => (
            <div
              key={group.category}
              className="skill-group opacity-0 glass-hi clip-corner p-6 noise"
              data-cursor-hover
              onMouseMove={(e) => handleCardMouseMove(e, groupIndex)}
              onMouseLeave={(e) => handleCardMouseLeave(e, groupIndex)}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{
                    background: group.color,
                    boxShadow: `0 0 10px ${group.rawColor}80`,
                  }}
                />
                <span
                  className="font-mono text-[12px] tracking-[0.2em] uppercase"
                  style={{ color: group.color }}
                >
                  {group.category}
                </span>
              </div>

              {/* Skill rows */}
              <div className="space-y-5">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-sans text-sm" style={{ color: "var(--color-ink-dim)" }}>
                        {skill.name}
                      </span>
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: group.color, opacity: 0.7 }}
                      >
                        {skill.level}%
                      </span>
                    </div>

                    {/* Bar track */}
                    <div
                      className="relative overflow-visible"
                      style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="skill-bar-fill absolute inset-y-0 left-0 right-0"
                        data-level={skill.level}
                        style={{
                          transformOrigin: "left center",
                          background: `linear-gradient(90deg, ${group.color}, ${group.rawColor}88)`,
                          boxShadow: `0 0 8px ${group.rawColor}55`,
                          height: "1px",
                        }}
                      />
                      {/* Dot — pops in via spring when bar fills */}
                      <div
                        className="skill-bar-dot absolute"
                        style={{
                          left: `${skill.level}%`,
                          top: "50%",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: group.color,
                          boxShadow: `0 0 12px ${group.rawColor}, 0 0 24px ${group.rawColor}60`,
                          transform: "translate(-50%, -50%) scale(0)",
                          transformOrigin: "center",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech tag cloud */}
        <div>
          <p
            className="font-mono text-[11px] tracking-[0.2em] uppercase mb-6"
            style={{ color: "var(--color-ink-faint)" }}
          >
            Also familiar with
          </p>
          <div className="tech-cloud flex flex-wrap gap-2">
            {TECH_TAGS.map((tag) => (
              <span
                key={tag}
                className="tech-tag font-mono text-[12px] px-3 py-1.5"
                data-cursor-hover
                style={{
                  color: "var(--color-ink-dim)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface)",
                  display: "inline-block",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-cyan)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)";
                  gsap.to(e.currentTarget, { scale: 1.1, y: -2, duration: 0.2, ease: "back.out(2)" });
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-ink-dim)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.35, ease: "elastic.out(1.5, 0.4)" });
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
