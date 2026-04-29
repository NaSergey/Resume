"use client";

import { useEffect, useRef } from "react";

type SplitType = "chars" | "words" | "lines" | "words,chars";

interface SplitResult {
  chars: HTMLElement[];
  words: HTMLElement[];
  lines: HTMLElement[];
  revert: () => void;
}

/**
 * Splits text content of a target element into individually-wrapped spans.
 * Returns arrays of char/word/line elements for GSAP targeting.
 * Reverts on unmount — restores original innerHTML.
 */
export function useSplitText(type: SplitType = "chars"): {
  ref: React.RefObject<HTMLElement | null>;
  result: React.RefObject<SplitResult | null>;
} {
  const ref = useRef<HTMLElement>(null);
  const result = useRef<SplitResult | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const original = el.innerHTML;

    const split = splitElement(el, type);
    result.current = {
      ...split,
      revert: () => {
        el.innerHTML = original;
        result.current = null;
      },
    };

    return () => {
      if (result.current) {
        result.current.revert();
      }
    };
  }, [type]);

  return { ref, result };
}

function splitElement(el: HTMLElement, type: SplitType): Omit<SplitResult, "revert"> {
  const doChars = type.includes("chars");
  const doWords = type.includes("words");
  const doLines = type.includes("lines");

  const text = el.textContent ?? "";
  const wordsArr = text.split(/\s+/).filter(Boolean);

  let html = "";
  const wordEls: HTMLElement[] = [];
  const charEls: HTMLElement[] = [];

  for (const word of wordsArr) {
    let wordInner = "";
    if (doChars) {
      for (const char of word) {
        wordInner += `<span class="split-char">${char === " " ? "&nbsp;" : char}</span>`;
      }
    } else {
      wordInner = word;
    }
    html += `<span class="split-word" style="display:inline-block;white-space:nowrap">${wordInner}</span> `;
  }

  el.innerHTML = html;

  if (doWords || doChars) {
    el.querySelectorAll<HTMLElement>(".split-word").forEach((w) => wordEls.push(w));
    el.querySelectorAll<HTMLElement>(".split-char").forEach((c) => charEls.push(c));
  }

  const lineEls: HTMLElement[] = [];
  if (doLines) {
    wrapLines(el, lineEls);
  }

  return { chars: charEls, words: wordEls, lines: lineEls };
}

function wrapLines(el: HTMLElement, lineEls: HTMLElement[]) {
  const words = Array.from(el.querySelectorAll<HTMLElement>(".split-word"));
  if (!words.length) return;

  let currentTop = words[0].getBoundingClientRect().top;
  let lineWords: HTMLElement[] = [];

  const flush = () => {
    if (!lineWords.length) return;
    const lineWrap = document.createElement("span");
    lineWrap.className = "split-line";
    lineWrap.style.cssText = "display:block;overflow:hidden";
    const inner = document.createElement("span");
    inner.style.cssText = "display:block";
    lineWords.forEach((w) => inner.appendChild(w));
    lineWrap.appendChild(inner);
    lineEls.push(lineWrap);
    lineWords = [];
  };

  words.forEach((word) => {
    const top = word.getBoundingClientRect().top;
    if (Math.abs(top - currentTop) > 4) {
      flush();
      currentTop = top;
    }
    lineWords.push(word);
  });
  flush();

  el.innerHTML = "";
  lineEls.forEach((l) => el.appendChild(l));
}
