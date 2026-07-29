import { create } from "zustand";
import type { CartItem, CartItemKey } from "@/types";

/**
 * Shopping cart state, persisted to `localStorage`.
 *
 * A cart line is identified by the tuple `(id, size, color)` — the same product
 * in two sizes is two independent lines.
 */

const STORAGE_KEY = "cart-items";

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number"
  );
}

function readStoredItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or blocked; the in-memory cart still works for this session.
  }
}

function sameLine(item: CartItem, key: CartItemKey): boolean {
  return (
    item.id === key.id &&
    (item.size ?? null) === (key.size ?? null) &&
    (item.color ?? null) === (key.color ?? null)
  );
}

/** Stable React key for a cart line. */
export function cartItemKey(item: CartItemKey): string {
  return `${item.id}-${item.size ?? ""}-${item.color ?? ""}`;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (key: CartItemKey) => void;
  updateQuantity: (key: CartItemKey, quantity: number) => void;
  updateItem: (key: CartItemKey, attributes: Partial<Pick<CartItem, "size" | "color">>) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const useCartStore = create<CartState>((set, get) => ({
  items: readStoredItems(),
  isOpen: false,

  addItem: (item) => {
    const items = get().items;
    const existingIndex = items.findIndex((existing) => sameLine(existing, item));

    const updated =
      existingIndex >= 0
        ? items.map((existing, index) =>
            index === existingIndex
              ? {
                  ...existing,
                  // Never let a line exceed available stock.
                  quantity: Math.min(
                    existing.quantity + item.quantity,
                    existing.maxQuantity || Number.MAX_SAFE_INTEGER
                  ),
                }
              : existing
          )
        : [...items, item];

    persist(updated);
    set({ items: updated });
  },

  removeItem: (key) => {
    const updated = get().items.filter((item) => !sameLine(item, key));
    persist(updated);
    set({ items: updated });
  },

  updateQuantity: (key, quantity) => {
    if (quantity <= 0) {
      get().removeItem(key);
      return;
    }
    const updated = get().items.map((item) =>
      sameLine(item, key)
        ? { ...item, quantity: Math.min(quantity, item.maxQuantity || Number.MAX_SAFE_INTEGER) }
        : item
    );
    persist(updated);
    set({ items: updated });
  },

  updateItem: (key, attributes) => {
    const updated = get().items.map((item) =>
      sameLine(item, key) ? { ...item, ...attributes } : item
    );
    persist(updated);
    set({ items: updated });
  },

  clearCart: () => {
    persist([]);
    set({ items: [] });
  },

  setItems: (items) => {
    persist(items);
    set({ items });
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getTotal: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
}));

export default useCartStore;
