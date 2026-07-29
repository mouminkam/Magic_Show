"use client";

import { memo } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { ProductSummary } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { getProductMediumUrl } from "@/lib/utils/imageUtils";
import OptimizedImage from "@/components/ui/OptimizedImage";
import WishlistButton from "@/components/WishlistButton/WishlistButton";

export interface ProductCardProps {
  product: ProductSummary;
  /** Set on above-the-fold cards so their image is not lazy-loaded. */
  priority?: boolean;
}

function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addLine } = useCart();

  return (
    <Link href={`/shop/${product.id}`} className="block">
      <div className="group relative cursor-pointer bg-surface border border-ink-100 overflow-hidden transition-all duration-500 ease-out flex flex-col will-change-transform hover:shadow-[0_24px_48px_-24px_rgba(22,19,17,0.25)]">
        {product.discount !== null && (
          <div className="absolute top-3 left-3 bg-rust-500 text-white text-[11px] font-semibold tracking-wide px-2.5 py-1 z-10">
            −{product.discount}%
          </div>
        )}

        <div className="relative w-full aspect-[3/4] overflow-hidden shrink-0 bg-ink-50">
          <OptimizedImage
            src={getProductMediumUrl(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            priority={priority}
          />

          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <WishlistButton productId={product.id} variant="overlay" />
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-ink-900 hover:text-white transition-all duration-200"
              onClick={(event) => {
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
              <ShoppingCart className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 justify-between border-t border-ink-100">
          <p className="text-ink-400 text-[11px] uppercase tracking-[0.12em] mb-1.5">{product.category}</p>
          <h3 className="font-display text-[15px] text-ink-900 mb-2.5 leading-snug line-clamp-2">{product.name}</h3>
          <div className="flex items-baseline gap-2 mt-auto">
            {product.originalPrice !== null && (
              <span className="text-ink-400 text-sm line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-semibold text-ink-900">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ProductCard);
