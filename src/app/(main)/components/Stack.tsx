import { SectionHead } from "./SectionHead";

const cells = [
  { cat: "Языки", tags: ["TypeScript", "JavaScript", "HTML", "CSS", "Python"] },
  { cat: "Фреймворки", tags: ["React", "Next.js", "Remix", "Vue 3"] },
  { cat: "Состояние / данные", tags: ["MobX", "Redux Toolkit", "Zustand", "TanStack Query"] },
  { cat: "Тулинг", tags: ["Vite", "Webpack", "Turborepo", "Git", "Figma"] },
  { cat: "Тестирование", tags: ["Vitest", "Playwright", "Cypress", "Testing Library"] },
  { cat: "Языки общения", tags: ["RU · native", "EN · B2", "DE · A2"] },
];

export function Stack() {
  return (
    <section id="stack" className="site-section">
      <SectionHead num="02" title="Стек" em="и инструменты" note="// tools of trade" />

      <div data-gsap-stagger="" className="grid grid-cols-1 md:grid-cols-3 ink-border">
        {cells.map((cell) => (
          <div key={cell.cat} className="stack-cell flex flex-col gap-3.5 p-6 min-h-[180px] ink-border-r ink-border-b">
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-lime">
              <span className="w-1.5 h-1.5 rounded-full bg-lime flex-shrink-0" />
              {cell.cat}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cell.tags.map((t) => (
                <span key={t} className="font-mono text-[11.5px] px-2.5 py-1 rounded-full border border-site-line2 bg-site-panel text-dim transition-colors duration-150 hover:bg-lime hover:border-lime hover:text-black">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
