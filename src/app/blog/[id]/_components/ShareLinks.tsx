"use client";

import { Facebook, Link2, Twitter } from "lucide-react";
import type { Locale } from "@/types";
import { t } from "@/locales/i18n/getTranslation";
import useToastStore from "@/store/toastStore";

export interface ShareLinksProps {
  title: string;
  lang: Locale;
}

/** Copy-link + social share row. Reads `window.location` at click time only. */
export default function ShareLinks({ title, lang }: ShareLinksProps) {
  const toastSuccess = useToastStore((state) => state.success);
  const toastError = useToastStore((state) => state.error);

  const currentUrl = () => (typeof window === "undefined" ? "" : window.location.href);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl());
      toastSuccess("Link copied");
    } catch {
      toastError("Could not copy the link");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow hidden sm:inline">{t(lang, "share")}</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl())}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-ink hover:border-brand transition-colors"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl())}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-ink hover:border-brand transition-colors"
      >
        <Twitter className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={() => {
          void handleCopy();
        }}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-ink hover:border-brand transition-colors"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
}
