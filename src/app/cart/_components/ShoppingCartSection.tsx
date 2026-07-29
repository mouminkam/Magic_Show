"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/types";
import { calculateShipping, calculateSubtotal } from "@/mocks";
import { useCart } from "@/hooks/useCart";
import { cartItemKey } from "@/store/cartStore";
import Button from "@/components/Button";
import CartEmptyState from "./CartEmptyState";
import CartItemEditModal from "./CartItemEditModal";
import CartItemRow from "./CartItemRow";
import CartOrderSummary from "./CartOrderSummary";

/** Lines shown before the "Show more" toggle appears. */
const COLLAPSED_ROW_COUNT = 3;

export default function ShoppingCartSection() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, updateCartItem } = useCart();
  const [showAll, setShowAll] = useState(false);
  const [editItem, setEditItem] = useState<CartItem | null>(null);

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(subtotal);
  const visibleItems = showAll ? items : items.slice(0, COLLAPSED_ROW_COUNT);

  return (
    <div className="min-h-screen bg-surface">
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display text-3xl text-ink-900 mb-1">Your cart</h1>
          <p className="text-ink-400 text-sm mb-8">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
            <div className="w-full lg:flex-1 space-y-8">
              {visibleItems.map((item) => (
                <CartItemRow
                  key={cartItemKey(item)}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onEdit={setEditItem}
                />
              ))}

              {items.length > COLLAPSED_ROW_COUNT && (
                <div className="text-center pt-2">
                  <Button
                    onClick={() => setShowAll((value) => !value)}
                    variant="outline"
                    size="md"
                  >
                    {showAll ? "Show Less" : `Show ${items.length - COLLAPSED_ROW_COUNT} More`}
                  </Button>
                </div>
              )}
            </div>

            <div className="w-full lg:w-[380px] lg:sticky lg:top-28 shrink-0">
              <CartOrderSummary
                subtotal={subtotal}
                shipping={shipping}
                total={subtotal + shipping}
                onCheckout={() => router.push("/checkout")}
              />
            </div>
          </div>

          {editItem && (
            <CartItemEditModal
              item={editItem}
              onSave={(attributes) => updateCartItem(editItem, attributes)}
              onClose={() => setEditItem(null)}
            />
          )}
        </div>
      </section>
    </div>
  );
}
