"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface Props {
  src: string | null;
  type: "image" | "video";
  onClose: () => void;
}

export function Lightbox({ src, type, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  if (!src || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9500, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center font-mono text-sm rounded-full"
        style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
        onClick={onClose}
      >
        ✕
      </button>

      <div
        className="relative flex items-center justify-center"
        style={{ maxWidth: "72vw", maxHeight: "72vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {type === "video" ? (
          <video
            src={src}
            autoPlay muted loop playsInline controls
            className="rounded-lg"
            style={{ maxWidth: "72vw", maxHeight: "72vh" }}
          />
        ) : (
          <div style={{ position: "relative", width: "min(72vw, 960px)", height: "min(72vh, 600px)" }}>
            <Image
              src={src}
              alt=""
              fill
              sizes="72vw"
              className="object-contain rounded-lg"
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
