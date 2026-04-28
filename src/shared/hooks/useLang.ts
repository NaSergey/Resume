"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/shared/config/i18n";

export function useLang(currentLang: Locale) {
  const router = useRouter();

  const setLang = (lang: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; SameSite=Lax`;
    router.refresh();
  };

  return { lang: currentLang, setLang };
}
