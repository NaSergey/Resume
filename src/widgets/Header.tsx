"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { scrollTo } from "@/shared/providers/LenisProvider";
import { useLang } from "@/shared/providers/LangProvider";
import { locales } from "@/shared/config/i18n";
import { AnimatedSlashIcon } from "@/shared/ui/AnimatedSlashIcon";

const navHrefs = [
  { href: "#about",      key: "about",      n: "01" },
  { href: "#skills",     key: "skills",     n: "02" },
  { href: "#experience", key: "experience", n: "03" },
  { href: "#projects",   key: "projects",   n: "04" },
] as const;

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function LangSwitcher() {
  const { lang, setLang } = useLang();

  const cycle = () => {
    const next = locales[(locales.indexOf(lang) + 1) % locales.length];
    setLang(next);
  };

  return (
    <button
      onClick={cycle}
      aria-label="Switch language"
      className="flex items-center justify-center w-9 h-9 border border-[rgba(99,102,241,0.2)] rounded-full font-mono text-xs text-ink-dim transition-all duration-200 hover:text-cyan hover:border-cyan hover:scale-110 hover:shadow-[0_0_14px_rgba(0,212,255,0.3)] hover:bg-[rgba(0,212,255,0.06)]"
    >
      {lang.toUpperCase()}
    </button>
  );
}

function Nav() {
  const { t, lang } = useLang();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const ulRef = useRef<HTMLUListElement>(null);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0, opacity: 0 });

  useEffect(() => {
    const idx = navHrefs.findIndex((l) => l.href === active);
    if (idx === -1 || !ulRef.current || !liRefs.current[idx]) {
      setPill((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const a = liRefs.current[idx]!.querySelector("a");
    if (!a) return;
    const aRect = a.getBoundingClientRect();
    const ulRect = ulRef.current.getBoundingClientRect();
    setPill({ x: aRect.left - ulRect.left, y: aRect.top - ulRect.top, w: aRect.width, h: aRect.height, opacity: 1 });
  }, [active, lang]);

  useEffect(() => {
    const threshold = window.innerHeight * 0.35;

    const update = () => {
      const hit = [...navHrefs].reverse().find((l) => {
        const el = document.querySelector(l.href);
        if (!el) return false;
        return el.getBoundingClientRect().top <= threshold;
      });
      setActive(hit ? hit.href : "");
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    scrollTo(href);
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500",
        scrolled
          ? "bg-[rgba(4,4,11,0.82)] backdrop-blur-sm backdrop-saturate-180 shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
          : "bg-[rgba(4,4,11,0.2)] backdrop-blur-md"
      )}
    >
      <div className="max-w-350 mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between gap-6">
        <a
          href="#hero"
          onClick={(e) => handleNav(e, "#hero")}
          className="font-semibold text-[17px] tracking-[-0.015em] flex items-center gap-2 transition-all duration-200 hover:text-cyan group"
        >
          <AnimatedSlashIcon className="opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
          {t.logo}
        </a>

        <ul ref={ulRef} className="hidden md:flex gap-0.5 items-center list-none relative">
          <span
            aria-hidden
            className="absolute rounded-full pointer-events-none bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.22)] shadow-[0_0_14px_rgba(0,212,255,0.1)]"
            style={{
              left: pill.x,
              top: pill.y,
              width: pill.w,
              height: pill.h,
              opacity: pill.opacity,
              transition:
                "left 0.55s cubic-bezier(0.34,1.56,0.64,1), width 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
            }}
          />

          {navHrefs.map((l, i) => {
            const isActive = active === l.href;
            return (
              <li key={l.href} ref={(el) => { liRefs.current[i] = el; }}>
                <a
                  href={l.href}
                  onClick={(e) => handleNav(e, l.href)}
                  className={cn(
                    "relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13.5px] transition-colors duration-150",
                    isActive
                      ? "text-cyan"
                      : "text-ink-dim hover:text-ink hover:bg-[rgba(255,255,255,0.04)]"
                  )}
                >
                  <span className={cn("font-mono text-label", isActive ? "text-cyan/70" : "text-ink-faint")}>
                    {l.n}
                  </span>
                  {t.nav[l.key]}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <a
            href="https://t.me/username"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="flex items-center justify-center w-9 h-9 border border-[rgba(99,102,241,0.2)] rounded-full text-ink-dim transition-all duration-200 hover:text-cyan hover:border-cyan hover:scale-110 hover:shadow-[0_0_14px_rgba(0,212,255,0.3)] hover:bg-[rgba(0,212,255,0.06)]"
          >
            <TelegramIcon />
          </a>
        </div>
      </div>
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--color-border-hi), transparent)" }} />
    </nav>
  );
}

export function Header() {
  return <Nav />;
}
