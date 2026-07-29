import { Suspense } from "react";
import type { Metadata } from "next";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { api } from "@/mocks";
import ContactUsStream from "./_components/ContactUsStream";

export const metadata: Metadata = {
  title: "Contact Us - Magic Show",
  description:
    "Get in touch with Magic Show. Find our location, contact details and send us a message. We are here to help.",
  keywords: ["contact", "customer service", "location", "support", "get in touch"],
  openGraph: {
    title: "Contact Us - Magic Show",
    description: "Get in touch with us",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ContactUsPage() {
  const contactPagePromise = api.content.getContactPage();

  return (
    <div className="bg-surface min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
          <ContactUsStream contactPagePromise={contactPagePromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
