import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export type SliderAdvanceFn = (toIndex: number, atPos: number) => void;

interface Options {
  track:        HTMLElement;
  pinWrap:      HTMLElement;
  sectionRoot:  HTMLElement | null;
  itemSelector: string;
  gap?:         number;
  scrub?:       number;
  end?:         string;
  buildTimeline?: (
    tl:        gsap.core.Timeline,
    cards:     HTMLElement[],
    advanceTo: SliderAdvanceFn,
  ) => void;
}

export function createMobileSlider({
  track,
  pinWrap,
  sectionRoot,
  itemSelector,
  gap       = 16,
  scrub     = 1.2,
  end,
  buildTimeline,
}: Options) {
  const cards = Array.from(track.querySelectorAll<HTMLElement>(itemSelector));
  const dots  = Array.from(
    sectionRoot?.querySelectorAll<HTMLElement>("[data-slide-dot]") ?? []
  );

  if (cards.length < 2) return;

  gsap.set(track, { x: 0 });

  const tl = gsap.timeline();

  const slide = (n: number) => () =>
    cards[0] ? -(cards[0].offsetWidth + gap) * n : 0;

  const advanceTo: SliderAdvanceFn = (n, pos) => {
    tl.to(track, { x: slide(n), duration: 0.5, ease: "power2.inOut" }, pos);
    if (dots[n - 1]) tl.to(dots[n - 1], { opacity: 0.3, duration: 0.3 }, pos);
    if (dots[n])     tl.to(dots[n],     { opacity: 1,   duration: 0.3 }, pos);
  };

  if (buildTimeline) {
    buildTimeline(tl, cards, advanceTo);
  } else {
    for (let i = 1; i < cards.length; i++) {
      advanceTo(i, (i - 1) * 1.2 + 0.5);
    }
  }

  ScrollTrigger.create({
    trigger:             pinWrap,
    animation:           tl,
    start:               "top 65px",
    end:                 end ?? `+=${(cards.length - 1) * 100}%`,
    pin:                 true,
    scrub,
    invalidateOnRefresh: true,
  });
}
