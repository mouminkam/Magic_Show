import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import type { PageBanner } from "@/types";

// Lazy load sections with dynamic imports
const ContactHero = dynamic(() => import("./ContactHero"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
  ssr: true,
});

const ContactMap = dynamic(() => import("./ContactMap"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
  ssr: true,
});

const ContactDetails = dynamic(() => import("./ContactDetails"), {
  loading: () => <SectionSkeleton variant="default" height="h-64" />,
  ssr: true,
});

const ContactForm = dynamic(() => import("./ContactForm"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
  ssr: true,
});

export interface ContactSectionProps {
  contactHero: PageBanner | null;
  mapUrl: string;
  contactDetails: {
    title: string;
    address: string;
    email: string;
    phone: string;
    fax: string;
    aboutTitle: string;
    aboutText: string;
  } | null;
}

/**
 * ContactSection Component
 * Receives data as props from the parent Server Component
 * Each section is lazy loaded for better performance
 */
export default function ContactSection({
  contactHero = null,
  mapUrl,
  contactDetails = null,
}: ContactSectionProps) {
  return (
    <>
      {/* Hero Section - Lazy loaded */}
      <ErrorBoundary>
        <Suspense
          fallback={<SectionSkeleton variant="default" height="h-96" />}
        >
          <AnimatedSection>
            <ContactHero heroData={contactHero} />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>

      {/* Map and Details Section */}
      <section className="flex flex-col lg:flex-row bg-surface my-10 overflow-hidden">
        <div className="lg:w-1/2 w-full">
          {/* Map Section - Lazy loaded */}
          <ErrorBoundary>
            <Suspense
              fallback={<SectionSkeleton variant="default" height="h-96" />}
            >
              <AnimatedSection>
                <ContactMap mapUrl={mapUrl} />
              </AnimatedSection>
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="lg:w-1/2 w-full lg:py-0 lg:px-10 lg:ml-10 max-lg:my-10 max-lg:mx-5 overflow-hidden">
          <div className="max-w-4xl">
            {/* Contact Details Section - Lazy loaded */}
            <ErrorBoundary>
              <Suspense
                fallback={<SectionSkeleton variant="default" height="h-64" />}
              >
                <AnimatedSection>
                  <ContactDetails contactDetails={contactDetails} />
                </AnimatedSection>
              </Suspense>
            </ErrorBoundary>

            {/* Contact Form Section - Lazy loaded */}
            <ErrorBoundary>
              <Suspense
                fallback={<SectionSkeleton variant="default" height="h-96" />}
              >
                <AnimatedSection>
                  <ContactForm companyEmail={contactDetails?.email} />
                </AnimatedSection>
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </section>
    </>
  );
}
