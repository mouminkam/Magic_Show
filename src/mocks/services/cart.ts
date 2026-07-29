import type { AppliedCoupon, ApiResponse, CartItem, Coupon } from "@/types";
import { couponByCode } from "../data/company";
import { fail, respond, roundMoney } from "../runtime";

/** Free shipping kicks in above this order subtotal. */
export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_COST = 15;

export function calculateSubtotal(items: CartItem[]): number {
  return roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}

/** Applies a coupon's rules to a subtotal and returns the money taken off. */
export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "fixed") {
    return roundMoney(Math.min(coupon.value, subtotal));
  }
  const raw = (subtotal * coupon.value) / 100;
  const capped = coupon.maximumDiscount === null ? raw : Math.min(raw, coupon.maximumDiscount);
  return roundMoney(Math.min(capped, subtotal));
}

function assertRedeemable(coupon: Coupon | undefined, code: string, subtotal: number): Coupon {
  const now = Date.now();

  if (!coupon || !coupon.isActive) {
    throw new CouponError(`"${code}" is not a valid coupon code.`, "COUPON_INVALID");
  }
  if (Date.parse(coupon.startsAt) > now) {
    throw new CouponError(`"${code}" is not active yet.`, "COUPON_NOT_STARTED");
  }
  if (coupon.expiresAt !== null && Date.parse(coupon.expiresAt) < now) {
    throw new CouponError(`"${code}" has expired.`, "COUPON_EXPIRED");
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new CouponError(`"${code}" has reached its usage limit.`, "COUPON_EXHAUSTED");
  }
  if (subtotal < coupon.minimumAmount) {
    throw new CouponError(
      `"${code}" requires a minimum order of $${coupon.minimumAmount}.`,
      "COUPON_MINIMUM_NOT_MET"
    );
  }
  return coupon;
}

class CouponError extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "CouponError";
    this.code = code;
  }
}

export const cartService = {
  /**
   * Validates a coupon against the current subtotal.
   *
   * The cart itself lives entirely client-side in the Zustand store; this is
   * the only cart operation that needs to consult the backend.
   */
  async validateCoupon(code: string, subtotal: number): Promise<ApiResponse<AppliedCoupon>> {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      return fail("Enter a coupon code.", 422, "COUPON_REQUIRED");
    }

    try {
      const coupon = assertRedeemable(couponByCode.get(normalized), normalized, subtotal);
      return respond<AppliedCoupon>({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount: calculateDiscount(coupon, subtotal),
      });
    } catch (error) {
      if (error instanceof CouponError) {
        return fail(error.message, 422, error.code);
      }
      throw error;
    }
  },
};
