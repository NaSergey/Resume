"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { scrollTo } from "@/shared/providers/LenisProvider";
import { LOCALE_COOKIE, locales, defaultLocale, type Locale } from "@/shared/config/i18n";

const marqueeItems = [
  "frontend engineer",
  "typescript · react · systems ui",
  "санкт-петербург / remote",
  "6+ years of shipping",
];

const navLinks = [
  { href: "#about", label: "Обо мне", n: "01" },
  { href: "#stack", label: "Стек", n: "02" },
  { href: "#experience", label: "Опыт", n: "03" },
  { href: "#portfolio", label: "Портфолио", n: "04" },
];

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const [lang, setLangState] = useState<Locale>(defaultLocale);
  const router = useRouter();

  useEffect(() => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
    const found = match?.[1];
    if (found && locales.includes(found as Locale)) setLangState(found as Locale);
  }, []);

  const switchLang = (l: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; SameSite=Lax`;
    setLangState(l);
    setOpen(false);
    router.refresh();
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-label="Switch language"
        className={cn(
          "flex items-center justify-center w-9 h-9 border rounded-full transition-colors duration-150",
          open ? "text-lime border-lime" : "text-site-muted border-site-line2 hover:text-lime hover:border-lime"
        )}
      >
        <GlobeIcon />
      </button>

      <div className={cn(
        "absolute right-0 top-full pt-2 z-50 transition-all duration-150",
        open ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"
      )}>
        <div className="flex flex-col py-1 border border-site-line2 rounded-xl bg-[rgba(13,13,15,0.96)] backdrop-blur-md overflow-hidden min-w-[68px]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={cn(
                "px-4 py-2 font-mono text-xs text-left transition-colors duration-100",
                lang === l
                  ? "text-lime"
                  : "text-site-muted hover:text-site-ink hover:bg-site-panel"
              )}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const repeated = [...marqueeItems, ...marqueeItems];
  return (
    <div className="overflow-hidden whitespace-nowrap border-b-2 border-black py-2.5 bg-lime text-black">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="mr-10 font-mono font-semibold text-[13px]">
            <span className="opacity-50">★ </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, []);

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    scrollTo(href);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-site-line bg-[rgba(13,13,15,0.82)] backdrop-blur-[10px] backdrop-saturate-[120%]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between gap-6">
        <a
          href="#top"
          onClick={(e) => handleNav(e, "#top")}
          className="font-semibold text-[17px] tracking-[-0.015em] flex items-center gap-2.5"
        >
          <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-lime dot-breathe" />
          Наумов С.
        </a>

        <ul className="hidden md:flex gap-1 items-center list-none">
          {navLinks.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleNav(e, l.href)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13.5px] transition-colors duration-150",
                    isActive ? "bg-lime text-black" : "text-site-muted hover:text-site-ink hover:bg-site-panel"
                  )}
                >
                  <span className={cn("font-mono text-[11px]", isActive ? "text-black/55" : "text-site-faint")}>
                    {l.n}
                  </span>
                  {l.label}
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
            className="flex items-center justify-center w-9 h-9 border border-site-line2 rounded-full text-site-muted transition-colors duration-150 hover:text-lime hover:border-lime"
          >
            <TelegramIcon />
          </a>
        </div>
      </div>
    </nav>
  );
}

export function Header() {
  return (
    <>
      <Marquee />
      <Nav />
    </>
  );
}
