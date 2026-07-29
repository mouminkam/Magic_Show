/**
 * Google Analytics 4 helpers. Every function is a no-op unless
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, so the app runs with no env vars.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type GtagArgs =
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?]
  | ["js", Date];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: GtagArgs): void {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  window.gtag?.(...args);
}

export function pageview(url: string): void {
  if (!GA_MEASUREMENT_ID) return;
  gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

export interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

export function event({ action, category, label, value }: AnalyticsEvent): void {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}
