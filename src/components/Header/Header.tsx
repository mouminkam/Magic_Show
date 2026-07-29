"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/types";
import { t, type TranslationKey } from "@/locales/i18n/getTranslation";
import HeaderActions from "./_components/HeaderActions";
import HeaderLogo from "./_components/HeaderLogo";
import HeaderMobileMenu from "./_components/HeaderMobileMenu";
import HeaderNavigation from "./_components/HeaderNavigation";
import HeaderSearch from "./_components/HeaderSearch";

export interface NavItem {
  key: string;
  name: string;
  href: string;
}

export interface HeaderProps {
  /** Locale resolved on the server, so the first render matches the markup. */
  lang: Locale;
}

const NAV_DEFINITION: Array<{ key: string; labelKey: TranslationKey; href: string }> = [
  { key: "home", labelKey: "home", href: "/" },
  { key: "shop", labelKey: "shop", href: "/shop" },
  { key: "stores", labelKey: "stores", href: "/stores" },
  { key: "blog", labelKey: "blog", href: "/blog" },
  { key: "contact", labelKey: "contact", href: "/contact-us" },
  { key: "about", labelKey: "about", href: "/about-us" },
];

export default function Header({ lang }: HeaderProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = NAV_DEFINITION.map(({ key, labelKey, href }) => ({
    key,
    name: t(lang, labelKey),
    href,
  }));

  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 w-full h-20 bg-surface z-50 border-b border-line shadow-[var(--shadow-sm)]">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full lg:mx-12">
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>

            <div className="hidden lg:flex flex-1 justify-center">
              <HeaderNavigation navItems={navItems} />
            </div>

            <div className="flex-shrink-0">
              <HeaderActions
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
                setSearchOpen={setSearchOpen}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </header>

      <HeaderMobileMenu
        isOpen={mobileMenuOpen}
        navItems={navItems}
        onClose={() => setMobileMenuOpen(false)}
      />

      <HeaderSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} lang={lang} />
    </>
  );
}
