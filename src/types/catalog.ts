import type {
  CurrencyCode,
  EntityId,
  ImageUrlSet,
  IsoDateString,
  NumericRange,
  SelectOption,
} from "./common";

/** Product taxonomy node. Categories nest one level deep in the storefront. */
export interface Category {
  id: EntityId;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  /** Parent category slug, or `null` for a root category. */
  parentSlug: string | null;
}

/** A category plus its children — what the shop sidebar navigation renders. */
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

export interface Brand {
  id: EntityId;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

export interface Color {
  id: EntityId;
  name: string;
  /** CSS hex value, e.g. `#1F2937`. */
  colorCode: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Size {
  id: EntityId;
  /** EU shoe size or apparel size, e.g. `"39"` or `"M"`. */
  name: string;
  sortOrder: number;
}

export interface Material {
  id: EntityId;
  name: string;
  slug: string;
  description: string | null;
}

export type SeasonValue = "spring" | "summer" | "autumn" | "winter" | "all-season";

export interface Season {
  id: EntityId;
  value: SeasonValue;
  label: string;
}

export interface ProductImage {
  id: EntityId | null;
  url: string;
  imageUrls: ImageUrlSet;
  altText: string | null;
  isPrimary: boolean;
  order: number;
}

/**
 * A concrete purchasable combination of colour and size, with its own stock.
 * The storefront reads variants to decide whether a size/colour pair is
 * in stock; it never creates them.
 */
export interface ProductVariant {
  id: EntityId;
  productId: EntityId;
  sku: string;
  colorId: EntityId;
  sizeId: EntityId;
  stockQuantity: number;
  /** Price delta applied on top of the product price; usually `0`. */
  priceModifier: number;
}

export interface Product {
  id: EntityId;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  /** Discounted price when the product is on sale, otherwise `null`. */
  salePrice: number | null;
  currency: CurrencyCode;
  isFeatured: boolean;
  isActive: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  categories: Category[];
  brand: Brand | null;
  materials: Material[];
  images: ProductImage[];
  featuredImage: string;
  featuredImageUrls: ImageUrlSet;
  colors: Color[];
  sizes: Size[];
  seasons: Season[];
  variants: ProductVariant[];
  stockQuantity: number;
  inStock: boolean;
  /** Average of all published reviews, rounded to one decimal. */
  rating: number;
  reviewCount: number;
  soldCount: number;
  weight: number | null;
  dimensions: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

/**
 * Denormalised product shape consumed by grid/card components. Keeping it
 * separate from `Product` keeps list payloads small and card props explicit.
 */
export interface ProductSummary {
  id: EntityId;
  name: string;
  slug: string;
  category: string;
  price: number;
  /** Pre-discount price, present only when the product is on sale. */
  originalPrice: number | null;
  /** Whole-percent discount, present only when the product is on sale. */
  discount: number | null;
  image: string;
  imageUrls: ImageUrlSet;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

/** Fully expanded product used by the product detail page. */
export interface ProductDetail {
  id: EntityId;
  name: string;
  slug: string;
  description: string;
  descriptionText: string;
  /** Effective price (sale price when on sale). */
  price: number;
  originalPrice: number | null;
  discount: number | null;
  currency: CurrencyCode;
  code: string;
  images: ProductImage[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  brand: string | null;
  materials: string[];
  bannerData: {
    title: string;
    backgroundImage: string;
    leftBadge: string | null;
    rightBadge: string | null;
  };
}

export interface Review {
  id: EntityId;
  productId: EntityId;
  customerId: EntityId | null;
  authorName: string;
  authorImage: string | null;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isFeatured: boolean;
  helpfulCount: number;
  createdAt: IsoDateString;
}

/** Sort orders accepted by the shop listing service. */
export type ProductSortKey =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "bestseller"
  | "name-asc";

/** Query accepted by `products.list()`. Every field is optional. */
export interface ProductQuery {
  page?: number;
  limit?: number;
  /** Category slug, or `"All"` / omitted for every category. */
  category?: string;
  size?: string;
  color?: string;
  season?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: ProductSortKey;
  featured?: boolean;
  onSale?: boolean;
}

/** Facet values the shop sidebar renders. */
export interface ShopFilters {
  sizes: string[];
  colors: string[];
  seasons: SelectOption[];
  priceRange: NumericRange;
}
