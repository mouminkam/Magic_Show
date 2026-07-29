"use client";

import type { FeaturedProductCardData, SectionHeader } from "@/types";
import FeaturedHeaderSection from "./FeaturedHeaderSection";
import FeaturedProductCard, { type FeaturedCardLayout } from "./FeaturedProductCard";

export interface FeaturedProductsProps {
  featuredHeader: SectionHeader;
  featuredProducts: FeaturedProductCardData[];
}

/**
 * Fixed grid placement per position, which is what gives the section its
 * masonry look regardless of how many products the data layer returns.
 */
const LAYOUT_TEMPLATE: FeaturedCardLayout[] = [
  { width: 600, height: 800 },
  { width: 600, height: 800 },
  {
    colSpan: "md:col-span-2 xl:col-span-2",
    rowSpan: "xl:row-span-4",
    width: 600,
    height: 1200,
  },
  {
    colSpan: "md:col-span-2 xl:col-span-2",
    rowSpan: "xl:row-span-2",
    width: 600,
    height: 800,
  },
  { width: 600, height: 800 },
  { width: 600, height: 800 },
];

/** Non-null because `LAYOUT_TEMPLATE` is a non-empty literal. */
const FALLBACK_LAYOUT: FeaturedCardLayout = { width: 600, height: 800 };

export default function FeaturedProducts({
  featuredHeader,
  featuredProducts,
}: FeaturedProductsProps) {
  if (featuredProducts.length === 0) return null;

  return (
    <section className="w-full overflow-hidden py-12 lg:py-16 bg-surface">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-4 w-full h-auto xl:h-[200vh]">
        <FeaturedHeaderSection header={featuredHeader} />

        {featuredProducts.map((product, index) => (
          <FeaturedProductCard
            key={product.id}
            product={product}
            layout={LAYOUT_TEMPLATE[index % LAYOUT_TEMPLATE.length] ?? FALLBACK_LAYOUT}
          />
        ))}
      </div>
    </section>
  );
}
