import type {
  ApiResponse,
  Category,
  CategoryTreeNode,
  PaginatedResponse,
  Product,
  ProductDetail,
  ProductQuery,
  ProductSummary,
  Review,
  ShopFilters,
} from "@/types";
import { categories, colors, seasons, sizes } from "../data/taxonomy";
import { productById, products } from "../data/products";
import { reviews } from "../data/reviews";
import { discountPercent, effectivePrice, toProductDetail, toProductSummary } from "../mappers";
import { fail, matches, normalizePageRequest, respond, respondPaginated } from "../runtime";

const DEFAULT_PAGE_SIZE = 9;

/** Slugs of a category and all of its descendants. */
function categoryFamily(slug: string): Set<string> {
  const family = new Set<string>([slug]);
  for (const category of categories) {
    if (category.parentSlug === slug) family.add(category.slug);
  }
  return family;
}

function applyFilters(query: ProductQuery): Product[] {
  const {
    category,
    size,
    color,
    season,
    brand,
    minPrice,
    maxPrice,
    search,
    featured,
    onSale,
  } = query;

  const familySlugs =
    category && category !== "All" ? categoryFamily(category) : null;

  return products.filter((product) => {
    if (!product.isActive) return false;

    if (familySlugs && !product.categories.some((c) => familySlugs.has(c.slug))) {
      return false;
    }
    if (size && !product.sizes.some((s) => s.name === size)) return false;
    if (color && !product.colors.some((c) => c.name === color)) return false;
    if (season && !product.seasons.some((s) => s.value === season || s.label === season)) {
      return false;
    }
    if (brand && product.brand?.slug !== brand) return false;
    if (featured === true && !product.isFeatured) return false;
    if (onSale === true && product.salePrice === null) return false;

    const price = effectivePrice(product);
    if (typeof minPrice === "number" && price < minPrice) return false;
    if (typeof maxPrice === "number" && price > maxPrice) return false;

    if (search && search.trim()) {
      const term = search.trim();
      const haystack = [
        product.name,
        product.sku,
        product.shortDescription,
        product.brand?.name ?? "",
        ...product.categories.map((c) => c.name),
      ].join(" ");
      if (!matches(haystack, term)) return false;
    }

    return true;
  });
}

function applySort(list: Product[], sort: ProductQuery["sort"]): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-desc":
      return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "bestseller":
      return sorted.sort((a, b) => b.soldCount - a.soldCount);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "oldest":
      return sorted.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    case "newest":
      return sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    default:
      // Stable default: featured first, then best selling.
      return sorted.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return b.soldCount - a.soldCount;
      });
  }
}

/** Builds the two-level tree the shop navigation renders. */
function buildCategoryTree(): CategoryTreeNode[] {
  const roots = categories.filter((c) => c.parentSlug === null);
  return roots.map((root) => ({
    ...root,
    children: categories
      .filter((c) => c.parentSlug === root.slug)
      .map((child) => ({ ...child, children: [] })),
  }));
}

export const productsService = {
  /** Paginated, filtered, sorted product listing — powers `/shop`. */
  async list(query: ProductQuery = {}): Promise<PaginatedResponse<ProductSummary>> {
    const { page, limit } = normalizePageRequest(query, DEFAULT_PAGE_SIZE);
    const filtered = applySort(applyFilters(query), query.sort);
    return respondPaginated(filtered.map(toProductSummary), page, limit);
  },

  /** Full product record. Rejects with a 404 `ApiError` when not found. */
  async getById(id: number | string): Promise<ApiResponse<Product>> {
    const product = productById.get(Number(id));
    if (!product) {
      return fail(`Product ${id} was not found.`, 404, "PRODUCT_NOT_FOUND");
    }
    return respond(product);
  },

  /** Product shaped for the detail page. */
  async getDetail(id: number | string): Promise<ApiResponse<ProductDetail>> {
    const product = productById.get(Number(id));
    if (!product) {
      return fail(`Product ${id} was not found.`, 404, "PRODUCT_NOT_FOUND");
    }
    return respond(toProductDetail(product));
  },

  /**
   * Up to `limit` products sharing a category with `id`, best sellers first,
   * topped up with other best sellers if the category is thin.
   */
  async getRelated(id: number | string, limit = 8): Promise<ApiResponse<ProductSummary[]>> {
    const product = productById.get(Number(id));
    if (!product) return respond<ProductSummary[]>([]);

    const slugs = new Set(product.categories.map((c) => c.slug));
    const sameCategory = products
      .filter((p) => p.id !== product.id && p.categories.some((c) => slugs.has(c.slug)))
      .sort((a, b) => b.soldCount - a.soldCount);

    const alreadyPicked = new Set(sameCategory.map((p) => p.id));
    const filler = products
      .filter((p) => p.id !== product.id && !alreadyPicked.has(p.id))
      .sort((a, b) => b.soldCount - a.soldCount);

    return respond([...sameCategory, ...filler].slice(0, limit).map(toProductSummary));
  },

  /** Typeahead search used by the header search dialog. */
  async search(term: string, limit = 8): Promise<ApiResponse<ProductSummary[]>> {
    if (term.trim().length < 2) return respond<ProductSummary[]>([], 60);
    const found = applyFilters({ search: term }).slice(0, limit);
    return respond(found.map(toProductSummary));
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return respond(categories.filter((c) => c.isActive));
  },

  async getCategoryTree(): Promise<ApiResponse<CategoryTreeNode[]>> {
    return respond(buildCategoryTree());
  },

  /** Facet values derived from the live catalogue, so they never drift. */
  async getFilters(): Promise<ApiResponse<ShopFilters>> {
    const prices = products.map(effectivePrice);
    return respond({
      sizes: sizes.map((s) => s.name),
      colors: colors.map((c) => c.name),
      seasons: seasons.map((s) => ({ value: s.value, label: s.label })),
      priceRange: {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices)),
      },
    });
  },

  async getReviews(productId: number | string): Promise<ApiResponse<Review[]>> {
    const id = Number(productId);
    return respond(
      reviews
        .filter((review) => review.productId === id)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    );
  },

  /** Discount percentage helper re-exported for components that render badges. */
  discountPercent,
};
