import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { defaultLocale, LOCALE_COOKIE, locales, type Locale } from "@/shared/config/i18n";
import { LenisProvider } from "@/shared/providers/LenisProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jet",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-inst",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Наумов Сергей — Frontend Engineer",
  description: "Portfolio & Resume",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const lang: Locale = locales.includes(cookie as Locale) ? (cookie as Locale) : defaultLocale;

  return (
    <html
      lang={lang}
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
