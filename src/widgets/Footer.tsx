export function Footer() {
  return (
    <footer className="max-w-[1200px] mx-auto w-full px-5 md:px-8 py-12 flex flex-wrap justify-between items-center gap-5 text-xs font-mono text-site-muted ink-border-t">
      <span>★ built by hand · last update 04.2026</span>
      <div className="flex gap-[18px]">
        {[
          { label: "email", href: "mailto:wxtx.ns@gmail.com" },
          { label: "github", href: "#" },
          { label: "telegram", href: "#" },
          { label: "linkedin", href: "#" },
        ].map((l) => (
          <a key={l.label} href={l.href} className="transition-colors duration-150 hover:text-lime">
            {l.label}
          </a>
        ))}
      </div>
      <span>© 2026 Наумов С.</span>
    </footer>
  );
}
