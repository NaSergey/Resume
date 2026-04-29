import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/shared/providers/LenisProvider";
import { CustomCursor } from "@/widgets/CustomCursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jet",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Наумов Сергей — Frontend Engineer",
  description:
    "Senior Frontend Engineer специализирующийся на React, Next.js, TypeScript. 6+ лет опыта построения production-grade интерфейсов.",
  keywords: ["Frontend Engineer", "React", "Next.js", "TypeScript", "Наумов Сергей"],
  authors: [{ name: "Наумов Сергей" }],
  openGraph: {
    title: "Наумов Сергей — Frontend Engineer",
    description: "Senior Frontend Engineer. React · Next.js · TypeScript · 6+ лет опыта",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <LenisProvider>
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
