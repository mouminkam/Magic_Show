"use client";

import { useCallback } from "react";
import type { CartItem, CartItemKey, Product } from "@/types";
import { toCartItem } from "@/mocks";
import { getLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import useCartStore from "@/store/cartStore";
import useToastStore from "@/store/toastStore";

export interface AddToCartOptions {
  size?: string | null;
  color?: string | null;
}

/**
 * Cart operations with user feedback. Components should use this rather than
 * `useCartStore` directly so every mutation raises the same toast.
 */
export function useCart() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantityInStore = useCartStore((state) => state.updateQuantity);
  const updateItemInStore = useCartStore((state) => state.updateItem);
  const clearCartInStore = useCartStore((state) => state.clearCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);

  const toastSuccess = useToastStore((state) => state.success);

  const addLine = useCallback(
    (item: CartItem) => {
      addItem(item);
      toastSuccess(t(getLanguageClient(), "product_added_to_cart"));
    },
    [addItem, toastSuccess]
  );

  const addProduct = useCallback(
    (product: Product, quantity = 1, options: AddToCartOptions = {}) => {
      addLine(toCartItem(product, quantity, options));
    },
    [addLine]
  );

  const removeFromCart = useCallback(
    (key: CartItemKey) => {
      removeItem(key);
      toastSuccess(t(getLanguageClient(), "product_removed_from_cart"));
    },
    [removeItem, toastSuccess]
  );

  const updateQuantity = useCallback(
    (key: CartItemKey, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(key);
        return;
      }
      updateQuantityInStore(key, quantity);
    },
    [updateQuantityInStore, removeFromCart]
  );

  const updateCartItem = useCallback(
    (key: CartItemKey, attributes: Partial<Pick<CartItem, "size" | "color">>) => {
      updateItemInStore(key, attributes);
      toastSuccess(t(getLanguageClient(), "cart_updated"));
    },
    [updateItemInStore, toastSuccess]
  );

  const clearCart = useCallback(() => {
    clearCartInStore();
    toastSuccess(t(getLanguageClient(), "cart_cleared"));
  }, [clearCartInStore, toastSuccess]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return {
    items,
    total,
    itemCount,
    isOpen,
    addLine,
    addProduct,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };
}
