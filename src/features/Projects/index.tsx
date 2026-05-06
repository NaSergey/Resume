"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";
import { MagneticButton } from "@/shared/ui/MagneticButton";
import { ProjectModal } from "./ProjectModal";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS, type Project } from "@/shared/data";
import { useLang } from "@/shared/providers/LangProvider";
import { createMobileSlider } from "@/shared/lib/createMobileSlider";
import { SliderDots } from "@/shared/ui/SliderDots";

export function Projects() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    PROJECTS.forEach(({ images, video }) => {
      images.forEach((src) => { new Image().src = src; });
      const link = document.createElement("link");
      link.rel = "preload"; link.as = "video"; link.href = video;
      document.head.appendChild(link);
      links.push(link);
    });
    return () => { links.forEach((l) => l.remove()); };
  }, []);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const trig = { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" };

      gsap.fromTo(".proj-tag",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
      );
      gsap.fromTo(".proj-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: trig }
      );

      if (isMobile) {
        const track   = trackRef.current;
        const pinWrap = pinWrapRef.current;
        if (!track || !pinWrap) return;

        gsap.set(".proj-card", { opacity: 1 });

        createMobileSlider({
          track,
          pinWrap,
          sectionRoot:  sectionRef.current,
          itemSelector: ".proj-card",
          gap:          16,
        });

        return;
      }

      // Desktop: horizontal scroll + velocity tilt
      const track   = trackRef.current;
      const pinWrap = pinWrapRef.current;
      if (!track || !pinWrap) return;

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);
      let cachedScrollAmount = getScrollAmount();

      const inners = Array.from(track.querySelectorAll<HTMLElement>(".card-inner"));
      let lastProgress = 0, smoothVel = 0, springBackTimer = 0;

      const quickTilts = inners.map((el) =>
        gsap.quickTo(el, "rotationY", { duration: 0.25, ease: "power2.out" })
      );

      const springBackCards = () => {
        gsap.to(inners, { rotationY: 0, duration: 1.0, ease: "elastic.out(1.3, 0.45)", overwrite: "auto" });
      };

      const hST = ScrollTrigger.create({
        trigger: pinWrap,
        start: "top 65px",
        end: () => {
          cachedScrollAmount = getScrollAmount();
          return `+=${Math.abs(cachedScrollAmount) + window.innerHeight - 65}`;
        },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,

        onUpdate: (self) => {
          gsap.set(track, { x: cachedScrollAmount * self.progress });

          const delta = self.progress - lastProgress;
          lastProgress = self.progress;
          smoothVel = smoothVel * 0.55 + delta * 0.45;

          const tiltDeg = Math.max(-18, Math.min(18, smoothVel * -1400));
          quickTilts.forEach((qt) => qt(tiltDeg));

          clearTimeout(springBackTimer);
          springBackTimer = window.setTimeout(() => {
            if (Math.abs(smoothVel) < 0.0008) springBackCards();
          }, 80);
        },

        onLeave:     springBackCards,
        onLeaveBack: springBackCards,
      });

      gsap.fromTo(".proj-card",
        { clipPath: "inset(100% 0 0 0)", opacity: 0 },
        {
          clipPath: "inset(0% 0 0 0)", opacity: 1,
          duration: 0.9, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { ...trig, start: "top 70%", once: true },
          onComplete() { gsap.set(".proj-card", { clearProps: "clipPath" }); },
        }
      );

      return () => { hST.kill(); clearTimeout(springBackTimer); };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="bg-bg isolate">
      <div ref={pinWrapRef} className="flex flex-col md:h-[calc(100vh-65px)]">
        <div className="shrink-0 pt-9 px-5 pb-4 md:pt-10 md:px-20">
          <div className="proj-tag opacity-0">
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

        <div className="overflow-hidden md:overflow-visible">
          <div
            ref={trackRef}
            className="flex md:flex-row md:items-center shrink-0 px-5 md:px-20 gap-4 md:gap-6 py-4 h-105 md:h-[clamp(440px,62vh,600px)]"
          >
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={setActive} />
            ))}
          </div>
        </div>
        <SliderDots items={PROJECTS} className="pb-4" />
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
