import { Suspense } from "react";
import type { Metadata } from "next";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { getLanguage } from "@/lib/getLanguage";
import { api } from "@/mocks";
import AboutUsStream from "./_components/AboutUsStream";

export const metadata: Metadata = {
  title: "About Us - Magic Show",
  description:
    "Learn about Magic Show, our mission, team and commitment to providing premium fashion products and exceptional customer service.",
  keywords: ["about us", "our story", "team", "company", "fashion brand"],
  openGraph: {
    title: "About Us - Magic Show",
    description: "Learn about our mission and team",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AboutUsPage() {
  const lang = await getLanguage();
  const aboutPagePromise = api.content.getAboutPage();

  return (
    <div className="bg-surface min-h-screen">
      <ErrorBoundary>
        <Suspense
          fallback={<SectionSkeleton variant="default" height="h-screen" />}
        >
          <AboutUsStream aboutPagePromise={aboutPagePromise} lang={lang} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
