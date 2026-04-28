"use client";

import { cn } from "@/shared/lib/utils";
import { SectionHead } from "./SectionHead";

const projects = [
  {
    slug: "flux-editor",
    name: "flux-editor",
    tag: "open source",
    tagOs: true,
    desc: "Лёгкий Markdown-редактор с live-preview и расширениями через плагины. ~40 контрибьюторов, используется в нескольких заметных npm-пакетах.",
    stack: "TypeScript · Lexical · Vite",
    href: "#",
    big: true,
    stat: "1.2k★",
    statLabel: "stars on github",
  },
  {
    slug: "latlon",
    name: "latlon",
    tag: "pet",
    tagOs: false,
    desc: "Визуализатор GPX-маршрутов с покадровой прокруткой высотного профиля. Canvas 2D + Web Workers для плавности на 10k+ точек.",
    stack: "React · Canvas · Workers",
    href: "#",
    big: false,
  },
  {
    slug: "formuly",
    name: "формулы.контур",
    tag: "work",
    tagOs: false,
    desc: "Редактор табличных формул с подсветкой зависимостей и отладкой шагов вычисления. ~40k пользователей ежедневно.",
    stack: "TypeScript · React · CodeMirror",
    href: null,
    big: false,
  },
  {
    slug: "dotfiles",
    name: "dotfiles",
    tag: "open source",
    tagOs: true,
    desc: "Конфиги Neovim, zsh, tmux и обвязка под Arch / macOS. Документированы построчно — можно читать как туториал.",
    stack: "Lua · Shell · Fish",
    href: "#",
    big: false,
    wide: true,
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-16 md:py-24 scroll-mt-[88px]">
      <SectionHead num="04" title="Избранные" em="проекты" note="selected · 4 items" />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {projects.map((p) => {
          const isWide = (p as { wide?: boolean }).wide;
          const colSpan = p.big || isWide ? "md:col-span-6" : "md:col-span-3";
          const Tag = p.href ? "a" : "div";
          const tagProps = p.href ? { href: p.href } : {};

          return (
            <Tag
              key={p.slug}
              {...tagProps}
              className={cn(
                "group flex rounded-2xl bg-site-panel transition-all duration-200 overflow-hidden",
                colSpan,
                p.big ? "md:flex-row md:items-stretch min-h-[220px]" : "flex-col gap-3.5 p-6 min-h-[260px]",
                "hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0_0_var(--color-lime)] hover:bg-site-panel2",
                p.href ? "cursor-pointer" : "cursor-default"
              )}
            >
              {p.big ? (
                <>
                  <div className="flex-1 flex flex-col gap-3.5 p-6 ">
                    <ProjHead name={p.name} tag={p.tag} tagOs={p.tagOs} />
                    <p className="text-[14.5px] leading-[1.55] flex-1 text-subtle">{p.desc}</p>
                    <ProjFoot stack={p.stack} arrow={!!p.href} />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center flex-none w-[280px] p-6 bg-lime text-black">
                    <div className="text-[64px] font-semibold tracking-[-0.04em] leading-none">
                      {(p as { stat?: string }).stat}
                    </div>
                    <div className="mt-2 font-mono text-[11px] tracking-[0.1em] uppercase">
                      {(p as { statLabel?: string }).statLabel}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <ProjHead name={p.name} tag={p.tag} tagOs={p.tagOs} />
                  <p className="text-[14.5px] leading-[1.55] flex-1 text-subtle">{p.desc}</p>
                  <ProjFoot stack={p.stack} arrow={!!p.href} />
                </>
              )}
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

function ProjHead({ name, tag, tagOs }: { name: string; tag: string; tagOs: boolean }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-[22px] font-medium tracking-[-0.015em]">
        <span className="text-site-muted">~/</span>{name}
      </span>
      <span className={cn(
        "font-mono text-[10.5px] px-2.5 py-[3px] rounded-full border tracking-[0.04em] uppercase",
        tagOs ? "bg-lime text-black border-lime" : "text-site-muted border-site-line2"
      )}>
        {tag}
      </span>
    </div>
  );
}

function ProjFoot({ stack, arrow }: { stack: string; arrow: boolean }) {
  return (
    <div className="flex justify-between items-center pt-2.5 border-t border-site-line2 font-mono text-[11px] text-site-muted">
      <span>{stack}</span>
      <span className={cn("text-lg transition-transform duration-200 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]", arrow ? "text-lime" : "opacity-30")}>
        {arrow ? "↗" : "—"}
      </span>
    </div>
  );
}
