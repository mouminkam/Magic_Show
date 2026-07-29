"use client";

import Image from "next/image";
import { calculateShipping, calculateSubtotal } from "@/mocks";
import { formatPrice } from "@/lib/utils/formatters";
import { getProductThumbUrl } from "@/lib/utils/imageUtils";
import useCartStore, { cartItemKey } from "@/store/cartStore";
import useCheckoutCoupon from "./useCheckoutCoupon";

export default function OrderSummary() {
  const items = useCartStore((state) => state.items);
  const coupon = useCheckoutCoupon((state) => state.coupon);

  const subtotal = calculateSubtotal(items);
  const discount = coupon?.discountAmount ?? 0;
  const shipping = calculateShipping(subtotal - discount);
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div className="bg-ink-50 border border-ink-100 p-6 h-fit">
      <h2 className="font-display text-xl text-ink-900 mb-5">Order Summary</h2>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          // Keyed on the full line identity: the same product in two sizes is
          // two rows and must not share a key.
          <div key={cartItemKey(item)} className="flex gap-3">
            <div className="w-14 h-14 relative flex-shrink-0 bg-surface border border-ink-100">
              <Image
                src={getProductThumbUrl(item)}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{item.name}</p>
              <p className="text-xs text-ink-400">
                Qty: {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <div className="text-sm font-semibold text-ink-900">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-ink-200 pt-4">
        <div className="flex justify-between text-sm text-ink-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-positive">
            <span>Discount ({coupon?.code})</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-ink-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between items-baseline font-semibold text-ink-900 text-lg pt-2 border-t border-ink-200">
          <span className="text-sm uppercase tracking-wide font-medium">Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
