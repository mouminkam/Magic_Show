import { Suspense } from "react";
import type { Metadata } from "next";
import type { ProductQuery, ProductSortKey } from "@/types";
import { api } from "@/mocks";
import { getLanguage } from "@/lib/getLanguage";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import ShopBannerStream from "./_components/ShopBannerStream";
import ShopProductsStream from "./_components/ShopProductsStream";
import ShopShell from "./_components/ShopShell";
import SidebarControls from "./_components/SidebarControls";
import TopControls from "./_components/TopControls";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse 44 styles across heels, boots, sandals, sneakers, flats, bags, accessories and jewelry.",
  keywords: ["shop", "shoes", "heels", "boots", "sandals", "sneakers", "bags"],
  openGraph: {
    title: "Shop · Magic Show",
    description: "Browse the full Magic Show collection.",
    type: "website",
  },
};

/** Raw `searchParams` as Next.js delivers them. */
type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function toNumber(value: string | string[] | undefined): number | undefined {
  const raw = firstValue(value);
  if (raw === undefined || raw.trim() === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const SORT_KEYS: ProductSortKey[] = [
  "newest",
  "oldest",
  "price-asc",
  "price-desc",
  "rating",
  "bestseller",
  "name-asc",
];

function toSortKey(value: string | string[] | undefined): ProductSortKey | undefined {
  const raw = firstValue(value);
  return SORT_KEYS.find((key) => key === raw);
}

/** Translates URL search params into a typed catalogue query. */
export function buildProductQuery(searchParams: SearchParams): ProductQuery {
  return {
    page: toNumber(searchParams.page) ?? 1,
    limit: toNumber(searchParams.limit) ?? 9,
    category: firstValue(searchParams.category),
    size: firstValue(searchParams.size),
    color: firstValue(searchParams.color),
    season: firstValue(searchParams.season),
    minPrice: toNumber(searchParams.minPrice),
    maxPrice: toNumber(searchParams.maxPrice),
    search: firstValue(searchParams.search),
    sort: toSortKey(searchParams.sort),
    featured: firstValue(searchParams.featured) === "true" ? true : undefined,
    onSale: firstValue(searchParams.onSale) === "true" ? true : undefined,
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [lang, resolvedSearchParams] = await Promise.all([getLanguage(), searchParams]);
  const query = buildProductQuery(resolvedSearchParams);

  const bannerPromise = api.content.getShopBanner();
  const productsPromise = api.products.list(query);

  return (
    <div className="bg-surface min-h-screen">
      <ErrorBoundary>
        <ShopShell
          className="overflow-hidden"
          banner={
            <Suspense fallback={<SectionSkeleton variant="default" height="h-64" />}>
              <ShopBannerStream bannerPromise={bannerPromise} />
            </Suspense>
          }
          top={
            <Suspense fallback={<SectionSkeleton variant="default" height="h-20" />}>
              <TopControls lang={lang} />
            </Suspense>
          }
          sidebar={
            <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
              <SidebarControls lang={lang} />
            </Suspense>
          }
          products={
            <Suspense
              fallback={<SectionSkeleton variant="grid" cardCount={9} height="h-screen" />}
            >
              <ShopProductsStream productsPromise={productsPromise} lang={lang} />
            </Suspense>
          }
        />
      </ErrorBoundary>
    </div>
  );
}
