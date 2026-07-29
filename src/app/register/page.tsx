"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import GuestOnly from "@/components/auth/GuestOnly";

const RegisterSection = dynamic(() => import("./_components/RegisterSection"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
  ssr: false,
});

export default function RegisterPage() {
  return (
    <GuestOnly>
      <div className="min-h-screen bg-sunken">
        <section className="register-section section-padding fix bg-sunken py-10 px-4 sm:px-6 md:py-16 lg:py-20 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            <ErrorBoundary>
              <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
                <AnimatedSection>
                  <RegisterSection />
                </AnimatedSection>
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
      </div>
    </GuestOnly>
  );
}
