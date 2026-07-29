"use client";

import { create } from "zustand";
import type { AppliedCoupon } from "@/types";

/**
 * The applied coupon is shared between `CheckoutForm` (where it is entered) and
 * `OrderSummary` (where the discount is shown). A tiny store keeps them in sync
 * without lifting all of the checkout form state into the page.
 */
export interface CheckoutCouponState {
  coupon: AppliedCoupon | null;
  setCoupon: (coupon: AppliedCoupon | null) => void;
}

const useCheckoutCoupon = create<CheckoutCouponState>((set) => ({
  coupon: null,
  setCoupon: (coupon) => set({ coupon }),
}));

export default useCheckoutCoupon;
