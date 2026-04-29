"use client";

import { useEffect, useRef } from "react";

/**
 * Animated canvas backdrop.
 *
 * Particles:
 * - Grid of dots with floating animation (sin/cos per-particle phase)
 * - Mouse repulsion: dots push away within 120px radius
 * - Brightness increases near cursor
 *
 * Connections:
 * - Lines drawn only between grid-adjacent neighbors (right + bottom)
 *   so complexity is O(n) not O(n²)
 * - Line alpha = distance-based falloff × dot proximity boost
 * - Near cursor: connections brighten and thicken
 *
 * Mouse click:
 * - Ripple wave: expanding ring of brightened dots propagates outward
 */
export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef(0);

  // Ripple state: { x, y, radius, maxRadius, strength }
  const ripples = useRef<Array<{ x: number; y: number; r: number; maxR: number; str: number }>>([]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const canvas  = el;
    const context = ctx;

    const SPACING   = 60;
    const DOT_R     = 1.0;
    const REPEL_R   = 130;
    const REPEL_STR = 22;
    const FLOAT_AMP = 3.5;
    const CONN_MAX  = SPACING * 1.55; // max distance for a connection line
    const RIPPLE_SPEED = 2.5;

    type Dot = { ox: number; oy: number; x: number; y: number; phase: number };
    let grid: Dot[]  = [];
    let cols = 0;
    let rows = 0;
    let W = 0;
    let H = 0;

    function buildGrid() {
      grid  = [];
      cols  = Math.ceil(W / SPACING) + 1;
      rows  = Math.ceil(H / SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          grid.push({
            ox: c * SPACING,
            oy: r * SPACING,
            x:  c * SPACING,
            y:  r * SPACING,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      buildGrid();
    }

    function draw(t: number) {
      context.clearRect(0, 0, W, H);

      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Advance ripples
      for (const rip of ripples.current) rip.r += RIPPLE_SPEED;
      ripples.current = ripples.current.filter((r) => r.r < r.maxR);

      // ── Update dot positions ──────────────────────────────────────
      for (const p of grid) {
        const floatX = Math.cos(t * 0.0008 + p.phase) * FLOAT_AMP * 0.5;
        const floatY = Math.sin(t * 0.001  + p.phase) * FLOAT_AMP;

        let tx = p.ox + floatX;
        let ty = p.oy + floatY;

        // Mouse repulsion
        const dxM = p.ox - mx;
        const dyM = p.oy - my;
        const dM  = Math.sqrt(dxM * dxM + dyM * dyM);
        if (dM < REPEL_R && dM > 0) {
          const force = (1 - dM / REPEL_R) * REPEL_STR;
          tx += (dxM / dM) * force;
          ty += (dyM / dM) * force;
        }

        // Ripple displacement: dots surge outward from ripple origin
        for (const rip of ripples.current) {
          const dxR = p.ox - rip.x;
          const dyR = p.oy - rip.y;
          const dR  = Math.sqrt(dxR * dxR + dyR * dyR);
          const band = 24; // width of the wave band
          const diff = Math.abs(dR - rip.r);
          if (diff < band && dR > 0) {
            const intensity = (1 - diff / band) * rip.str * (1 - rip.r / rip.maxR);
            tx += (dxR / dR) * intensity;
            ty += (dyR / dR) * intensity;
          }
        }

        p.x += (tx - p.x) * 0.1;
        p.y += (ty - p.y) * 0.1;
      }

      // ── Draw connection lines (adjacent grid neighbors only) ──────
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const p = grid[i];

          // Right neighbor
          if (c + 1 < cols) drawLine(p, grid[i + 1], mx, my);
          // Bottom neighbor
          if (r + 1 < rows) drawLine(p, grid[i + cols], mx, my);
          // Diagonal (bottom-right) — adds visual density without O(n²)
          if (c + 1 < cols && r + 1 < rows) drawLine(p, grid[i + cols + 1], mx, my, 0.45);
        }
      }

      // ── Draw dots ────────────────────────────────────────────────
      for (const p of grid) {
        const distM    = Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2);
        const proximity = Math.max(0, 1 - distM / 200);

        // Ripple brightness boost
        let rippleBoost = 0;
        for (const rip of ripples.current) {
          const d    = Math.sqrt((p.x - rip.x) ** 2 + (p.y - rip.y) ** 2);
          const band = 28;
          if (Math.abs(d - rip.r) < band) {
            rippleBoost = Math.max(rippleBoost, (1 - Math.abs(d - rip.r) / band) * 0.5);
          }
        }

        const alpha  = 0.07 + proximity * 0.38 + rippleBoost;
        const radius = DOT_R + proximity * 1.8 + rippleBoost * 2;

        context.beginPath();
        context.arc(p.x, p.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(0, 212, 255, ${Math.min(alpha, 0.85)})`;
        context.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function drawLine(
      a: Dot, b: Dot,
      mx: number, my: number,
      alphaScale = 1
    ) {
      const dx   = a.x - b.x;
      const dy   = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > CONN_MAX) return;

      const distFade = 1 - dist / CONN_MAX;

      // Brighten lines near cursor
      const midX       = (a.x + b.x) / 2;
      const midY       = (a.y + b.y) / 2;
      const distM      = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2);
      const cursorBoost = Math.max(0, 1 - distM / 180) * 0.3;

      const alpha = (distFade * 0.12 + cursorBoost) * alphaScale;
      if (alpha < 0.005) return;

      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
      context.lineWidth   = 0.5 + cursorBoost * 0.8;
      context.stroke();
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.current.push({
        x:    e.clientX - rect.left,
        y:    e.clientY - rect.top,
        r:    0,
        maxR: Math.max(W, H) * 0.6,
        str:  14,
      });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click",     onClick);
    rafRef.current = requestAnimationFrame(draw);

    const autoRipple = setInterval(() => {
      ripples.current.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    0,
        maxR: Math.max(W, H) * 0.6,
        str:  14,
      });
    }, 3000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(autoRipple);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click",     onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
