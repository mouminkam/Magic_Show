import type { Address, Customer, Order, OrderItem, WishlistItem } from "@/types";
import { productById } from "./products";

/**
 * The single demo account the mock auth service authenticates against, plus its
 * order history and saved items. Credentials are printed on the login page.
 */
export const DEMO_CREDENTIALS = {
  email: "rana.haddad@magicshow.example",
  phone: "+963944218870",
  password: "MagicShow2026",
} as const;

const demoAddress: Address = {
  firstName: "Rana",
  lastName: "Haddad",
  phone: DEMO_CREDENTIALS.phone,
  addressLine1: "Sharkasieh Street 18, Apartment 4",
  addressLine2: "Malki",
  city: "Damascus",
  state: "Damascus Governorate",
  country: "Syria",
  postalCode: "0100",
};

export const demoCustomer: Customer = {
  id: 1,
  firstName: "Rana",
  lastName: "Haddad",
  fullName: "Rana Haddad",
  email: DEMO_CREDENTIALS.email,
  phone: DEMO_CREDENTIALS.phone,
  isActive: true,
  emailVerified: true,
  phoneVerified: true,
  preferredLanguage: "en",
  preferredCurrency: "USD",
  addresses: [demoAddress],
  avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80&auto=format&fit=crop",
  createdAt: "2024-11-03T10:12:00.000Z",
  updatedAt: "2026-07-02T08:41:00.000Z",
};

interface OrderSeed {
  id: number;
  orderNumber: string;
  status: Order["status"];
  statusDisplay: string;
  paymentStatus: Order["paymentStatus"];
  paymentMethod: Order["paymentMethod"];
  createdAt: string;
  couponCode: string | null;
  discountAmount: number;
  shippingAmount: number;
  trackingNumber: string | null;
  lines: Array<{ productId: number; quantity: number; size: string | null; color: string | null }>;
}

const orderSeeds: OrderSeed[] = [
  {
    id: 1001,
    orderNumber: "MS-2026-1001",
    status: "paid",
    statusDisplay: "Delivered",
    paymentStatus: "paid",
    paymentMethod: "card",
    createdAt: "2026-02-14T11:22:00.000Z",
    couponCode: "WELCOME10",
    discountAmount: 34.4,
    shippingAmount: 0,
    trackingNumber: "MSX4471902SY",
    lines: [
      { productId: 1, quantity: 1, size: "38", color: "Black" },
      { productId: 17, quantity: 1, size: "One Size", color: "Gold" },
    ],
  },
  {
    id: 1002,
    orderNumber: "MS-2026-1002",
    status: "paid",
    statusDisplay: "Delivered",
    paymentStatus: "paid",
    paymentMethod: "cash_on_delivery",
    createdAt: "2026-03-27T16:05:00.000Z",
    couponCode: null,
    discountAmount: 0,
    shippingAmount: 15,
    trackingNumber: "MSX4488113SY",
    lines: [{ productId: 12, quantity: 1, size: "One Size", color: "Cognac" }],
  },
  {
    id: 1003,
    orderNumber: "MS-2026-1003",
    status: "cancelled",
    statusDisplay: "Cancelled",
    paymentStatus: "refunded",
    paymentMethod: "card",
    createdAt: "2026-04-19T09:48:00.000Z",
    couponCode: null,
    discountAmount: 0,
    shippingAmount: 15,
    trackingNumber: null,
    lines: [{ productId: 7, quantity: 1, size: "38", color: "Black" }],
  },
  {
    id: 1004,
    orderNumber: "MS-2026-1004",
    status: "paid",
    statusDisplay: "Shipped",
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    createdAt: "2026-05-30T14:30:00.000Z",
    couponCode: "FREESHIP",
    discountAmount: 15,
    shippingAmount: 15,
    trackingNumber: "MSX4512776SY",
    lines: [
      { productId: 4, quantity: 1, size: "38", color: "Ivory" },
      { productId: 24, quantity: 2, size: "One Size", color: "Black" },
    ],
  },
  {
    id: 1005,
    orderNumber: "MS-2026-1005",
    status: "pending",
    statusDisplay: "Awaiting payment",
    paymentStatus: "unpaid",
    paymentMethod: "cash_on_delivery",
    createdAt: "2026-07-11T18:14:00.000Z",
    couponCode: null,
    discountAmount: 0,
    shippingAmount: 15,
    trackingNumber: null,
    lines: [
      { productId: 25, quantity: 1, size: "38", color: "Nude" },
      { productId: 16, quantity: 1, size: "One Size", color: "Gold" },
    ],
  },
  {
    id: 1006,
    orderNumber: "MS-2026-1006",
    status: "pending",
    statusDisplay: "Processing",
    paymentStatus: "paid",
    paymentMethod: "card",
    createdAt: "2026-07-18T10:02:00.000Z",
    couponCode: "SUMMER25",
    discountAmount: 96.5,
    shippingAmount: 0,
    trackingNumber: null,
    lines: [
      { productId: 35, quantity: 1, size: "38", color: "Black" },
      { productId: 42, quantity: 1, size: "38", color: "Gold" },
    ],
  },
];

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildOrder(seed: OrderSeed): Order {
  const items: OrderItem[] = seed.lines.flatMap((line, index) => {
    const product = productById.get(line.productId);
    if (!product) return [];
    const unitPrice = product.salePrice ?? product.price;
    return [
      {
        id: seed.id * 10 + index,
        orderId: seed.id,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: line.quantity,
        unitPrice,
        totalPrice: round2(unitPrice * line.quantity),
        image: product.featuredImage,
        attributes: { size: line.size, color: line.color },
      },
    ];
  });

  const subtotal = round2(items.reduce((sum, item) => sum + item.totalPrice, 0));
  const totalAmount = round2(subtotal - seed.discountAmount + seed.shippingAmount);
  const createdMs = Date.parse(seed.createdAt);

  return {
    id: seed.id,
    orderNumber: seed.orderNumber,
    customerId: demoCustomer.id,
    status: seed.status,
    statusDisplay: seed.statusDisplay,
    paymentStatus: seed.paymentStatus,
    paymentMethod: seed.paymentMethod,
    subtotal,
    discountAmount: seed.discountAmount,
    shippingAmount: seed.shippingAmount,
    taxAmount: 0,
    totalAmount,
    currency: "USD",
    couponCode: seed.couponCode,
    shippingAddress: demoAddress,
    billingAddress: null,
    shippingMethod: "Standard delivery (2–4 working days)",
    customerNotes: null,
    trackingNumber: seed.trackingNumber,
    items,
    createdAt: seed.createdAt,
    updatedAt: seed.createdAt,
    confirmedAt: seed.status === "pending" ? null : new Date(createdMs + 3_600_000).toISOString(),
    shippedAt:
      seed.trackingNumber === null ? null : new Date(createdMs + 86_400_000).toISOString(),
    deliveredAt:
      seed.statusDisplay === "Delivered"
        ? new Date(createdMs + 3 * 86_400_000).toISOString()
        : null,
  };
}

/** Six historical orders across delivered, shipped, processing and cancelled. */
export const seedOrders: Order[] = orderSeeds
  .map(buildOrder)
  .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

/** Products the demo customer has saved. */
export const seedWishlistProductIds: number[] = [5, 11, 28, 40];

export function toWishlistItem(productId: number, addedAt: string): WishlistItem | null {
  const product = productById.get(productId);
  if (!product) return null;
  const price = product.salePrice ?? product.price;
  const originalPrice = product.salePrice ? product.price : null;
  return {
    id: product.id,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    category: product.categories[0]?.name ?? "Magic Show",
    price,
    originalPrice,
    discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null,
    image: product.featuredImage,
    inStock: product.inStock,
    addedAt,
  };
}
