"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { stopLenis, startLenis } from "@/shared/providers/LenisProvider";
import { type Project } from "@/shared/data";
import { useLang } from "@/shared/providers/LangProvider";
import { Skeleton } from "@/shared/ui/Skeleton";

interface Props {
  project: Project | null;
  onClose: () => void;
}

function ProjectImage({ src, color }: { src: string; color: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="flex-1 relative overflow-hidden rounded-lg"
      style={{ height: "120px", border: `1px solid ${color}20` }}
    >
      {!loaded && <Skeleton className="absolute inset-0" />}
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 40vw, 200px"
        className="object-cover"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function ComingSoonHero({ color }: { color: string }) {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center gap-4"
      style={{ height: "320px", background: `${color}05`, borderRadius: "12px 12px 0 0", border: `1px solid ${color}15` }}
    >
      <div className="absolute top-5 left-5 w-5 h-5" style={{ borderTop: `1px solid ${color}50`, borderLeft: `1px solid ${color}50` }} />
      <div className="absolute top-5 right-5 w-5 h-5" style={{ borderTop: `1px solid ${color}50`, borderRight: `1px solid ${color}50` }} />
      <div className="absolute bottom-5 left-5 w-5 h-5" style={{ borderBottom: `1px solid ${color}50`, borderLeft: `1px solid ${color}50` }} />
      <div className="absolute bottom-5 right-5 w-5 h-5" style={{ borderBottom: `1px solid ${color}50`, borderRight: `1px solid ${color}50` }} />

      <div className="w-12 h-px" style={{ background: `${color}60` }} />
      <p className="font-mono text-xs tracking-[0.4em] uppercase" style={{ color }}>
        coming soon
      </p>
      <p className="font-mono text-xs tracking-wider" style={{ color: "var(--color-ink-faint)" }}>
        project in progress
      </p>
      <div className="w-12 h-px" style={{ background: `${color}60` }} />
    </div>
  );
}

export function ProjectModal({ project, onClose }: Props) {
  const last = useRef<Project | null>(null);
  if (project) last.current = project;
  const p = last.current;

  const { t } = useLang();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (project) { stopLenis(); setVideoReady(false); }
    else startLenis();
    return () => { startLenis(); };
  }, [project]);

  if (!p) return null;

  const isComingSoon = p.year === "Будет позже";

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent
        customAnimation
        showCloseButton={false}
        className="project-modal sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 ring-0 border-0 gap-0"
        style={{
          background: "rgba(6, 6, 18, 0.88)",
          backdropFilter: "blur(48px) saturate(200%) brightness(1.08)",
          WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.08)",
          border: `1px solid ${p.rawColor}22`,
          boxShadow: `
            0 0 0 1px ${p.rawColor}12,
            0 40px 100px rgba(0,0,0,0.85),
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(255,255,255,0.03)
          `,
        }}
      >
        {/* Mirror top reflection */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 pointer-events-none rounded-t-xl overflow-hidden"
          style={{ height: "45%", zIndex: 1 }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.2) 70%, transparent)",
          }} />
        </div>

        <DialogClose
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full font-mono text-sm transition-all duration-200 hover:scale-110"
          style={{
            background: `${p.rawColor}18`,
            border: `1px solid ${p.rawColor}35`,
            color: p.rawColor,
          }}
          data-cursor-hover
        >
          ✕
        </DialogClose>

        {/* Hero: video with skeleton or coming-soon placeholder */}
        {isComingSoon ? (
          <ComingSoonHero color={p.rawColor} />
        ) : (
          <div className="relative w-full overflow-hidden" style={{ borderRadius: "12px 12px 0 0", height: "320px" }}>
            <Skeleton
              className="absolute inset-0"
              style={{ opacity: videoReady ? 0 : 1, transition: "opacity 0.3s ease" }}
            />
            <video
              src={p.video}
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.3s ease" }}
              onLoadedMetadata={() => setVideoReady(true)}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-16 z-10"
              style={{ background: "linear-gradient(to top, rgba(6,6,18,0.88), transparent)" }}
            />
          </div>
        )}

        {/* Images with skeleton — hidden for coming soon */}
        {!isComingSoon && (
          <div className="flex gap-3 px-6 pt-4">
            {p.images.map((src, i) => (
              <ProjectImage key={i} src={src} color={p.rawColor} />
            ))}
          </div>
        )}

        {/* Text content — always visible */}
        <div className="px-6 pt-5 pb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-mono text-label tracking-widest uppercase mb-1" style={{ color: "var(--color-ink-faint)" }}>
                {p.category} · {isComingSoon ? t.projects.comingSoon : p.year}
              </p>
              <h2 className="font-bold" style={{ fontSize: "var(--text-h3)", color: "var(--color-ink)" }}>
                {p.title}
              </h2>
            </div>
            <span className="font-mono text-label opacity-50" style={{ color: p.rawColor }}>
              {p.num}
            </span>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-ink-dim)" }}>
            {t.projects.descs[p.id as keyof typeof t.projects.descs] ?? p.desc}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {p.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] tracking-wider px-2 py-1"
                style={{
                  color: p.rawColor,
                  border: `1px solid ${p.rawColor}30`,
                  borderRadius: "2px",
                  background: `${p.rawColor}08`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${p.rawColor}60, transparent)` }}
        />
      </DialogContent>
    </Dialog>
  );
}
