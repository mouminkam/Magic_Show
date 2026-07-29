import type { CurrencyCode, EntityId, IsoDateString } from "./common";

/**
 * A line in the local (client-side) cart. Identity is the tuple
 * `(productId, size, color)` — the same product in two sizes is two lines.
 */
export interface CartItem {
  id: EntityId;
  productId: EntityId;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  size: string | null;
  color: string | null;
  /** Stock available for this variant at the time it was added. */
  maxQuantity: number;
}

/** Everything needed to identify a cart line without carrying the whole line. */
export type CartItemKey = Pick<CartItem, "id" | "size" | "color">;

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: CurrencyCode;
  coupon: AppliedCoupon | null;
}

export type CouponType = "percentage" | "fixed";

export interface Coupon {
  id: EntityId;
  code: string;
  name: string;
  description: string;
  type: CouponType;
  /** Percent (0-100) for `percentage`, absolute amount for `fixed`. */
  value: number;
  minimumAmount: number;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: IsoDateString;
  expiresAt: IsoDateString | null;
}

/** Result of validating a coupon against a cart subtotal. */
export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
  /** Currency amount actually taken off the subtotal. */
  discountAmount: number;
}

/**
 * Normalised order status. The backend keeps a richer internal status; its
 * `OrderResource` collapses it to these three for the storefront.
 */
export type OrderStatus = "pending" | "paid" | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type PaymentMethod = "cash_on_delivery" | "bank_transfer" | "card";

export interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  country: string;
  postalCode?: string | null;
}

export interface OrderItem {
  id: EntityId;
  orderId: EntityId;
  productId: EntityId;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
  attributes: {
    size: string | null;
    color: string | null;
  };
}

export interface Order {
  id: EntityId;
  orderNumber: string;
  customerId: EntityId;
  status: OrderStatus;
  statusDisplay: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: CurrencyCode;
  couponCode: string | null;
  shippingAddress: Address;
  billingAddress: Address | null;
  shippingMethod: string;
  customerNotes: string | null;
  trackingNumber: string | null;
  items: OrderItem[];
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  confirmedAt: IsoDateString | null;
  shippedAt: IsoDateString | null;
  deliveredAt: IsoDateString | null;
}

/** Payload accepted by `orders.create()`. */
export interface CreateOrderInput {
  items: Array<{
    productId: EntityId;
    quantity: number;
    size: string | null;
    color: string | null;
  }>;
  shippingAddress: Address;
  couponCode?: string;
  paymentMethod?: PaymentMethod;
  customerNotes?: string;
}

/** A wishlist entry — a saved product plus when it was saved. */
export interface WishlistItem {
  id: EntityId;
  productId: EntityId;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  image: string;
  inStock: boolean;
  addedAt: IsoDateString;
}
