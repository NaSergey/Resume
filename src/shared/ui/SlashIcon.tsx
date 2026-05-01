type Props = { width?: number; height?: number; className?: string };

export function SlashIcon({ width = 26, height = 18, className }: Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 26 18" fill="none" aria-hidden className={className}>
      <line x1="8" y1="1" x2="3" y2="17" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="1" x2="11" y2="17" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
