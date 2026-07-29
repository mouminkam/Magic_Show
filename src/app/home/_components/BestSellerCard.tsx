"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { ProductSummary } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { getProductMediumUrl } from "@/lib/utils/imageUtils";
import WishlistButton from "@/components/WishlistButton/WishlistButton";

export interface BestSellerCardProps {
  product: ProductSummary;
}

export default function BestSellerCard({ product }: BestSellerCardProps) {
  const { addLine } = useCart();

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group relative cursor-pointer bg-surface border-2 border-line rounded-xl overflow-hidden transition-all duration-300 hover:border-line-strong flex flex-col h-full"
    >
      {product.discount !== null && (
        <div className="absolute top-4 left-4 bg-ink-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md z-10">
          -{product.discount}%
        </div>
      )}

      <div className="relative w-full aspect-[3/4] overflow-hidden bg-sunken">
        <Image
          src={getProductMediumUrl(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between border-t border-line">
        <div>
          <p className="text-faint text-xs font-medium uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h3 className="font-semibold text-ink mb-3 line-clamp-2 text-base leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-line">
          <div className="flex items-center gap-2">
            {product.originalPrice !== null && (
              <span className="text-faint text-sm line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-bold text-ink text-lg">{formatPrice(product.price)}</span>
          </div>

          <div className="flex gap-2">
            <WishlistButton productId={product.id} variant="minimal" />
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              className="w-9 h-9 bg-ink-900 hover:bg-ink-800 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
              onClick={(event) => {
                // The card is a link, so the click must not navigate.
                event.preventDefault();
                event.stopPropagation();
                addLine({
                  id: product.id,
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  image: product.image,
                  quantity: 1,
                  size: null,
                  color: null,
                  maxQuantity: Number.MAX_SAFE_INTEGER,
                });
              }}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
