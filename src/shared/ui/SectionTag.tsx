interface SectionTagProps {
  index: string;  // e.g. "01"
  label: string;  // e.g. "ABOUT"
  className?: string;
}

/**
 * Decorative section label: [01 / ABOUT]
 * Used consistently across all page sections to establish visual rhythm.
 */
export function SectionTag({ index, label, className = "" }: SectionTagProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "var(--color-cyan)", boxShadow: "0 0 8px var(--color-cyan)" }}
      />
      <span style={{ color: "var(--color-cyan)" }}>{index}</span>
      <span style={{ color: "var(--color-ink-faint)" }}>/</span>
      <span style={{ color: "var(--color-ink-dim)" }}>{label}</span>
    </div>
  );
}
