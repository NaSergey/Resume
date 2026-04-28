"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { SectionHead } from "./SectionHead";

interface Job {
  period: string;
  dur: string;
  title: string;
  org: string;
  body: string;
  bullets: string[];
  tags: string[];
}

const jobs: Job[] = [
  {
    period: "Март 2022 — Сентябрь 2022",
    dur: "6 месяцев",
    title: "Фриланс: создание сайтов",
    org: "Self-employed",
    body: "Разрабатывал сайты на Bootstrap с адаптивной вёрсткой. Постепенно начал работать с заказами, включающими JavaScript и PHP.",
    bullets: ["Начал изучать взаимодействие клиентской части с сервером."],
    tags: ["HTML/CSS", "Bootstrap", "JS", "PHP"],
  },
  {
    period: "Октябрь 2022 — Май 2023",
    dur: "8 месяцев",
    title: "Junior Frontend Developer",
    org: "Компания / Placeholder",
    body: "Первое коммерческое знакомство с React и компонентным подходом.",
    bullets: ["Вёрстка по Figma, интеграция с REST API."],
    tags: ["React", "JavaScript", "SCSS"],
  },
  {
    period: "Июнь 2023 — Февраль 2024",
    dur: "9 месяцев",
    title: "Frontend Developer",
    org: "Placeholder Studio",
    body: "Небольшие SPA и клиентские лендинги. Постепенно перешёл на TypeScript.",
    bullets: [
      "Впервые взялся за поддержку легаси-кодовой базы.",
      "Начал писать тесты — Vitest + Testing Library.",
    ],
    tags: ["React", "TypeScript", "Vite"],
  },
  {
    period: "Март 2024 — Октябрь 2024",
    dur: "8 месяцев",
    title: "Middle Frontend Developer",
    org: "Placeholder Digital",
    body: "Участвовал в продуктовой команде из 5 фронтенд-разработчиков.",
    bullets: [
      "Внедрил дизайн-систему на базе Radix Primitives.",
      "Разобрался с Redux Toolkit и RTK Query.",
    ],
    tags: ["React", "TypeScript", "Redux Toolkit", "Radix"],
  },
  {
    period: "Ноябрь 2024 — Май 2025",
    dur: "7 месяцев",
    title: "Middle Frontend Developer",
    org: "Dodo Brands",
    body: "Миграция админки франчайзи с AngularJS на React — 60+ экранов.",
    bullets: [
      "Выстроил e2e-тестирование критических флоу оформления заказа.",
      "Ускорил bundle build в 3× через Turborepo-кэш.",
    ],
    tags: ["React", "TypeScript", "Cypress", "Turborepo"],
  },
  {
    period: "Июнь 2025 — Декабрь 2025",
    dur: "7 месяцев",
    title: "Senior Frontend Engineer",
    org: "Placeholder Lab",
    body: "Переход на сеньорную позицию. Работал над core-редактором.",
    bullets: [
      "Спроектировал модуль drag-and-drop на основе Pointer Events API.",
      "Менторил junior-разработчиков, проводил архитектурные ревью.",
    ],
    tags: ["TypeScript", "React", "MobX", "Playwright"],
  },
  {
    period: "Январь 2026 — н.в.",
    dur: "current",
    title: "Senior Frontend Engineer",
    org: "Контур",
    body: "Развиваю ядро конструктора отчётов: редактор формул, drag-and-drop таблицы, live-preview.",
    bullets: [
      "Сократил время холодной загрузки на 38% (code-splitting + критический CSS).",
      "Менторю двух junior-разработчиков, веду еженедельные архитектурные ревью.",
    ],
    tags: ["TypeScript", "React 18", "MobX", "Vite"],
  },
];

const STEP = 3;

const delayClass = ["", "job-delay-1", "job-delay-2"] as const;

export function Experience() {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(STEP);
  const [collapsingSet, setCollapsingSet] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const showMore = () => setVisible((v) => Math.min(v + STEP, jobs.length));
  const collapse = () => {
    const toCollapse = new Set<number>();
    for (let i = STEP; i < visible; i++) toCollapse.add(i);
    setCollapsingSet(toCollapse);
    setOpenSet((prev) => {
      const next = new Set(prev);
      for (let i = STEP; i < jobs.length; i++) next.delete(i);
      return next;
    });
    setTimeout(() => {
      setVisible(STEP);
      setCollapsingSet(new Set());
    }, 420);
  };
  const hasMore = visible < jobs.length;

  return (
    <section id="experience" className="site-section">
      <SectionHead num="03" title="Опыт" em="работы" note={`${jobs.length} entries · click to expand`} />

      <div>
        {jobs.slice(0, visible).map((job, i) => {
          const isOpen = openSet.has(i);
          const isLast = i === visible - 1 && !hasMore;
          return (
            <div
              key={i}
              className={cn("job-entry", delayClass[i % STEP], collapsingSet.has(i) && "collapsing")}
            >
            <article
              className={cn(
                "job-entry-inner transition-colors duration-200",
                i === 0 ? "ink-border-t" : "border-t border-site-line",
                isLast ? "ink-border-b" : "",
                isOpen ? "bg-lime/[0.035]" : ""
              )}
            >
              <div className="grid grid-cols-[120px_1fr_30px] md:grid-cols-[220px_1fr_40px] gap-4 md:gap-7 items-start">
                {/* Period */}
                <div className="relative flex flex-col gap-1 pt-5 pb-5 pl-4 md:pl-6 font-mono text-[11.5px] md:text-[13px] text-lime">
                  <span className="absolute left-1.5 top-[25px] w-2 h-2 rounded-full bg-lime shadow-[0_0_0_3px_rgba(215,255,58,0.15)]" />
                  {job.period}
                  <span className="text-[11px] tracking-[0.04em] text-site-muted">{job.dur}</span>
                </div>

                {/* Head */}
                <button className="flex flex-col pt-[22px] pb-[22px] text-left w-full" onClick={() => toggle(i)}>
                  <h3 className={cn("text-lg font-medium tracking-[-0.02em] leading-snug transition-colors duration-150 md:text-2xl", isOpen ? "text-lime" : "text-site-ink")}>
                    {job.title}
                  </h3>
                  <div className={cn(
                    "font-serif-it italic text-base md:text-lg text-site-muted overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-8 opacity-100 mt-1.5" : "max-h-0 opacity-0 mt-0"
                  )}>
                    — {job.org}
                  </div>
                </button>

                {/* Toggle */}
                <button
                  className={cn(
                    "flex justify-end items-start pt-7 font-mono text-xl transition-all duration-200",
                    isOpen ? "text-lime rotate-45" : "text-site-muted"
                  )}
                  onClick={() => toggle(i)}
                >
                  +
                </button>
              </div>

              <div className={`tl-body ${isOpen ? "open" : ""}`}>
                <div className="max-w-[780px] pt-1 pb-1 pl-6 border-l border-site-line2">
                  <p className="text-[15.5px] leading-[1.65] mb-3.5 text-subtle">{job.body}</p>
                  <ul className="mb-4 list-none flex flex-col gap-1.5">
                    {job.bullets.map((b, j) => (
                      <li key={j} className="relative pl-[22px] text-[15px] leading-[1.6] text-subtle">
                        <span className="absolute left-0 font-bold text-lime">→</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((t) => (
                      <span key={t} className="font-mono text-[11.5px] px-2.5 py-1 rounded-full border border-site-line2 bg-site-panel text-dim transition-colors duration-150 hover:bg-lime hover:border-lime hover:text-black">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-2.5">
        {hasMore && (
          <button
            onClick={showMore}
            className="flex-1 py-3 border border-site-line2 rounded-full font-mono text-xs text-site-muted transition-colors duration-150 hover:text-lime hover:border-lime"
          >
            [ + ] показать ещё ({jobs.length - visible} из {jobs.length})
          </button>
        )}
        {!hasMore && visible > STEP && (
          <button
            onClick={collapse}
            className="flex-1 py-3 border border-site-line2 rounded-full font-mono text-xs text-site-muted transition-colors duration-150 hover:text-lime hover:border-lime"
          >
            [ − ] свернуть
          </button>
        )}
      </div>
    </section>
  );
}
