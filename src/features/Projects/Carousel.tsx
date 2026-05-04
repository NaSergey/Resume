"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/shared/ui/Skeleton";

const VISIBLE = 3;

interface Props {
  images: string[];
  color: string;
  onOpen: (src: string) => void;
}

export function Carousel({ images, color, onOpen }: Props) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(() => images.map(() => false));

  const maxIndex = Math.max(0, images.length - VISIBLE);

  const go = (dir: 1 | -1) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((i) => Math.min(Math.max(0, i + dir), maxIndex));
  };

  const markLoaded = (i: number) =>
    setLoaded((prev) => { const n = [...prev]; n[i] = true; return n; });

  const showNav = images.length > VISIBLE;

  return (
    <div className="relative select-none">
      <div className="overflow-hidden rounded-lg" style={{ height: "140px" }}>
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * (100 / VISIBLE)}%)` }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-1 h-full cursor-zoom-in"
              style={{ width: `${100 / VISIBLE}%` }}
              onClick={() => onOpen(src)}
            >
              <div
                className="relative w-full h-full overflow-hidden rounded"
                style={{ border: `1px solid ${color}20` }}
              >
                {!loaded[i] && <Skeleton className="absolute inset-0 z-10" />}
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 30vw, 260px"
                  className="object-cover object-top"
                  onLoad={() => markLoaded(i)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNav && (
        <>
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-7 h-7 flex items-center justify-center rounded-full font-mono text-xs"
            style={{ background: "rgba(6,6,18,0.85)", border: `1px solid ${color}35`, color, opacity: current === 0 ? 0.3 : 1 }}
            onClick={go(-1)}
            disabled={current === 0}
          >
            ←
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-7 h-7 flex items-center justify-center rounded-full font-mono text-xs"
            style={{ background: "rgba(6,6,18,0.85)", border: `1px solid ${color}35`, color, opacity: current === maxIndex ? 0.3 : 1 }}
            onClick={go(1)}
            disabled={current === maxIndex}
          >
            →
          </button>
        </>
      )}

      {showNav && (
        <div className="flex justify-center gap-1.5 mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-200"
              style={{
                background: i === current ? color : `${color}35`,
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }}
              onClick={() => setCurrent(Math.min(i, maxIndex))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
