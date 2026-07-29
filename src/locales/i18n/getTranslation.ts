import type { Locale } from "@/types";
import arTranslations from "../ar.json";
import enTranslations from "../en.json";
import { i18nConfig } from "./config";

/**
 * Flat key/value translation lookup.
 *
 * `en.json` is the source of truth for the key set: `TranslationKey` is derived
 * from it, so referencing a key that does not exist is a compile error, and
 * `ar.json` is checked to contain exactly the same keys.
 */
export type TranslationKey = keyof typeof enTranslations;

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: enTranslations,
  ar: arTranslations satisfies Record<TranslationKey, string>,
};

/**
 * Resolves `key` for `lang`, falling back to the fallback locale and finally to
 * the key itself. `params` replaces `{{name}}` placeholders.
 */
export function t(
  lang: Locale | undefined,
  key: TranslationKey,
  params: Record<string, string | number> = {}
): string {
  const langCode: Locale = lang ?? i18nConfig.defaultLang;
  const translation =
    translations[langCode][key] ?? translations[i18nConfig.fallbackLang][key] ?? key;

  const entries = Object.entries(params);
  if (entries.length === 0) return translation;

  return entries.reduce(
    (text, [param, value]) => text.replaceAll(`{{${param}}}`, String(value)),
    translation
  );
}
