"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SectionTag } from "@/shared/ui/SectionTag";
import { FlickerText } from "@/shared/ui/FlickerText";
import { SKILL_GROUPS, TECH_TAG_GROUPS } from "@/shared/data";
import { useLang } from "@/shared/providers/LangProvider";
import { useSkillsAnimation } from "./useSkillsAnimation";
import { useCardHover } from "./useCardHover";
import { SkillCard } from "./SkillCard";

export function Skills() {
  const { t } = useLang();
  const sectionRef    = useRef<HTMLElement>(null);
  const pinWrapRef    = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);

  useSkillsAnimation({ sectionRef, pinWrapRef, cardsTrackRef });
  const { handleCardMouseMove, handleCardMouseLeave } = useCardHover(sectionRef);

  return (
    <section id="skills" ref={sectionRef} className="relative z-1">
      <div
        ref={pinWrapRef}
        className="flex flex-col md:h-[calc(100vh-65px)] px-5 md:pb-0 pb-8 md:px-20 pt-2 md:pt-16 bg-bg relative z-10"
      >
        <div className="skills-tag mb-4 opacity-0">
          <SectionTag index="02" label="Skills" />
        </div>
        <h2 className="skills-heading opacity-0 font-bold mb-6 md:mb-10 text-h2 text-ink">
          {t.skills.heading}
        </h2>

        <div className=" md:overflow-visible mb-4 z-20 md:mb-10">
          <div
            ref={cardsTrackRef}
            className="flex gap-3 md:grid md:grid-cols-3 md:gap-6 perspective-distant"
          >
            {SKILL_GROUPS.map((group, groupIndex) => (
              <SkillCard
                key={group.category}
                group={group}
                groupIndex={groupIndex}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              />
            ))}
          </div>
        </div>

        <div className="flex md:hidden justify-center gap-2 mb-5">
          {SKILL_GROUPS.map((group, i) => (
            <div
              key={i}
              data-dot-index={i}
              className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "opacity-100" : "opacity-30"}`}
              style={{ background: group.rawColor }}
            />
          ))}
        </div>

        <div>
          <FlickerText className="font-mono text-xs tracking-[0.2em] uppercase mb-6">
            {t.skills.alsoWorks}
          </FlickerText>
          <div className="tech-cloud flex flex-wrap gap-2">
            {TECH_TAG_GROUPS.map((group) => (
              <div key={group.rawColor} className="contents">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tech-tag inline-block font-mono text-[12px] px-3 py-1.5 rounded-sm bg-surface"
                    data-cursor-hover
                    style={{
                      color: group.color,
                      border: `1px solid ${group.rawColor}4d`,
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
