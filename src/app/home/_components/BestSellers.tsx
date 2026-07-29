"use client";

import type { ProductSummary, SectionHeader } from "@/types";
import BestSellerCard from "./BestSellerCard";

export interface BestSellersProps {
  products: ProductSummary[];
  header: SectionHeader;
}

export default function BestSellers({ products, header }: BestSellersProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          {header.subtitle && (
            <p className="text-sm uppercase tracking-widest text-muted mb-2">
              {header.subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
            {header.title}
          </h2>
          {header.description && (
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto mb-6">
              {header.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.slice(0, 8).map((product) => (
            <BestSellerCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
