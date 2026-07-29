import type { Locale, PaginatedResponse, ProductSummary } from "@/types";
import { t } from "@/locales/i18n/getTranslation";
import ProductGrid from "./ProductGrid";
import ShopPaginationClient from "./ShopPaginationClient";

export interface ShopProductsStreamProps {
  productsPromise: Promise<PaginatedResponse<ProductSummary>>;
  lang: Locale;
}

export default async function ShopProductsStream({
  productsPromise,
  lang,
}: ShopProductsStreamProps) {
  const { data, meta } = await productsPromise;

  if (data.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">{t(lang, "no_products_found")}</p>
      </div>
    );
  }

  return (
    <>
      <ProductGrid products={data.items} />
      <ShopPaginationClient
        currentPage={meta.pagination.currentPage}
        totalPages={meta.pagination.totalPages}
      />
    </>
  );
}
