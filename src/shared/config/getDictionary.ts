import type { Locale } from "./i18n";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
