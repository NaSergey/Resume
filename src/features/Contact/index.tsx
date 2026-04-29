"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SectionTag } from "@/shared/ui/SectionTag";
import { MagneticButton } from "@/shared/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_LINKS = [
  { label: "Email", value: "wxtx.ns@gmail.com", href: "mailto:wxtx.ns@gmail.com", icon: "✉" },
  { label: "Telegram", value: "@ns_dev", href: "https://t.me/ns_dev", icon: "→" },
  { label: "GitHub", value: "github.com/NaSergey", href: "https://github.com/NaSergey", icon: "⌥" },
  { label: "LinkedIn", value: "linkedin.com/in/ns", href: "#", icon: "⬡" },
];

/**
 * Contact section.
 *
 * Animations:
 * - Heading: glitch text effect on scroll enter
 * - Contact rows: stagger in from bottom with spring
 * - CTA button: magnetic (inherited from MagneticButton)
 * - Background: animated gradient mesh
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const glitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trig = {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      };

      gsap.fromTo(".contact-tag", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: trig });

      // Glitch heading on enter
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => triggerGlitch(),
      });

      // Heading fade in
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { ...trig, start: "top 70%" } }
      );

      // Sub text
      gsap.fromTo(
        ".contact-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: { ...trig, start: "top 68%" } }
      );

      // Links stagger
      gsap.fromTo(
        ".contact-row",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: { ...trig, start: "top 65%" },
        }
      );

      // CTA
      gsap.fromTo(
        ".contact-cta",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.6)",
          scrollTrigger: { ...trig, start: "top 60%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function triggerGlitch() {
    const el = headingRef.current;
    if (!el) return;

    const original = el.textContent ?? "";
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    let iterations = 0;

    glitchIntervalRef.current = setInterval(() => {
      el.textContent = original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < iterations) return original[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      iterations += 1.5;
      if (iterations >= original.length) {
        if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
        el.textContent = original;
      }
    }, 40);
  }

  return (
    <section id="contact" ref={sectionRef}>
      {/* Gradient background */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,212,255,0.06) 0%, transparent 60%)",
          }}
          aria-hidden
        />

        <div className="section-wrap relative z-10">
          <div className="contact-tag mb-12 opacity-0">
            <SectionTag index="05" label="Contact" />
          </div>

          <div className="max-w-3xl">
            {/* Heading with glitch */}
            <h2
              ref={headingRef}
              className="font-bold mb-6 opacity-0"
              style={{ fontSize: "var(--text-h2)", color: "var(--color-ink)", lineHeight: 1.05 }}
            >
              Готов к новым вызовам
            </h2>

            <p
              className="contact-sub opacity-0 text-lg mb-16 max-w-xl"
              style={{ color: "var(--color-ink-dim)", lineHeight: 1.7 }}
            >
              Открыт для интересных проектов, full-time позиций и коллабораций.
              Обычно отвечаю в течение 24 часов.
            </p>

            {/* Contact links */}
            <div className="space-y-1 mb-16">
              {CONTACT_LINKS.map((link, i) => (
                <ContactRow key={link.label} link={link} index={i} />
              ))}
            </div>

            {/* CTA */}
            <div className="contact-cta opacity-0">
              <MagneticButton href="mailto:wxtx.ns@gmail.com" variant="primary" size="lg">
                <span>Написать письмо</span>
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
  const rowRef = useRef<HTMLAnchorElement>(null);

  const handleEnter = () => {
    const el = rowRef.current;
    if (!el) return;
    gsap.to(el.querySelector(".row-label"), { x: 8, duration: 0.3, ease: "power2.out" });
    gsap.to(el.querySelector(".row-icon"), { x: 6, opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(el.querySelector(".row-line"), { scaleX: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(el, { borderColor: "rgba(0,212,255,0.2)", duration: 0.2 });
  };

  const handleLeave = () => {
    const el = rowRef.current;
    if (!el) return;
    gsap.to(el.querySelector(".row-label"), { x: 0, duration: 0.4, ease: "power2.out" });
    gsap.to(el.querySelector(".row-icon"), { x: 0, opacity: 0.3, duration: 0.4, ease: "power2.out" });
    gsap.to(el.querySelector(".row-line"), { scaleX: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(el, { borderColor: "var(--color-border)", duration: 0.3 });
  };

  return (
    <a
      ref={rowRef}
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="contact-row opacity-0 flex items-center justify-between py-5 px-2 border-t relative group"
      style={{ borderColor: "var(--color-border)" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor-hover
    >
      {/* Progress line on hover */}
      <div
        className="row-line absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{
          background: "linear-gradient(90deg, var(--color-cyan), var(--color-purple))",
          transform: "scaleX(0)",
        }}
      />

      <div className="flex items-center gap-6">
        <span
          className="font-mono text-[11px] tracking-widest uppercase w-20 flex-shrink-0"
          style={{ color: "var(--color-ink-faint)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className="font-mono text-[11px] tracking-widest uppercase flex-shrink-0"
          style={{ color: "var(--color-ink-faint)", width: "80px" }}
        >
          {link.label}
        </span>
        <span
          className="row-label font-sans text-base md:text-xl"
          style={{ color: "var(--color-ink)" }}
        >
          {link.value}
        </span>
      </div>

      <span
        className="row-icon font-mono text-xl"
        style={{ color: "var(--color-cyan)", opacity: 0.3 }}
      >
        {link.icon}
      </span>
    </a>
  );
}
