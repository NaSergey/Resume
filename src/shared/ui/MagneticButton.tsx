"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useMagneticHover } from "@/shared/hooks/useMagneticHover";
import { scrollTo } from "@/shared/providers/LenisProvider";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-[14px]",
  lg: "px-10 py-5 text-[15px]",
};

/**
 * Magnetic button with three enhancement layers:
 * 1. Magnetic displacement + velocity skew (useMagneticHover)
 * 2. Shimmer sweep across surface on mouse enter
 * 3. Radial ripple on press (origin = click position)
 * 4. Mouse-position-aware inner glow gradient
 */
export function MagneticButton({
  children,
  variant = "primary",
  size    = "md",
  href,
  onClick,
  className = "",
}: MagneticButtonProps) {
  const { outerRef, innerRef, onMouseEnter: magEnter, onMouseMove, onMouseLeave } =
    useMagneticHover<HTMLElement, HTMLSpanElement>({ strength: 0.35, innerStrength: 0.65, skewStrength: 4 });

  const shimmerRef = useRef<HTMLSpanElement>(null);
  const rippleRef  = useRef<HTMLSpanElement>(null);
  const glowRef    = useRef<HTMLSpanElement>(null);

  const isPrimary = variant === "primary";

  const baseStyle: React.CSSProperties = isPrimary
    ? {
        background: "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(157,78,221,0.12))",
        border: "1px solid rgba(0,212,255,0.38)",
        color: "var(--color-cyan)",
      }
    : {
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "var(--color-ink)",
      };

  const onMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      magEnter();
      // Shimmer: a bright diagonal line sweeps left → right
      if (shimmerRef.current) {
        gsap.fromTo(
          shimmerRef.current,
          { x: "-120%", opacity: 0 },
          { x: "120%", opacity: 1, duration: 0.55, ease: "power2.inOut" }
        );
      }
      // Glow opacity up
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 1, duration: 0.3 });
      }
    },
    [magEnter]
  );

  const onMouseMoveEnhanced = useCallback(
    (e: React.MouseEvent) => {
      onMouseMove(e);
      // Move inner glow radial to follow cursor within button
      if (glowRef.current && outerRef.current) {
        const rect = (outerRef.current as HTMLElement).getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        gsap.set(glowRef.current, {
          background: `radial-gradient(circle at ${px}% ${py}%, ${isPrimary ? "rgba(0,212,255,0.18)" : "rgba(255,255,255,0.06)"} 0%, transparent 65%)`,
        });
      }
    },
    [onMouseMove, outerRef, isPrimary]
  );

  const onMouseLeaveEnhanced = useCallback(
    (e: React.MouseEvent) => {
      onMouseLeave();
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
      }
    },
    [onMouseLeave]
  );

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = outerRef.current as HTMLElement | null;
    const rip = rippleRef.current;
    if (!el || !rip) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.set(rip, { x, y, scale: 0, opacity: 0.5 });
    gsap.to(rip, { scale: 4, opacity: 0, duration: 0.55, ease: "power2.out", overwrite: true });
  }, [outerRef]);

  const sharedProps = {
    onMouseEnter,
    onMouseMove: onMouseMoveEnhanced,
    onMouseLeave: onMouseLeaveEnhanced,
    onMouseDown,
    "data-cursor-hover": true,
    className: `magnetic-btn clip-corner-sm font-mono tracking-wider uppercase relative overflow-hidden ${sizeMap[size]} ${className}`,
    style: baseStyle,
  };

  const inner = (
    <>
      {/* Inner glow (mouse-tracked) */}
      <span
        ref={glowRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Ripple */}
      <span
        ref={rippleRef}
        aria-hidden
        style={{
          position: "absolute",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: isPrimary ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.15)",
          transform: "translate(-50%, -50%) scale(0)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Label */}
      <span
        ref={innerRef}
        className="magnetic-btn-inner relative z-10 flex items-center gap-2"
      >
        {children}
      </span>
    </>
  );

  if (href) {
    const handleAnchorClick = href.startsWith("#")
      ? (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          scrollTo(href);
        }
      : undefined;

    return (
      <a href={href} ref={outerRef as React.RefObject<HTMLAnchorElement>} onClick={handleAnchorClick} {...sharedProps}>
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} ref={outerRef as React.RefObject<HTMLButtonElement>} {...sharedProps}>
      {inner}
    </button>
  );
}
