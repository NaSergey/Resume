"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";
import { MagneticButton } from "@/shared/ui/MagneticButton";
import { useLang } from "@/shared/providers/LangProvider";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_LINKS = [
  { label: "Email",    value: "wxtx.ns@gmail.com",    href: "mailto:wxtx.ns@gmail.com",      icon: "✉" },
  { label: "Telegram", value: "@Na_Sergey",            href: "https://t.me/Na_Sergey",        icon: "→" },
  { label: "GitHub",   value: "github.com/NaSergey",  href: "https://github.com/NaSergey",   icon: "⌥" },
];

export function Contact() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    const originalHTML = el?.innerHTML ?? "";

    // Split heading into word spans for stagger reveal
    if (el) {
      const words = (el.textContent ?? "").split(/\s+/).filter(Boolean);
      el.innerHTML = words
        .map((w) => `<span class="h-word" style="display:inline-block">${w}</span>`)
        .join(" ");
    }

    const ctx = gsap.context(() => {
      const trig = { trigger: sectionRef.current, start: "top 70%", once: true };

      gsap.fromTo(".contact-tag",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig }
      );

      // Word stagger — each word slides up and fades in
      if (el) {
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(".h-word",
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, delay: 0.05, ease: "power3.out", scrollTrigger: trig }
        );
      }

      gsap.fromTo(".contact-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power2.out", scrollTrigger: trig }
      );
      gsap.fromTo(".contact-row",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "back.out(1.4)", scrollTrigger: trig }
      );
      gsap.fromTo(".contact-cta",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, delay: 0.5, ease: "back.out(1.6)", scrollTrigger: trig }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      if (el) el.innerHTML = originalHTML;
    };
  }, []);

  return (
    <section id="contact" ref={sectionRef}>
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,212,255,0.06) 0%, transparent 60%)" }}
          aria-hidden
        />

        <div className="relative z-10 px-5 md:px-20 py-16 md:py-20 max-w-350 mx-auto">
          <div className="contact-tag mb-8 md:mb-12 opacity-0">
            <SectionTag index="05" label="Contact" />
          </div>

          <div className="max-w-3xl">
            <h2
              ref={headingRef}
              className="font-bold text-h2 text-ink mb-4 md:mb-6"
              style={{ lineHeight: 1.05, opacity: 0 }}
            >
              {t.contact.heading}
            </h2>

            <p
              className="contact-sub opacity-0 text-base md:text-lg mb-10 md:mb-16 max-w-xl text-ink-dim"
              style={{ lineHeight: 1.7 }}
            >
              {t.contact.subtitle}
            </p>

            <div className="space-y-1 mb-10 md:mb-16">
              {CONTACT_LINKS.map((link, i) => (
                <ContactRow key={link.label} link={link} index={i} />
              ))}
            </div>

            <div className="contact-cta opacity-0">
              <MagneticButton href="mailto:wxtx.ns@gmail.com" variant="primary" size="lg">
                <span>{t.contact.ctaLabel}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ link, index }: { link: typeof CONTACT_LINKS[0]; index: number }) {
  const rowRef   = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const iconRef  = useRef<HTMLSpanElement>(null);
  const lineRef  = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    gsap.to(labelRef.current, { x: 8,   duration: 0.3, ease: "power2.out" });
    gsap.to(iconRef.current,  { x: 6, opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(lineRef.current,  { scaleX: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(rowRef.current,   { borderColor: "rgba(0,212,255,0.2)", duration: 0.2 });
  };

  const handleLeave = () => {
    gsap.to(labelRef.current, { x: 0,   duration: 0.4, ease: "power2.out" });
    gsap.to(iconRef.current,  { x: 0, opacity: 0.3, duration: 0.4, ease: "power2.out" });
    gsap.to(lineRef.current,  { scaleX: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(rowRef.current,   { borderColor: "var(--color-border)", duration: 0.3 });
  };

  return (
    <a
      ref={rowRef}
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="contact-row opacity-0 flex items-center justify-between py-4 md:py-5 px-2 border-t relative group"
      style={{ borderColor: "var(--color-border)" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor-hover
    >
      <div
        ref={lineRef}
        className="absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{
          background: "linear-gradient(90deg, var(--color-cyan), var(--color-purple))",
          transform: "scaleX(0)",
        }}
      />

      <div className="flex items-center gap-4 md:gap-6">
        <span className="hidden md:block font-mono text-label tracking-widest uppercase w-20 shrink-0 text-ink-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-6">
          <span className="font-mono text-[10px] md:text-label tracking-widest uppercase shrink-0 md:w-20 text-ink-faint">
            {link.label}
          </span>
          <span ref={labelRef} className="font-sans text-sm md:text-xl text-ink">
            {link.value}
          </span>
        </div>
      </div>

      <span
        ref={iconRef}
        className="font-mono text-lg md:text-xl shrink-0 ml-2"
        style={{ color: "var(--color-cyan)", opacity: 0.3 }}
      >
        {link.icon}
      </span>
    </a>
  );
}
