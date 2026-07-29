import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { ProductDetail } from "@/types";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

const ProductSection = dynamic(() => import("./ProductSection"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
});

export interface ProductDetailSectionProps {
  product: ProductDetail;
}

export default function ProductDetailSection({ product }: ProductDetailSectionProps) {
  return (
    <div className="product-detail-page">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <AnimatedSection>
            <ProductSection product={product} />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
