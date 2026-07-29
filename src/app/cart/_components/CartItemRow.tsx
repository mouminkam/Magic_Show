"use client";

import Image from "next/image";
import { Minus, Pencil, Plus, X } from "lucide-react";
import type { CartItem, CartItemKey } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import { getProductThumbUrl } from "@/lib/utils/imageUtils";

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (key: CartItemKey, quantity: number) => void;
  onRemove: (key: CartItemKey) => void;
  onEdit: (item: CartItem) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  onEdit,
}: CartItemRowProps) {
  const attributes = [
    item.size ? `Size: ${item.size}` : null,
    item.color ? `Color: ${item.color}` : null,
  ].filter((value): value is string => value !== null);

  return (
    <div className="border-b border-ink-100 pb-8 last:border-b-0">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="w-24 h-24 sm:w-28 sm:h-28 relative shrink-0 bg-ink-50 border border-ink-100">
          <Image
            src={getProductThumbUrl(item)}
            alt={item.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base text-ink-900 mb-1">{item.name}</h3>
            <p className="text-ink-400 text-xs">Product code: {item.productId}</p>
            {attributes.length > 0 && (
              <p className="text-xs text-ink-400 mt-1">{attributes.join(" · ")}</p>
            )}
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-rust-600 hover:text-rust-700 focus:outline-none focus:ring-2 focus:ring-rust-500 rounded"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-2 shrink-0">
            <div className="flex items-center border border-ink-200">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                className="p-2 transition-colors text-ink-600 hover:bg-ink-900 hover:text-white"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-ink-900 text-sm font-medium min-w-10 text-center">
                {item.quantity.toString().padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                disabled={item.quantity >= item.maxQuantity}
                className="p-2 transition-colors text-ink-600 hover:bg-ink-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink-600"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-ink-900">
                {formatPrice(item.price * item.quantity)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="p-1 text-ink-400 hover:text-critical transition-colors"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
