"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";

export default function CartEmptyState() {
  const lang = useLanguageClient();

  return (
    <div className="min-h-[60vh] bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-ink-50 flex items-center justify-center">
          <ShoppingBag className="w-7 h-7 text-ink-400" />
        </div>
        <h1 className="font-display text-2xl text-ink-900 mb-2">Your cart is empty</h1>
        <p className="text-ink-400 text-sm mb-8">{t(lang, "cart_empty")}</p>
        {/* A real link rather than `window.location` so it prefetches and works
            without JavaScript. */}
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-ink-900 text-white text-sm font-medium tracking-wide hover:bg-rust-600 transition-colors duration-200"
        >
          {t(lang, "continue_shopping")}
        </Link>
      </div>
    </div>
  );
}
