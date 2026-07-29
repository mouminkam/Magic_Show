"use client";

import Link from "next/link";
import type { ProductSummary } from "@/types";
import { getProductMediumUrl } from "@/lib/utils/imageUtils";
import TiltedCard from "@/components/ui/TiltedCard";

export interface NewArrivalCardProps {
  product: ProductSummary;
}

export default function NewArrivalCard({ product }: NewArrivalCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="flex flex-col h-full">
      <div className="relative w-full aspect-[3/4]">
        <TiltedCard
          imageSrc={getProductMediumUrl(product)}
          altText={product.name}
          captionText={product.name}
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="100%"
          scaleOnHover={1.05}
          rotateAmplitude={14}
          showTooltip
        />
      </div>
    </Link>
  );
}
