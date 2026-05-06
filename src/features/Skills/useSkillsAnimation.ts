"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { createMobileSlider } from "@/shared/lib/createMobileSlider";

gsap.registerPlugin(ScrollTrigger);

interface SkillsRefs {
  sectionRef:    React.RefObject<HTMLElement | null>;
  pinWrapRef:    React.RefObject<HTMLDivElement | null>;
  cardsTrackRef: React.RefObject<HTMLDivElement | null>;
}

function addGroupBars(
  tl: gsap.core.Timeline,
  groupEl: HTMLElement,
  basePos: number,
  opts?: { dur?: number; step?: number; dotDelay?: number; dotDur?: number }
) {
  const dur      = opts?.dur      ?? 0.7;
  const step     = opts?.step     ?? 0.12;
  const dotDelay = opts?.dotDelay ?? 0.65;
  const dotDur   = opts?.dotDur   ?? 0.2;

  const bars   = groupEl.querySelectorAll<HTMLElement>(".skill-bar-fill");
  const labels = groupEl.querySelectorAll<HTMLElement>(".skill-level-label");

  bars.forEach((bar, bi) => {
    const target   = parseFloat(bar.dataset.level ?? "0") / 100;
    const levelNum = Math.round(target * 100);
    const dot      = bar.parentElement?.querySelector<HTMLElement>(".skill-bar-dot");
    const labelEl  = labels[bi] ?? null;
    const pos      = basePos + bi * step;

    gsap.set(bar, { scaleX: 0 });
    if (dot) gsap.set(dot, { scale: 0 });

    tl.fromTo(bar,
      { scaleX: 0 },
      {
        scaleX: target, duration: dur, ease: "power2.out",
        onUpdate() {
          if (labelEl) {
            const current = gsap.getProperty(bar, "scaleX") as number;
            labelEl.textContent = `${Math.round((current / (target || 1)) * levelNum)}%`;
          }
        },
      },
      pos
    );
    if (dot) {
      tl.fromTo(dot,
        { scale: 0 },
        { scale: 1, duration: dotDur, ease: "back.out(2)" },
        pos + dotDelay
      );
    }
  });
}


export function useSkillsAnimation({ sectionRef, pinWrapRef, cardsTrackRef }: SkillsRefs) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const trig = {
          trigger: sectionRef.current,

          start: "top 80%",
          toggleActions: "play none none none",
        };

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

        const tl = gsap.timeline();

        sectionRef.current
          ?.querySelectorAll<HTMLElement>(".skill-group")
          .forEach((groupEl, gi) => {
            addGroupBars(tl, groupEl, gi * 1.4, { dur: 0.7, step: 0.12, dotDelay: 0.65, dotDur: 0.2 });
          });

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

        ScrollTrigger.create({
          trigger:             pinWrapRef.current,

          animation:           tl,
          start:               "top 65px",
          end:                 "+=200%",
          pin:                 true,

          scrub:               1.5,
          invalidateOnRefresh: true,
        });

      });

      mm.add("(max-width: 767px)", () => {
        const trig = {
          trigger: sectionRef.current,

          start: "top 80%",
          toggleActions: "play none none none",
        };

        gsap.fromTo(".skills-tag",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", scrollTrigger: trig }
        );
        gsap.fromTo(".skills-heading",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
        );
        gsap.fromTo(".skill-group",
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.6, stagger: 0.0, ease: "power2.out",
            scrollTrigger: { ...trig, start: "top 72%" },
          }
        );

        const track   = cardsTrackRef.current;
        const pinWrap = pinWrapRef.current;
        if (!track || !pinWrap) return;

        const mOpts = { dur: 0.5, step: 0.1, dotDelay: 0.45, dotDur: 0.18 };

        createMobileSlider({
          track,
          pinWrap,
          sectionRoot:  sectionRef.current,
          itemSelector: ".skill-group",
          gap:          12,
          end:          "+=250%",
          buildTimeline: (tl, cards, advanceTo) => {
            if (cards.length < 3) return;
            addGroupBars(tl, cards[0], 0.1, mOpts);
            advanceTo(1, 1.2);
            addGroupBars(tl, cards[1], 1.7, mOpts);
            advanceTo(2, 2.7);
            addGroupBars(tl, cards[2], 3.2, mOpts);
          },
        });

      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);
}
