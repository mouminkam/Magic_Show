"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import useWishlistStore from "@/store/wishlistStore";

/**
 * Restores the session from `localStorage` on first mount and, when a session
 * exists, pulls the wishlist so the header badge is correct on every page.
 * Rendered once from the root layout.
 */
export default function AuthHydrator() {
  useEffect(() => {
    useAuthStore.getState().hydrateFromStorage();

    if (useAuthStore.getState().isAuthenticated) {
      void useWishlistStore.getState().fetchWishlist();
    }
  }, []);

  return null;
}
