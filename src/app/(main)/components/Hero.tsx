const meta = [
  { k: "location", v: "Санкт-Петербург", accent: true },
  { k: "experience", v: "6+ лет", accent: false },
  { k: "specialty", v: "Frontend · TS / React", accent: false },
  { k: "format", v: "Remote · full-time", accent: false },
];

export function Hero() {
  return (
    <section id="top" className="pt-16 pb-0 md:pt-[72px]">
      <div
        data-hero-eyebrow=""
        className="font-mono text-[11px] tracking-widest uppercase mb-5 text-site-muted"
      >
        curriculum · 2026 / v2.4
      </div>

      <h1
        data-hero-h1=""
        className="font-medium leading-none tracking-tighter text-(length:--text-hero)"
      >
        Наумов
        <br />
        Сергей
        <span className="text-lime">.</span>
      </h1>

      <div
        data-hero-meta=""
        className="flex flex-col md:flex-row flex-wrap mt-11 ink-border-t ink-border-b"
      >
        {meta.map((m) => (
          <div
            key={m.k}
            className={`meta-item flex flex-col gap-1 p-[18px_22px] flex-[1_1_200px] ${m.accent ? "bg-lime text-black" : ""}`}
          >
            <span className={`font-mono text-[10.5px] tracking-[0.12em] uppercase ${m.accent ? "text-black/60" : "text-site-muted"}`}>
              {m.k}
            </span>
            <span className="text-xl font-medium tracking-[-0.01em]">{m.v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
