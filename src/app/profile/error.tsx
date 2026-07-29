"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";

export interface ProfileErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfileError({ error, reset }: ProfileErrorProps) {
  const lang = useLanguageClient();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sunken">
      <div className="text-center px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-ink mb-4">
            {t(lang, "something_went_wrong")}
          </h2>
          <p className="text-muted mb-8">
            {error?.message || t(lang, "an_error_occurred")}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 bg-ink text-white rounded-lg hover:bg-ink-800 transition-colors"
          >
            {t(lang, "try_again")}
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-line-strong text-ink rounded-lg hover:bg-sunken transition-colors"
          >
            {t(lang, "home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
