import { useSyncExternalStore } from "react";
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

/** The cookie has no change event to subscribe to; it is read once per render pass. */
const subscribe = () => () => {};
const getServerLanguage = (): Locale => i18nConfig.defaultLang;

/**
 * Hydration-safe hook for reading the active locale during render.
 *
 * `useSyncExternalStore` renders with the server snapshot (the default locale)
 * while hydrating, so the first client render is identical to the server
 * render; React then re-renders with the real cookie value if it differs.
 * Same guarantee as a mount effect, without the extra effect-driven state.
 */
export function useLanguageClient(): Locale {
  return useSyncExternalStore(subscribe, getLanguageClient, getServerLanguage);
}
