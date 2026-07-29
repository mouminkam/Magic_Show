import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { Locale } from "@/types";
import { i18nConfig, isLocale } from "@/locales/i18n/config";

/**
 * Reads the active locale from the `language` cookie in the browser.
 *
 * IMPORTANT: this is a plain function, not a hook. Calling it directly during
 * render in a Client Component is NOT hydration-safe: React re-runs the
 * render function on the client during hydration, and by that point
 * `window`/`document.cookie` already exist, so this returns the real cookie
 * value immediately — while the server (which has no cookie access here)
 * rendered with the default locale. That mismatch produces a hydration
 * error. Use `useLanguageClient()` for anything read during render; keep
 * this function only for reads inside event handlers/callbacks that run
 * after mount (e.g. a submit handler), where there is nothing to hydrate
 * against.
 */
export function getLanguageClient(): Locale {
  if (typeof window === "undefined") {
    return i18nConfig.defaultLang;
  }

  const value = Cookies.get("language");
  return isLocale(value) ? value : i18nConfig.defaultLang;
}

/**
 * Hydration-safe hook for reading the active locale during render.
 *
 * The initial state always matches the server-rendered default locale, so
 * the first client render is identical to the server render. The real
 * cookie-derived value is read in a `useEffect` after mount, which triggers
 * a second, harmless re-render if it differs from the default.
 */
export function useLanguageClient(): Locale {
  const [language, setLanguage] = useState<Locale>(() => i18nConfig.defaultLang);

  useEffect(() => {
    const value = Cookies.get("language");
    const resolved = isLocale(value) ? value : i18nConfig.defaultLang;
    setLanguage((current) => (current === resolved ? current : resolved));
  }, []);

  return language;
}
