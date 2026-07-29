"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Protected from "@/components/auth/Protected";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

const ProfileSection = dynamic(() => import("./_components/ProfileSection"), {
  loading: () => <SectionSkeleton variant="default" cardCount={2} height="h-screen" />,
  ssr: false,
});

export default function ProfilePage() {
  return (
    <Protected>
      <div className="min-h-screen bg-sunken py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <ErrorBoundary>
            <Suspense fallback={<SectionSkeleton variant="default" cardCount={2} height="h-screen" />}>
              <ProfileSection />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </Protected>
  );
}
