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
    // Блокируем скролл на уровне body, чтобы убрать лишние расчеты сдвига
    document.body.style.overflow = "hidden"; 
    
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  if (!src || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        zIndex: 9500, 
        background: "rgba(3, 3, 5, 0.96)", // Увеличили непрозрачность, убрали blur
        // backdropFilter: "none" // Если тормозит — это первое на удаление
      }}
      onClick={onClose}
    >
      {/* Кнопка закрытия */}
      <button
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center font-mono text-lg rounded-full transition-colors hover:bg-white/10"
        style={{ background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={onClose}
      >
        ✕
      </button>

      <div
        className="relative flex items-center justify-center"
        style={{ width: "90vw", height: "80vh" }} // Чуть увеличим область для комфорта
        onClick={(e) => e.stopPropagation()}
      >
        {type === "video" ? (
          <video
            src={src}
            autoPlay muted loop playsInline controls
            className="rounded-lg shadow-2xl"
            style={{ 
               maxWidth: "100%", 
               maxHeight: "100%", 
               transform: "translateZ(0)", // GPU ускорение
               willChange: "contents" 
            }}
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt=""
              fill
              priority // Чтобы картинка не мерцала при загрузке в портале
              sizes="90vw"
              className="object-contain rounded-lg"
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}