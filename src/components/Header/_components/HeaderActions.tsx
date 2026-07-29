"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import type { Locale } from "@/types";
import { useCart } from "@/hooks/useCart";
import useAuthStore from "@/store/authStore";
import useWishlistStore from "@/store/wishlistStore";
import HeaderCart from "./HeaderCart";
import HeaderLanguageSwitcher from "./HeaderLanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";

export interface HeaderActionsProps {
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  lang: Locale;
}

function formatBadge(count: number): string {
  return count > 99 ? "99+" : String(count);
}

export default function HeaderActions({
  cartOpen,
  setCartOpen,
  setSearchOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  lang,
}: HeaderActionsProps) {
  const [mounted, setMounted] = useState(false);
  const { itemCount } = useCart();
  const wishlistCount = useWishlistStore((state) => state.productIds.size);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Counts come from localStorage-backed stores, so they are only correct after
  // hydration. Rendering zeros on the first pass keeps SSR and CSR identical.
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayItemCount = mounted ? itemCount : 0;
  const displayWishlistCount = mounted ? wishlistCount : 0;
  const displayAuthenticated = mounted && isAuthenticated;

  return (
    <div className="flex items-center gap-4 md:gap-6 lg:gap-10 shrink-0 z-10">
      <Link
        href={displayAuthenticated ? "/profile" : "/login"}
        className="text-ink hover:text-brand transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 rounded hidden sm:block"
        aria-label={displayAuthenticated ? "Go to profile" : "Sign in"}
      >
        <User className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
      </Link>

      {displayAuthenticated && (
        <Link
          href="/wishlist"
          className="text-ink hover:text-brand transition-colors duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 rounded hidden sm:flex"
          aria-label={`Wishlist${displayWishlistCount > 0 ? `, ${displayWishlistCount} items` : ""}`}
        >
          <Heart className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          {displayWishlistCount > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-critical text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium px-1"
              aria-hidden="true"
            >
              {formatBadge(displayWishlistCount)}
            </span>
          )}
        </Link>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setCartOpen((open) => !open)}
          className="text-ink hover:text-brand transition-colors duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 rounded"
          aria-label={`Shopping cart${displayItemCount > 0 ? `, ${displayItemCount} items` : ""}`}
          aria-expanded={cartOpen}
        >
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          {displayItemCount > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-critical text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
              aria-hidden="true"
            >
              {formatBadge(displayItemCount)}
            </span>
          )}
        </button>
        <HeaderCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="text-ink hover:text-brand transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 rounded"
        aria-label="Open search"
      >
        <Search className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
      </button>

      <ThemeToggle className="hidden sm:inline-flex" />

      <HeaderLanguageSwitcher lang={lang} />

      <button
        type="button"
        onClick={() => setMobileMenuOpen((open) => !open)}
        className="lg:hidden flex flex-col space-y-1.5 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 rounded"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
      >
        <span
          className={`w-6 h-0.5 bg-ink transition-all duration-300 ${
            mobileMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
          aria-hidden="true"
        />
        <span
          className={`w-6 h-0.5 bg-ink transition-all duration-300 ${
            mobileMenuOpen ? "opacity-0" : ""
          }`}
          aria-hidden="true"
        />
        <span
          className={`w-6 h-0.5 bg-ink transition-all duration-300 ${
            mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
