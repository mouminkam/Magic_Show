import type {
  ApiResponse,
  CreateOrderInput,
  Order,
  OrderItem,
  PaginatedResponse,
} from "@/types";
import { couponByCode } from "../data/company";
import { productById } from "../data/products";
import { effectivePrice } from "../mappers";
import { fail, normalizePageRequest, respond, respondPaginated, roundMoney } from "../runtime";
import { mockDb } from "../store";
import { calculateDiscount, calculateShipping } from "./cart";

const DEFAULT_PAGE_SIZE = 5;

function orderNumberFor(id: number): string {
  return `MS-${new Date().getFullYear()}-${id}`;
}

export const ordersService = {
  /** The signed-in customer's order history, newest first. */
  async list(request: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Order>> {
    const { page, limit } = normalizePageRequest(request, DEFAULT_PAGE_SIZE);
    const sorted = [...mockDb.getOrders()].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    return respondPaginated(sorted, page, limit);
  },

  /** Looks a single order up by numeric id or by order number. */
  async getById(id: number | string): Promise<ApiResponse<Order>> {
    const numericId = Number(id);
    const order = Number.isFinite(numericId)
      ? mockDb.getOrder(numericId)
      : mockDb.getOrderByNumber(String(id));

    if (!order) {
      return fail(`Order ${id} was not found.`, 404, "ORDER_NOT_FOUND");
    }
    return respond(order);
  },

  /**
   * Places an order. Line prices are resolved from the catalogue rather than
   * trusted from the client, exactly as a real checkout endpoint would.
   */
  async create(input: CreateOrderInput): Promise<ApiResponse<Order>> {
    if (input.items.length === 0) {
      return fail("Your cart is empty.", 422, "CART_EMPTY");
    }

    const unknown = input.items.find((line) => !productById.has(line.productId));
    if (unknown) {
      return fail(
        `Product ${unknown.productId} is no longer available.`,
        422,
        "PRODUCT_UNAVAILABLE"
      );
    }

    const outOfStock = input.items.find((line) => {
      const product = productById.get(line.productId);
      return !product || !product.inStock || line.quantity > product.stockQuantity;
    });
    if (outOfStock) {
      const product = productById.get(outOfStock.productId);
      return fail(
        `${product?.name ?? "That product"} does not have enough stock left.`,
        422,
        "OUT_OF_STOCK"
      );
    }

    const now = new Date().toISOString();

    const order = mockDb.addOrder((nextId) => {
      const items: OrderItem[] = input.items.flatMap((line, index) => {
        const product = productById.get(line.productId);
        if (!product) return [];
        const unitPrice = effectivePrice(product);
        return [
          {
            id: nextId * 10 + index,
            orderId: nextId,
            productId: product.id,
            productName: product.name,
            productSku: product.sku,
            quantity: line.quantity,
            unitPrice,
            totalPrice: roundMoney(unitPrice * line.quantity),
            image: product.featuredImage,
            attributes: { size: line.size, color: line.color },
          },
        ];
      });

      const subtotal = roundMoney(items.reduce((sum, item) => sum + item.totalPrice, 0));

      const coupon = input.couponCode
        ? couponByCode.get(input.couponCode.trim().toUpperCase())
        : undefined;
      const discountAmount =
        coupon && coupon.isActive && subtotal >= coupon.minimumAmount
          ? calculateDiscount(coupon, subtotal)
          : 0;

      const shippingAmount = calculateShipping(subtotal - discountAmount);

      return {
        id: nextId,
        orderNumber: orderNumberFor(nextId),
        customerId: mockDb.getCustomer().id,
        status: "pending",
        statusDisplay: "Processing",
        paymentStatus: input.paymentMethod === "cash_on_delivery" ? "unpaid" : "paid",
        paymentMethod: input.paymentMethod ?? "cash_on_delivery",
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount: 0,
        totalAmount: roundMoney(subtotal - discountAmount + shippingAmount),
        currency: "USD",
        couponCode: discountAmount > 0 ? (coupon?.code ?? null) : null,
        shippingAddress: input.shippingAddress,
        billingAddress: null,
        shippingMethod: "Standard delivery (2–4 working days)",
        customerNotes: input.customerNotes ?? null,
        trackingNumber: null,
        items,
        createdAt: now,
        updatedAt: now,
        confirmedAt: null,
        shippedAt: null,
        deliveredAt: null,
      };
    });

    return respond(order);
  },
};
