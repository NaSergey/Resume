"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";
import { FlickerText } from "@/shared/ui/FlickerText";
import { SKILL_GROUPS, TECH_TAG_GROUPS } from "@/shared/data";

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const sectionRef  = useRef<HTMLElement>(null);
  const pinWrapRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trig = {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      };

      // ── Entrance (fires before pin) ──
      gsap.fromTo(".skills-tag",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
      );
      gsap.fromTo(".skills-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: trig }
      );
      gsap.fromTo(".skill-group",
        { rotationY: -30, rotationX: 12, y: 70, opacity: 0, scale: 0.96 },
        {
          rotationY: 0, rotationX: 0, y: 0, opacity: 1, scale: 1,
          duration: 1.0, stagger: 0.14, ease: "expo.out",
          scrollTrigger: { ...trig, start: "top 75%" },
        }
      );

      // ── Scrubbed timeline: bars fill as you scroll ──
      const tl = gsap.timeline();

      sectionRef.current
        ?.querySelectorAll<HTMLElement>(".skill-group")
        .forEach((groupEl, gi) => {
          const bars   = groupEl.querySelectorAll<HTMLElement>(".skill-bar-fill");
          const labels = groupEl.querySelectorAll<HTMLElement>(".skill-level-label");

          bars.forEach((bar, bi) => {
            const target   = parseFloat(bar.dataset.level ?? "0") / 100;
            const levelNum = Math.round(target * 100);
            const dot      = bar.parentElement?.querySelector<HTMLElement>(".skill-bar-dot");
            const labelEl  = labels[bi] ?? null;
            const pos      = gi * 1.4 + bi * 0.12;
            const proxy    = { val: 0 };

            gsap.set(bar, { scaleX: 0 });
            if (dot) gsap.set(dot, { scale: 0 });

            // Bar fill — faster
            tl.fromTo(bar,
              { scaleX: 0 },
              { scaleX: target, duration: 0.7, ease: "power2.out" },
              pos
            );

            // Counter 0 → level
            tl.to(proxy,
              {
                val: levelNum,
                duration: 0.7,
                ease: "power2.out",
                onUpdate() {
                  if (labelEl) labelEl.textContent = `${Math.round(proxy.val)}%`;
                },
              },
              pos
            );

            if (dot) {
              tl.fromTo(dot,
                { scale: 0 },
                { scale: 1, duration: 0.2, ease: "back.out(2)" },
                pos + 0.65
              );
            }
          });
        });

      // Tech tags — slower
      sectionRef.current
        ?.querySelectorAll<HTMLElement>(".tech-tag")
        .forEach((tag) => {
          gsap.set(tag, { scale: 0, opacity: 0 });
          tl.fromTo(tag,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)" },
            ">-0.05"
          );
        });

      // ── Pin + scrub ──
      ScrollTrigger.create({
        trigger:             pinWrapRef.current,
        animation:           tl,
        start:               "top top",
        end:                 "+=200%",
        pin:                 true,
        pinType:             "transform",
        scrub:               1.5,
        invalidateOnRefresh: true,
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Hover: tilt hovered card, repel siblings ──
  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, hoveredIndex: number) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const rx   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      const ry   = ((e.clientX - rect.left) / rect.width  - 0.5) * -2;

      gsap.to(card, {
        rotationX: rx * 10, rotationY: ry * 10, scale: 1.02,
        duration: 0.28, ease: "power2.out", transformPerspective: 900, overwrite: "auto",
      });

      sectionRef.current?.querySelectorAll<HTMLElement>(".skill-group").forEach((sibling, i) => {
        if (i === hoveredIndex) return;
        const dir = i < hoveredIndex ? -1 : 1;
        gsap.to(sibling, {
          rotationY: dir * 14, x: dir * 10, scale: 0.97,
          duration: 0.35, ease: "power2.out", transformPerspective: 900, overwrite: "auto",
        });
      });
    },
    []
  );

  const handleCardMouseLeave = useCallback(
    (_e: React.MouseEvent<HTMLDivElement>, _hoveredIndex: number) => {
      sectionRef.current?.querySelectorAll<HTMLElement>(".skill-group").forEach((card, i) => {
        gsap.to(card, {
          rotationX: 0, rotationY: 0, x: 0, scale: 1,
          duration: 0.85, delay: i * 0.04, ease: "elastic.out(1.3, 0.42)", overwrite: "auto",
        });
      });
    },
    []
  );

  return (
    <section id="skills" ref={sectionRef}>
      <div
        ref={pinWrapRef}
        className="flex flex-col justify-center"
        style={{ height: "100vh", padding: "clamp(20px,6vw,80px)" }}
      >
        {/* Heading */}
        <div className="skills-tag mb-4 opacity-0">
          <SectionTag index="02" label="Skills" />
        </div>
        <h2
          className="skills-heading opacity-0 font-bold mb-10"
          style={{ fontSize: "var(--text-h2)", color: "var(--color-ink)" }}
        >
          Технический стек
        </h2>

        {/* Skill groups */}
        <div
          className="grid md:grid-cols-3 gap-6 mb-10"
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
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ background: group.color, boxShadow: `0 0 10px ${group.rawColor}80` }}
                />
                <span
                  className="font-mono text-[12px] tracking-[0.2em] uppercase"
                  style={{ color: group.color }}
                >
                  {group.category}
                </span>
              </div>

              <div className="space-y-5">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-sans text-sm" style={{ color: "var(--color-ink-dim)" }}>
                        {skill.name}
                      </span>
                      <span className="skill-level-label font-mono text-label" style={{ color: group.color, opacity: 0.7 }}>
                        0%
                      </span>
                    </div>
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
                      <div
                        className="skill-bar-dot absolute"
                        style={{
                          left: `${skill.level}%`,
                          top: "50%",
                          width: "8px", height: "8px",
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
          <FlickerText className="font-mono text-xs tracking-[0.2em] uppercase mb-6">
            I also work with
          </FlickerText>
          <div className="tech-cloud flex flex-wrap gap-2">
            {TECH_TAG_GROUPS.map((group) => (
              <div key={group.rawColor} className="contents">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tech-tag font-mono text-[12px] px-3 py-1.5"
                    data-cursor-hover
                    style={{
                      color: group.color,
                      border: `1px solid ${group.rawColor}4d`,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--color-surface)",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { scale: 1.1, y: -2, duration: 0.2, ease: "back.out(2)" });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.35, ease: "elastic.out(1.5, 0.4)" });
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
