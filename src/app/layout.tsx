import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { LenisProvider } from "@/shared/providers/LenisProvider";
import { LangProvider } from "@/shared/providers/LangProvider";
import { CustomCursor } from "@/widgets/CustomCursor";
import { LOCALE_COOKIE } from "@/shared/config/i18n";
import type { Locale } from "@/shared/config/translations";

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
    "Middle Frontend Engineer специализирующийся на React, Next.js, TypeScript. 4+ лет опыта построения production-grade интерфейсов.",
  keywords: ["Frontend Engineer", "React", "Next.js", "TypeScript", "Наумов Сергей"],
  authors: [{ name: "Наумов Сергей" }],
  openGraph: {
    title: "Наумов Сергей — Frontend Engineer",
    description: "Middle Frontend Engineer. React · Next.js · TypeScript · 4+ лет опыта",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  const initialLang: Locale = raw === "en" || raw === "ru" ? raw : "ru";

  return (
    <html
      lang={initialLang}
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <LangProvider initialLang={initialLang}>
          <LenisProvider>
            <CustomCursor />
            {children}
          </LenisProvider>
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
