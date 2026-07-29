import type { Locale } from "@/types";

export const i18nConfig = {
  defaultLang: "en",
  supportedLangs: ["ar", "en"],
  fallbackLang: "en",
} as const satisfies {
  defaultLang: Locale;
  supportedLangs: readonly Locale[];
  fallbackLang: Locale;
};

/** Narrows an arbitrary string to a supported locale. */
export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}
