"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { resolveImageUrl } from "@/lib/utils/imageUtils";
import { cartItemKey } from "@/store/cartStore";
import OptimizedImage from "@/components/ui/OptimizedImage";

export interface HeaderCartProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Mini-cart dropdown anchored under the header cart button. */
export default function HeaderCart({ isOpen, onClose }: HeaderCartProps) {
  const { items, total, removeFromCart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && !dropdownRef.current?.contains(target)) {
        onClose();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 z-[60] w-72 md:w-80 bg-surface shadow-2xl border border-ink-100 mt-4 p-4 md:p-6 animate-in fade-in slide-in-from-top-2 duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-base md:text-lg text-ink-900">Shopping Cart</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-ink-400 hover:text-ink-900 transition-colors focus:outline-none focus:ring-2 focus:ring-rust-500 focus:ring-offset-2 rounded"
          aria-label="Close cart"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 md:space-y-4 mb-4 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-ink-400 text-center py-4">Your cart is empty</p>
        ) : (
          items.map((item) => (
            <div
              key={cartItemKey(item)}
              className="flex items-center justify-between py-2 border-b border-ink-100"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-ink-50 border border-ink-100 shrink-0">
                  <OptimizedImage
                    src={resolveImageUrl(item.image)}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900 truncate">{item.name}</p>
                  <p className="text-sm text-ink-400">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item)}
                className="text-ink-400 hover:text-critical transition-colors shrink-0 ml-2 focus:outline-none focus:ring-2 focus:ring-critical focus:ring-offset-2 rounded"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4 pt-2 border-t border-ink-100">
            <span className="text-ink-600 font-medium text-sm">Total:</span>
            <span className="text-lg font-semibold text-ink-900">{formatPrice(total)}</span>
          </div>

          <div className="space-y-2">
            <Link
              href="/checkout"
              className="w-full py-3 px-4 text-sm font-medium bg-ink-900 text-white hover:bg-rust-600 transition-colors duration-200 block text-center"
              onClick={onClose}
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              className="w-full py-3 px-4 text-sm font-medium border border-ink-200 bg-surface text-ink-700 hover:border-ink-900 transition-colors duration-200 block text-center"
              onClick={onClose}
            >
              View Cart
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
