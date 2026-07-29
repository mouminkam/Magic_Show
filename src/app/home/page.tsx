import { Suspense } from "react";
import type { Metadata } from "next";
import { api } from "@/mocks";
import { getLanguage } from "@/lib/getLanguage";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import FeaturedCategories from "./_components/FeaturedCategories";
import HomeBanner from "./_components/HomeBanner";
import SecondarySections, { type SecondarySectionPromises } from "./_components/SecondarySections";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Heels, boots, sandals, sneakers, bags and jewelry lasted by hand in Damascus. Browse the current Magic Show collection.",
  keywords: ["shoes", "fashion", "accessories", "footwear", "online shopping"],
  openGraph: {
    title: "Magic Show — Footwear & Leather Goods",
    description: "Built to be resoled, not replaced.",
    type: "website",
  },
};

export default async function HomePage() {
  const lang = await getLanguage();

  // Above-the-fold sections are awaited; everything below streams in.
  const [hero, featuredCategories] = await Promise.all([
    api.content.getHomeHero(),
    api.content.getFeaturedCategories(),
  ]);

  const secondaryPromises: SecondarySectionPromises = {
    newArrivals: api.content.getNewArrivals(),
    bestSellers: api.content.getBestSellers(),
    featuredProducts: api.content.getFeaturedProducts(),
    whyChooseUs: api.content.getWhyChooseUs(),
    customerReviews: api.content.getCustomerReviews(),
    latestBlog: api.content.getLatestBlog(),
    newsletter: api.content.getNewsletter(),
  };

  return (
    <div className="bg-surface min-h-screen">
      {hero.enabled ? <HomeBanner hero={hero.data} /> : null}

      {featuredCategories.enabled ? (
        <FeaturedCategories
          categories={featuredCategories.data.categories}
          title={featuredCategories.data.title}
          subtitle={featuredCategories.data.subtitle}
          lang={lang}
        />
      ) : null}

      <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
        <SecondarySections promises={secondaryPromises} lang={lang} />
      </Suspense>
    </div>
  );
}
