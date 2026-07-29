"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Protected from "@/components/auth/Protected";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

const ShoppingCartSection = dynamic(() => import("./_components/ShoppingCartSection"), {
  loading: () => <SectionSkeleton variant="default" height="h-screen" />,
});

export default function CartPage() {
  return (
    <Protected redirectTo="/login?redirect=/cart">
      <div className="bg-surface min-h-screen">
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
            <ShoppingCartSection />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Protected>
  );
}
