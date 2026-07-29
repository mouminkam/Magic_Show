import { create } from "zustand";
import type { WishlistItem } from "@/types";
import { api } from "@/mocks";
import apiErrorMessage from "@/lib/apiErrorMessage";

/**
 * Wishlist state. Requires an authenticated session — every mutation short
 * circuits with `loginRequired` when there is no token.
 */

export interface WishlistResult {
  success: boolean;
  loginRequired?: boolean;
  error?: string;
}

export interface WishlistState {
  items: WishlistItem[];
  productIds: Set<number>;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchWishlist: (options?: { force?: boolean }) => Promise<void>;
  addToWishlist: (productId: number) => Promise<WishlistResult>;
  removeFromWishlist: (productId: number) => Promise<WishlistResult>;
  toggleWishlist: (productId: number) => Promise<WishlistResult>;
  isInWishlist: (productId: number | string | null | undefined) => boolean;
  clear: () => void;
  itemCount: () => number;
}

function hasSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("auth-token") !== null;
}

function idsOf(items: WishlistItem[]): Set<number> {
  return new Set(items.map((item) => item.productId));
}

const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  productIds: new Set<number>(),
  isLoading: false,
  error: null,
  hasFetched: false,

  fetchWishlist: async ({ force = false } = {}) => {
    if (!hasSession()) {
      set({ items: [], productIds: new Set(), hasFetched: false, isLoading: false });
      return;
    }
    if (get().isLoading) return;
    if (get().hasFetched && !force) return;

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.wishlist.list();
      set({
        items: data.items,
        productIds: idsOf(data.items),
        isLoading: false,
        hasFetched: true,
      });
    } catch (error) {
      set({
        items: [],
        productIds: new Set(),
        isLoading: false,
        hasFetched: false,
        error: apiErrorMessage(error),
      });
    }
  },

  addToWishlist: async (productId) => {
    if (!hasSession()) return { success: false, loginRequired: true };

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.wishlist.add(productId);
      set({
        items: data.items,
        productIds: idsOf(data.items),
        isLoading: false,
        hasFetched: true,
      });
      return { success: true };
    } catch (error) {
      const message = apiErrorMessage(error);
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  removeFromWishlist: async (productId) => {
    if (!hasSession()) return { success: false, loginRequired: true };

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.wishlist.remove(productId);
      set({
        items: data.items,
        productIds: idsOf(data.items),
        isLoading: false,
        hasFetched: true,
      });
      return { success: true };
    } catch (error) {
      const message = apiErrorMessage(error);
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  toggleWishlist: async (productId) => {
    return get().productIds.has(productId)
      ? get().removeFromWishlist(productId)
      : get().addToWishlist(productId);
  },

  isInWishlist: (productId) => {
    const id = Number(productId);
    return Number.isFinite(id) && get().productIds.has(id);
  },

  clear: () =>
    set({
      items: [],
      productIds: new Set(),
      error: null,
      hasFetched: false,
      isLoading: false,
    }),

  itemCount: () => get().productIds.size,
}));

export default useWishlistStore;
