"use client";

interface SliderDotsProps {
  items:      { rawColor: string }[];
  className?: string;
}

export function SliderDots({ items, className = "" }: SliderDotsProps) {
  return (
    <div className={`flex md:hidden justify-center gap-2 ${className}`}>
      {items.map((item, i) => (
        <div
          key={i}
          data-slide-dot={i}
          className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "opacity-100" : "opacity-30"}`}
          style={{ background: item.rawColor }}
        />
      ))}
    </div>
  );
}
