/**
 * Mock data layer.
 *
 * The storefront runs entirely against this module — there is no HTTP client
 * and no `NEXT_PUBLIC_API_URL`. Every function is async, adds realistic
 * latency, and resolves to the same `{ success, data }` / `{ success, data,
 * meta }` envelopes the Laravel backend returns, so components keep their
 * loading and error states and swapping in a real client is a one-file change.
 *
 * ```ts
 * import { api } from "@/mocks";
 *
 * const { data } = await api.products.list({ category: "boots", page: 2 });
 * ```
 */
import { authService } from "./services/auth";
import { blogService } from "./services/blog";
import { cartService } from "./services/cart";
import { contentService } from "./services/content";
import { contactService, newsletterService } from "./services/messaging";
import { ordersService } from "./services/orders";
import { productsService } from "./services/products";
import { wishlistService } from "./services/wishlist";

export const api = {
  auth: authService,
  blog: blogService,
  cart: cartService,
  contact: contactService,
  content: contentService,
  newsletter: newsletterService,
  orders: ordersService,
  products: productsService,
  wishlist: wishlistService,
} as const;

export type MockApi = typeof api;

export { DEMO_CREDENTIALS } from "./services/auth";
export {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  calculateShipping,
  calculateSubtotal,
} from "./services/cart";
export { mockDb } from "./store";
export {
  discountPercent,
  effectivePrice,
  toCartItem,
  toProductSummary,
} from "./mappers";

export type {
  AboutPageData,
  ContactPageData,
  FeaturedCategoriesData,
  FeaturedProductsData,
  LatestBlogData,
  NewsletterSectionData,
  ProductSectionData,
  StoresPageData,
  WhyChooseUsData,
} from "./services/content";

export default api;
