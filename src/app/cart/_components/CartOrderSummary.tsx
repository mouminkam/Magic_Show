"use client";

import Button from "@/components/Button";
import { formatPrice } from "@/lib/utils/formatters";
import { FREE_SHIPPING_THRESHOLD } from "@/mocks";

export interface CartOrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  onCheckout: () => void;
}

export default function CartOrderSummary({
  subtotal,
  shipping,
  total,
  onCheckout,
}: CartOrderSummaryProps) {
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="w-full bg-ink-50 border border-ink-100 p-6">
      <h3 className="font-display text-xl text-ink-900 mb-6">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-ink-600 text-sm">Subtotal</span>
          <span className="text-ink-900 font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-ink-200">
          <span className="text-ink-600 text-sm">Shipping</span>
          <span className="text-ink-900 font-medium">
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>

        {remainingForFreeShipping > 0 && (
          <p className="text-xs text-rust-600 bg-rust-50 px-3 py-2 -mt-1">
            Spend {formatPrice(remainingForFreeShipping)} more for free shipping.
          </p>
        )}

        <div className="flex justify-between items-center pt-1">
          <span className="text-ink-900 font-medium uppercase text-sm tracking-wide">Total</span>
          <span className="text-xl font-semibold text-ink-900">{formatPrice(total)}</span>
        </div>
      </div>

      <Button onClick={onCheckout} variant="primary" size="md" className="w-full mt-6">
        Proceed to Checkout
      </Button>
    </div>
  );
}
