"use client";

import { useLang } from "@/shared/providers/LangProvider";
import { SOCIAL_LINKS } from "@/shared/data";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="max-w-[1200px] mx-auto w-full px-5 md:px-8 py-12 flex flex-wrap justify-between items-center gap-5 text-xs font-mono text-site-muted ink-border-t">
      <span>★ Last update 04.2026</span>
      <div className="flex gap-[18px]">
        {SOCIAL_LINKS.map((l) => (
          <a key={l.label} href={l.href} className="transition-colors duration-150 hover:text-lime">
            {l.label}
          </a>
        ))}
      </div>
      <span>© 2026 {t.footer.copy}</span>
    </footer>
  );
}
