import type {
  CartItem,
  FeaturedProductCardData,
  Product,
  ProductDetail,
  ProductSummary,
} from "@/types";

/** Pure projections from the rich `Product` model into leaner view models. */

export function effectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}

export function discountPercent(product: Product): number | null {
  if (product.salePrice === null || product.price <= 0) return null;
  return Math.round(((product.price - product.salePrice) / product.price) * 100);
}

export function toProductSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.categories[0]?.name ?? "Magic Show",
    price: effectivePrice(product),
    originalPrice: product.salePrice === null ? null : product.price,
    discount: discountPercent(product),
    image: product.featuredImage,
    imageUrls: product.featuredImageUrls,
    rating: product.rating,
    reviewCount: product.reviewCount,
    inStock: product.inStock,
  };
}

export function toProductDetail(product: Product): ProductDetail {
  const discount = discountPercent(product);
  const primaryImage = product.images[0]?.url ?? product.featuredImage;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.shortDescription,
    descriptionText: product.description,
    price: effectivePrice(product),
    originalPrice: product.salePrice === null ? null : product.price,
    discount,
    currency: product.currency,
    code: product.sku,
    images: product.images,
    sizes: product.sizes.map((size) => size.name),
    colors: product.colors.map((color) => color.name),
    rating: product.rating,
    reviewCount: product.reviewCount,
    inStock: product.inStock,
    stockQuantity: product.stockQuantity,
    brand: product.brand?.name ?? null,
    materials: product.materials.map((material) => material.name),
    bannerData: {
      title: product.name,
      backgroundImage: primaryImage,
      leftBadge: discount === null ? null : `SALE ${discount}%`,
      rightBadge: product.brand?.name.toUpperCase() ?? null,
    },
  };
}

/** Formats a product for the home page's masonry "featured" grid. */
export function toFeaturedCard(product: Product): FeaturedProductCardData {
  return {
    id: product.id,
    name: product.name,
    alt: `${product.name} by ${product.brand?.name ?? "Magic Show"}`,
    image: product.featuredImage,
    originalPrice: `$${product.price.toFixed(2)}`,
    discountedPrice: `$${effectivePrice(product).toFixed(2)}`,
  };
}

/** Builds a cart line from a product plus the selected variant attributes. */
export function toCartItem(
  product: Product,
  quantity: number,
  options: { size?: string | null; color?: string | null } = {}
): CartItem {
  return {
    id: product.id,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: effectivePrice(product),
    image: product.featuredImage,
    quantity,
    size: options.size ?? product.sizes[0]?.name ?? null,
    color: options.color ?? product.colors[0]?.name ?? null,
    maxQuantity: product.stockQuantity,
  };
}
