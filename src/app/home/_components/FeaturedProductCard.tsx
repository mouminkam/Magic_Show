import Image from "next/image";
import Link from "next/link";
import type { FeaturedProductCardData } from "@/types";
import { resolveImageUrl } from "@/lib/utils/imageUtils";
import WishlistButton from "@/components/WishlistButton/WishlistButton";

/** Grid placement for a card in the masonry featured-products layout. */
export interface FeaturedCardLayout {
  colSpan?: string;
  rowSpan?: string;
  width: number;
  height: number;
}

export interface FeaturedProductCardProps {
  product: FeaturedProductCardData;
  layout: FeaturedCardLayout;
}

export default function FeaturedProductCard({ product, layout }: FeaturedProductCardProps) {
  const className = [
    "relative overflow-hidden group cursor-pointer aspect-square md:aspect-video xl:aspect-auto",
    layout.colSpan ?? "",
    layout.rowSpan ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={`/shop/${product.id}`} className={className}>
      <Image
        src={resolveImageUrl(product.image)}
        alt={product.alt}
        width={layout.width}
        height={layout.height}
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 md:gap-4 p-3 md:p-4">
        <h3 className="text-white text-base md:text-lg lg:text-xl xl:text-2xl font-semibold transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-50 text-center px-2">
          {product.name}
        </h3>
        <span className="bg-surface text-ink px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-full font-semibold text-sm md:text-base lg:text-lg transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
          SHOP NOW
        </span>

        <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex items-center justify-between px-3 md:px-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
          <div className="flex flex-col">
            {product.originalPrice !== product.discountedPrice && (
              <span className="text-white line-through text-xs md:text-sm opacity-70">
                {product.originalPrice}
              </span>
            )}
            <span className="text-brand text-base md:text-lg lg:text-xl xl:text-2xl font-bold">
              {product.discountedPrice}
            </span>
          </div>
          <WishlistButton
            productId={product.id}
            variant="white"
            className="bg-surface/20 hover:bg-surface/30 backdrop-blur-sm rounded-full p-2 md:p-3"
          />
        </div>
      </div>
    </Link>
  );
}
