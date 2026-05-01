"use client";

import { useEffect, useState } from "react";

interface Props {
  text: string;
  className?: string;
  eraseSpeed?: number;
  typingSpeed?: number;
  interval?: number;
}

export function TypewriterText({ text, className, eraseSpeed = 60, typingSpeed = 100, interval = 20000 }: Props) {
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    const animate = () => {
      let len = text.length;

      const erase = setInterval(() => {
        len--;
        setCount(len);
        if (len <= 0) {
          clearInterval(erase);
          let i = 0;
          const type = setInterval(() => {
            i++;
            setCount(i);
            if (i >= text.length) clearInterval(type);
          }, typingSpeed);
        }
      }, eraseSpeed);
    };

    const loop = setInterval(animate, interval);
    return () => clearInterval(loop);
  }, [text, eraseSpeed, typingSpeed, interval]);

  return (
    <span className={className} style={{ position: "relative", display: "inline-block" }}>
      <span style={{ visibility: "hidden", whiteSpace: "nowrap" }}>{text}</span>
      <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>
        {text.split("").map((char, i) =>
          i < count ? (
            <span key={i}>{char}</span>
          ) : (
            <span
              key={i}
              style={{
                color: "transparent",
                textDecoration: char === " " ? "none" : "underline",
                textDecorationColor: "rgba(255,255,255,0.3)",
              }}
            >
              {char}
            </span>
          )
        )}
      </span>
    </span>
  );
}
