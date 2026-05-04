export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse ${className ?? ""}`}
      style={{ background: "rgba(255,255,255,0.05)", ...style }}
    />
  );
}
