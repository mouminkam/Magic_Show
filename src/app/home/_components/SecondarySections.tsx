import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { HomeReviewCard, Locale, SectionPayload } from "@/types";
import type {
  FeaturedProductsData,
  LatestBlogData,
  NewsletterSectionData,
  ProductSectionData,
  WhyChooseUsData,
} from "@/mocks";
import SectionBoundary from "@/components/ui/SectionBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

const NewArrivals = dynamic(() => import("./NewArrivals"), {
  loading: () => <SectionSkeleton variant="grid" cardCount={4} height="h-screen" />,
});

const BestSellers = dynamic(() => import("./BestSellers"), {
  loading: () => <SectionSkeleton variant="grid" cardCount={4} height="h-screen" />,
});

const FeaturedProducts = dynamic(() => import("./FeaturedProducts"), {
  loading: () => <SectionSkeleton variant="grid" cardCount={6} height="h-screen" />,
});

const WhyChooseUs = dynamic(() => import("./WhyChooseUs"), {
  loading: () => <SectionSkeleton variant="default" height="h-64" />,
});

const CustomerReviews = dynamic(() => import("./CustomerReviews"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
});

const LatestBlogSection = dynamic(() => import("./LatestBlogSection"), {
  loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-96" />,
});

const Newsletter = dynamic(() => import("./Newsletter"), {
  loading: () => <SectionSkeleton variant="default" height="h-64" />,
});

/**
 * Promises handed down from the page so all below-the-fold sections resolve in
 * parallel while the hero is already streaming to the browser.
 */
export interface SecondarySectionPromises {
  newArrivals: Promise<SectionPayload<ProductSectionData>>;
  bestSellers: Promise<SectionPayload<ProductSectionData>>;
  featuredProducts: Promise<SectionPayload<FeaturedProductsData>>;
  whyChooseUs: Promise<SectionPayload<WhyChooseUsData>>;
  customerReviews: Promise<SectionPayload<HomeReviewCard[]>>;
  latestBlog: Promise<SectionPayload<LatestBlogData>>;
  newsletter: Promise<SectionPayload<NewsletterSectionData>>;
}

export interface SecondarySectionsProps {
  promises: SecondarySectionPromises;
  lang: Locale;
}

export default async function SecondarySections({
  promises,
  lang,
}: SecondarySectionsProps) {
  const [
    newArrivals,
    bestSellers,
    featuredProducts,
    whyChooseUs,
    customerReviews,
    latestBlog,
    newsletter,
  ] = await Promise.all([
    promises.newArrivals,
    promises.bestSellers,
    promises.featuredProducts,
    promises.whyChooseUs,
    promises.customerReviews,
    promises.latestBlog,
    promises.newsletter,
  ]);

  return (
    <div className="bg-surface">
      {newArrivals.enabled ? (
        <SectionBoundary>
          <Suspense fallback={<SectionSkeleton variant="grid" cardCount={4} height="h-screen" />}>
            <NewArrivals
              products={newArrivals.data.products}
              header={newArrivals.data.header}
            />
          </Suspense>
        </SectionBoundary>
      ) : null}

      {bestSellers.enabled ? (
        <SectionBoundary>
          <Suspense fallback={<SectionSkeleton variant="grid" cardCount={4} height="h-screen" />}>
            <BestSellers
              products={bestSellers.data.products}
              header={bestSellers.data.header}
            />
          </Suspense>
        </SectionBoundary>
      ) : null}

      {featuredProducts.enabled ? (
        <SectionBoundary>
          <Suspense fallback={<SectionSkeleton variant="grid" cardCount={6} height="h-screen" />}>
            <FeaturedProducts
              featuredHeader={featuredProducts.data.featuredHeader}
              featuredProducts={featuredProducts.data.featuredProducts}
            />
          </Suspense>
        </SectionBoundary>
      ) : null}

      {whyChooseUs.enabled ? (
        <SectionBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" height="h-64" />}>
            <WhyChooseUs
              features={whyChooseUs.data.features}
              title={whyChooseUs.data.title}
              subtitle={whyChooseUs.data.subtitle}
              lang={lang}
            />
          </Suspense>
        </SectionBoundary>
      ) : null}

      {customerReviews.enabled ? (
        <SectionBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
            <CustomerReviews reviews={customerReviews.data} lang={lang} />
          </Suspense>
        </SectionBoundary>
      ) : null}

      {latestBlog.enabled ? (
        <SectionBoundary>
          <Suspense fallback={<SectionSkeleton variant="grid" cardCount={3} height="h-96" />}>
            <LatestBlogSection data={latestBlog.data} />
          </Suspense>
        </SectionBoundary>
      ) : null}

      {newsletter.enabled ? (
        <SectionBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" height="h-64" />}>
            <Newsletter header={newsletter.data} />
          </Suspense>
        </SectionBoundary>
      ) : null}
    </div>
  );
}
