import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, LOCALE_COOKIE, type Locale } from "@/shared/config/i18n";

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = locales.includes(cookie as Locale) ? (cookie as Locale) : defaultLocale;

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax" });
  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
