"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import type { Locale } from "@/types";

export interface HeaderLanguageSwitcherProps {
  lang: Locale;
}

/**
 * Toggles the `language` cookie and refreshes the route so every Server
 * Component re-renders in the new locale. `router.refresh()` replaces the old
 * full-page reload, which discarded client state for no reason.
 */
export default function HeaderLanguageSwitcher({ lang }: HeaderLanguageSwitcherProps) {
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLang: Locale = lang === "ar" ? "en" : "ar";
    Cookies.set("language", nextLang, { path: "/", sameSite: "lax", expires: 365 });
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="text-ink hover:text-orange-500 transition-colors duration-300 font-medium uppercase tracking-wide text-sm md:text-base"
      aria-label={`Switch to ${lang === "ar" ? "English" : "Arabic"}`}
    >
      {lang === "ar" ? "EN" : "AR"}
    </button>
  );
}
