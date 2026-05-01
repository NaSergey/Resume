"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { LOCALE_COOKIE } from "@/shared/config/i18n";
import { translations, type Locale } from "@/shared/config/translations";

interface LangCtx {
  lang: Locale;
  t: typeof translations[Locale];
  setLang: (l: Locale) => void;
}

const Ctx = createContext<LangCtx>({
  lang: "ru",
  t: translations.ru,
  setLang: () => {},
});

interface Props {
  children: ReactNode;
  initialLang: Locale;
}

export function LangProvider({ children, initialLang }: Props) {
  const [lang, setLangState] = useState<Locale>(initialLang);

  const setLang = (l: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; SameSite=Lax`;
    setLangState(l);
  };

  return (
    <Ctx.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
