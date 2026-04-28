import { SectionHead } from "./SectionHead";

export function About() {
  return (
    <section id="about" className="site-section">
      <SectionHead num="01" title="Обо" em="мне" note="// intro.md" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_1fr] md:gap-[60px] items-start">
        <div
          data-gsap-fade=""
          className="text-[26px] leading-[1.2] tracking-[-0.02em] font-normal md:text-[32px]"
        >
          Проектирую интерфейсы там, где обычный React-буклет ломается.{" "}
          <span className="px-1 bg-lime text-black">Производительность и доступность</span>{" "}
          — для меня часть продукта, а не чек-лист.
        </div>

        <div
          data-gsap-fade=""
          data-gsap-delay="0.12"
          className="flex flex-col gap-3.5"
        >
          <p className="leading-[1.65] text-subtle">
            Шесть лет собираю веб: от клиентских лендингов в студии до{" "}
            <b className="font-semibold text-site-ink">ядра B2B-продукта на 40k пользователей</b>.
            Не боюсь сложных доменов — таблицы, редакторы формул, drag-and-drop, интерактивные визуализации на Canvas.
          </p>
          <p className="leading-[1.65] text-subtle">
            Веду наставничество:{" "}
            <b className="font-semibold text-site-ink">200+ код-ревью</b>,
            внутренние воркшопы по TypeScript и архитектуре состояний. В нерабочее время — open source и чрезмерно вылизанные dotfiles.
          </p>
        </div>
      </div>
    </section>
  );
}
