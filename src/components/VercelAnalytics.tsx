"use client";

import { Analytics } from "@vercel/analytics/react";

/**
 * Vercel Web Analytics.
 *
 * Only mounted in production builds. It deliberately does not branch on
 * `window` — doing so returns different markup on the server and the client and
 * triggers a hydration mismatch.
 */
export default function VercelAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;
  return <Analytics />;
}
