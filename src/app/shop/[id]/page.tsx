import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/types";
import { api } from "@/mocks";
import { getLanguage } from "@/lib/getLanguage";
import { t } from "@/locales/i18n/getTranslation";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import ProductDetailSection from "./_components/ProductDetailSection";
import RelatedProductsStream from "./_components/RelatedProductsStream";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/** Pre-renders every product page at build time. */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const { data } = await api.products.list({ limit: 100 });
  return data.items.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data } = await api.products.getDetail(id);
    return {
      title: data.name,
      description: data.description,
      openGraph: {
        title: `${data.name} · Magic Show`,
        description: data.description,
        type: "website",
        images: [{ url: data.bannerData.backgroundImage }],
      },
    };
  } catch {
    return { title: "Product not found" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [lang, { id }] = await Promise.all([getLanguage(), params]);

  if (!id) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-muted text-lg mb-4">{t(lang, "invalid_product_id")}</p>
          <Link
            href="/shop"
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors inline-block"
          >
            {t(lang, "back_to_shop")}
          </Link>
        </div>
      </div>
    );
  }

  let product;
  try {
    ({ data: product } = await api.products.getDetail(id));
  } catch (error) {
    // A missing product is a 404, not a 500 — anything else should surface.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const relatedPromise = api.products.getRelated(id);

  return (
    <div className="bg-surface min-h-screen">
      <ErrorBoundary>
        <ProductDetailSection product={product} />

        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <RelatedProductsStream relatedPromise={relatedPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
