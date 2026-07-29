import type { ApiResponse, WishlistItem } from "@/types";
import { toWishlistItem } from "../data/account";
import { productById } from "../data/products";
import { fail, respond } from "../runtime";
import { mockDb } from "../store";

/** Saved-items list, persisted in the mock store so it survives reloads. */

function currentItems(): WishlistItem[] {
  const addedAt = new Date().toISOString();
  return mockDb
    .getWishlistProductIds()
    .map((id) => toWishlistItem(id, addedAt))
    .filter((item): item is WishlistItem => item !== null);
}

export const wishlistService = {
  async list(): Promise<ApiResponse<{ items: WishlistItem[] }>> {
    return respond({ items: currentItems() });
  },

  async add(productId: number): Promise<ApiResponse<{ items: WishlistItem[] }>> {
    if (!productById.has(productId)) {
      return fail(`Product ${productId} was not found.`, 404, "PRODUCT_NOT_FOUND");
    }
    mockDb.setWishlistProductIds([...mockDb.getWishlistProductIds(), productId]);
    return respond({ items: currentItems() });
  },

  async remove(productId: number): Promise<ApiResponse<{ items: WishlistItem[] }>> {
    mockDb.setWishlistProductIds(
      mockDb.getWishlistProductIds().filter((id) => id !== productId)
    );
    return respond({ items: currentItems() });
  },

  async check(productIds: number[]): Promise<ApiResponse<Record<number, boolean>>> {
    const saved = new Set(mockDb.getWishlistProductIds());
    const result: Record<number, boolean> = {};
    for (const id of productIds) {
      result[id] = saved.has(id);
    }
    return respond(result);
  },
};
