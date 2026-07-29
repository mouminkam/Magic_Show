"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Last-resort boundary: it replaces the root layout, so it must render its own
 * `<html>` and `<body>` and cannot rely on any app-level provider.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-sunken">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold text-ink mb-4">Something went wrong</h2>
            <p className="text-muted mb-6">{error.message || "An unexpected error occurred"}</p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 bg-ink-900 text-white rounded-lg hover:bg-ink-800"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
