"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CartItem } from "@/types";

export interface CartItemEditModalProps {
  item: CartItem;
  onSave: (attributes: Pick<CartItem, "size" | "color">) => void;
  onClose: () => void;
}

/** Lets a shopper change the size or colour of a line already in the cart. */
export default function CartItemEditModal({
  item,
  onSave,
  onClose,
}: CartItemEditModalProps) {
  const [size, setSize] = useState(item.size ?? "");
  const [color, setColor] = useState(item.color ?? "");

  useEffect(() => {
    setSize(item.size ?? "");
    setColor(item.color ?? "");
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ size: size.trim() || null, color: color.trim() || null });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-edit-modal-title"
    >
      <div className="bg-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-line">
          <h2 id="cart-edit-modal-title" className="text-lg font-semibold text-ink">
            Edit item
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md text-muted hover:bg-sunken focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-muted truncate">{item.name}</p>

          <div>
            <label htmlFor="edit-size" className="block text-sm font-medium text-ink mb-1">
              Size
            </label>
            <input
              id="edit-size"
              type="text"
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="w-full border border-line-strong rounded-md py-2 px-3 text-ink"
              placeholder="e.g. 38"
            />
          </div>

          <div>
            <label htmlFor="edit-color" className="block text-sm font-medium text-ink mb-1">
              Color
            </label>
            <input
              id="edit-color"
              type="text"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="w-full border border-line-strong rounded-md py-2 px-3 text-ink"
              placeholder="e.g. Black"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-line-strong rounded-md text-ink hover:bg-sunken focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
