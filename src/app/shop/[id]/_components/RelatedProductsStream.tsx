import type { ApiResponse, ProductSummary } from "@/types";
import SectionBoundary from "@/components/ui/SectionBoundary";
import RelatedProductsSlider from "./RelatedProductsSlider";

export interface RelatedProductsStreamProps {
  relatedPromise: Promise<ApiResponse<ProductSummary[]>>;
}

/**
 * Awaits related products separately from the main product so the detail page
 * paints before this query resolves.
 */
export default async function RelatedProductsStream({
  relatedPromise,
}: RelatedProductsStreamProps) {
  const { data } = await relatedPromise;

  return (
    <SectionBoundary>
      <RelatedProductsSlider products={data} />
    </SectionBoundary>
  );
}
