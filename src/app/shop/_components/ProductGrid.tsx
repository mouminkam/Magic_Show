import type { ProductSummary } from "@/types";
import ProductCard from "./ProductCard";

export interface ProductGridProps {
  products: ProductSummary[];
}

/** Number of leading cards that skip lazy-loading. */
const PRIORITY_CARD_COUNT = 3;

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < PRIORITY_CARD_COUNT}
        />
      ))}
    </div>
  );
}
