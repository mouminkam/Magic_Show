import { Suspense } from "react";
import type { Metadata } from "next";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { api } from "@/mocks";
import StoresStream from "./_components/StoresStream";

export const metadata: Metadata = {
  title: "Our Stores - Magic Show",
  description:
    "Find Magic Show stores near you. Visit our locations for an in-person shopping experience and personalized service.",
  keywords: ["stores", "locations", "visit us", "find store", "store locator"],
  openGraph: {
    title: "Our Stores - Magic Show",
    description: "Find our stores near you",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function StoresPage() {
  const storesPagePromise = api.content.getStoresPage();

  return (
    <div className="bg-surface min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
          <StoresStream storesPagePromise={storesPagePromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
