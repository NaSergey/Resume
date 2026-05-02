"use client";

import { useCallback } from "react";
import gsap from "gsap";

export function useCardHover(sectionRef: React.RefObject<HTMLElement | null>) {
  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, hoveredIndex: number) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const rx   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      const ry   = ((e.clientX - rect.left) / rect.width  - 0.5) * -2;

      gsap.to(card, {
        rotationX: rx * 10, rotationY: ry * 10, scale: 1.02,
        duration: 0.28, ease: "power2.out", transformPerspective: 900, overwrite: "auto",
      });

      sectionRef.current?.querySelectorAll<HTMLElement>(".skill-group").forEach((sibling, i) => {
        if (i === hoveredIndex) return;
        const dir = i < hoveredIndex ? -1 : 1;
        gsap.to(sibling, {
          rotationY: dir * 14, x: dir * 10, scale: 0.97,
          duration: 0.35, ease: "power2.out", transformPerspective: 900, overwrite: "auto",
        });
      });
    },
    [sectionRef]
  );

  const handleCardMouseLeave = useCallback(() => {
    sectionRef.current?.querySelectorAll<HTMLElement>(".skill-group").forEach((card, i) => {
      gsap.to(card, {
        rotationX: 0, rotationY: 0, x: 0, scale: 1,
        duration: 0.85, delay: i * 0.04, ease: "elastic.out(1.3, 0.42)", overwrite: "auto",
      });
    });
  }, [sectionRef]);

  return { handleCardMouseMove, handleCardMouseLeave };
}
