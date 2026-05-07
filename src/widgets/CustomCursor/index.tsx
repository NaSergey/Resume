"use client";

import { useCursor } from "@/shared/hooks/useCursor";

/**
 * Three-layer cursor:
 * 1. Dot   — instant position, skews in movement direction
 * 2. Ring  — lerped, stretches + rotates to face velocity vector
 * 3. Trail — 2 ghost rings at progressively longer delays + lower opacity
 */
export function CustomCursor() {
  const { dotRef, ringRef, t1Ref, t2Ref, state, isTouch } = useCursor();

  if (isTouch) return null;

  const hidden = state === "hidden";
  const hovering = state === "hover";
  const clicking = state === "click";

  return (
    <>
      {/* Trail ring 2 — slowest, most transparent */}
      <div
        ref={t2Ref}
        aria-hidden
        style={{
          position: "fixed",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "1px solid rgba(0,212,255,0.12)",
          pointerEvents: "none",
          zIndex: 9996,
          opacity: hidden ? 0 : 0.45,
          willChange: "transform",
          transition: "opacity 0.3s",
        }}
      />

      {/* Trail ring 1 */}
      <div
        ref={t1Ref}
        aria-hidden
        style={{
          position: "fixed",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "1px solid rgba(0,212,255,0.22)",
          pointerEvents: "none",
          zIndex: 9997,
          opacity: hidden ? 0 : 0.65,
          willChange: "transform",
          transition: "opacity 0.3s",
        }}
      />

      {/* Ring — velocity-stretched */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          width: hovering ? "52px" : "36px",
          height: hovering ? "52px" : "36px",
          borderRadius: "50%",
          border: `1px solid ${hovering ? "rgba(0,212,255,0.7)" : "rgba(0,212,255,0.45)"}`,
          background: hovering ? "rgba(0,212,255,0.05)" : "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: hidden ? 0 : 1,
          willChange: "transform, width, height",
          transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s, background 0.25s, opacity 0.3s",
          // Subtle inner glow on hover
          boxShadow: hovering ? "0 0 16px rgba(0,212,255,0.18), inset 0 0 8px rgba(0,212,255,0.06)" : "none",
        }}
      />

      {/* Dot — instant, skews with velocity */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          width: clicking ? "5px" : "7px",
          height: clicking ? "5px" : "7px",
          borderRadius: "50%",
          background: "var(--color-cyan)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: hidden ? 0 : 1,
          willChange: "transform, width, height",
          transition: "width 0.15s, height 0.15s, opacity 0.3s",
          boxShadow: "0 0 10px var(--color-cyan-glow), 0 0 26px rgba(0,212,255,0.25)",
        }}
      />
    </>
  );
}
