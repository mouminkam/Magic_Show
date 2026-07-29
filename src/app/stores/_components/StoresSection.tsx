import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroBanner from "@/components/HeroBanner";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import type { PageBanner, Store } from "@/types";

// Lazy load sections with dynamic imports
const StoresListSection = dynamic(() => import("./StoresListSection"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
  ssr: true,
});

export interface StoresSectionProps {
  storesBanner?: PageBanner | null;
  stores?: Store[];
  className?: string;
}

/**
 * StoresSection Component
 * Receives data as props from the parent Server Component
 * Each section is lazy loaded for better performance
 */
export default function StoresSection({
  storesBanner = null,
  stores = [],
  className = "",
}: StoresSectionProps) {
  return (
    <div className={className}>
      {/* Hero Banner - Loaded immediately (first section) */}
      <ErrorBoundary>
        <AnimatedSection>
          <HeroBanner banner={storesBanner} showGradient />
        </AnimatedSection>
      </ErrorBoundary>

      {/* Stores List Section - Lazy loaded */}
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <AnimatedSection>
            <StoresListSection stores={stores} />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
