import type { CurrencyCode } from "@/types";

/** Formats a date (or ISO string) as e.g. `January 15, 2026`. */
export function formatDate(date: Date | string, locale = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/** Formats a date as e.g. `15 Jan 2026` — used in compact lists. */
export function formatShortDate(date: Date | string, locale = "en-GB"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(dateObj);
}

export function formatNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formats a money amount. Prices are stored as plain numbers in the catalogue,
 * so this is the single place that decides how they render.
 */
export function formatPrice(
  value: number | string | null | undefined,
  currency: CurrencyCode = "USD",
  locale = "en-US"
): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(0);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    // SYP is quoted in whole units; everything else keeps cents.
    minimumFractionDigits: currency === "SYP" ? 0 : 2,
    maximumFractionDigits: currency === "SYP" ? 0 : 2,
  }).format(amount);
}

export function truncateText(text: string, length: number, suffix = "..."): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + suffix;
}

export function capitalize(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
