import { cookies } from "next/headers";
import type { Locale } from "@/types";
import { i18nConfig, isLocale } from "@/locales/i18n/config";

/**
 * Reads the active locale from the `language` cookie. Server Components only —
 * client code must use `getLanguageClient()`.
 */
export async function getLanguage(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get("language")?.value;
    return isLocale(value) ? value : i18nConfig.defaultLang;
  } catch {
    // `cookies()` throws outside a request scope (e.g. during static
    // generation). Fall back to the default locale rather than failing render.
    return i18nConfig.defaultLang;
  }
}
