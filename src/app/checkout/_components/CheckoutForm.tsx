"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import type { Address, CreateOrderInput } from "@/types";
import { api, calculateSubtotal } from "@/mocks";
import apiErrorMessage from "@/lib/apiErrorMessage";
import { checkoutSchema } from "@/lib/authSchemas";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import useToastStore from "@/store/toastStore";
import useCheckoutCoupon from "./useCheckoutCoupon";

interface CheckoutFormState {
  address: string;
  city: string;
  country: string;
  couponCode: string;
  acceptTerms: boolean;
}

/** Shipping address form plus coupon entry and order placement. */
export default function CheckoutForm() {
  const router = useRouter();
  const lang = useLanguageClient();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const toastSuccess = useToastStore((state) => state.success);
  const toastError = useToastStore((state) => state.error);
  const coupon = useCheckoutCoupon((state) => state.coupon);
  const setCoupon = useCheckoutCoupon((state) => state.setCoupon);

  const [form, setForm] = useState<CheckoutFormState>({
    address: user?.addresses[0]?.addressLine1 ?? "",
    city: user?.addresses[0]?.city ?? "",
    country: user?.addresses[0]?.country ?? "",
    couponCode: "",
    acceptTerms: false,
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplyCoupon = async () => {
    const code = form.couponCode.trim();
    if (!code) return;

    setIsApplyingCoupon(true);
    try {
      const { data } = await api.cart.validateCoupon(code, calculateSubtotal(items));
      setCoupon(data);
      toastSuccess(t(lang, "checkout.coupon_applied"));
    } catch (error) {
      setCoupon(null);
      toastError(apiErrorMessage(error));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = checkoutSchema.safeParse({
      address: form.address,
      city: form.city,
      country: form.country,
      couponCode: form.couponCode || undefined,
      acceptTerms: form.acceptTerms ? true : undefined,
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      toastError(
        firstIssue?.path[0] === "acceptTerms"
          ? t(lang, "checkout.accept_terms")
          : t(lang, "checkout.fill_shipping")
      );
      return;
    }

    if (!user) {
      toastError(t(lang, "please_login"));
      return;
    }

    const shippingAddress: Address = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      addressLine1: parsed.data.address,
      city: parsed.data.city,
      country: parsed.data.country,
    };

    const payload: CreateOrderInput = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      shippingAddress,
      couponCode: coupon?.code,
      paymentMethod: "cash_on_delivery",
    };

    setIsPlacingOrder(true);
    try {
      const { data: order } = await api.orders.create(payload);
      toastSuccess(t(lang, "messages.order_placed"));
      clearCart();
      setCoupon(null);
      // Land on the confirmation page for the order that was just created.
      router.replace(`/order-confirmation/${order.id}`);
    } catch (error) {
      toastError(apiErrorMessage(error));
      setIsPlacingOrder(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-display text-xl text-ink-900 mb-5">
          {t(lang, "checkout.shippingAddress")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkout-first-name" className="block text-xs font-medium uppercase tracking-wide text-ink-600 mb-1.5">
              {t(lang, "profile.firstName")}
            </label>
            <input
              id="checkout-first-name"
              type="text"
              readOnly
              value={user?.firstName ?? ""}
              className="block w-full border border-ink-200 py-2.5 px-3 bg-ink-50 text-ink-600 read-only:cursor-default outline-none"
            />
          </div>
          <div>
            <label htmlFor="checkout-last-name" className="block text-xs font-medium uppercase tracking-wide text-ink-600 mb-1.5">
              {t(lang, "profile.lastName")}
            </label>
            <input
              id="checkout-last-name"
              type="text"
              readOnly
              value={user?.lastName ?? ""}
              className="block w-full border border-ink-200 py-2.5 px-3 bg-ink-50 text-ink-600 read-only:cursor-default outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="checkout-address" className="block text-xs font-medium uppercase tracking-wide text-ink-600 mb-1.5">
            Address
          </label>
          <input
            id="checkout-address"
            name="address"
            type="text"
            required
            value={form.address}
            onChange={handleChange}
            disabled={isPlacingOrder}
            className="block w-full border border-ink-200 py-2.5 px-3 outline-none focus:border-ink-900 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="checkout-city" className="block text-xs font-medium uppercase tracking-wide text-ink-600 mb-1.5">
              City
            </label>
            <input
              id="checkout-city"
              name="city"
              type="text"
              required
              value={form.city}
              onChange={handleChange}
              disabled={isPlacingOrder}
              className="block w-full border border-ink-200 py-2.5 px-3 outline-none focus:border-ink-900 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="checkout-country" className="block text-xs font-medium uppercase tracking-wide text-ink-600 mb-1.5">
              Country
            </label>
            <input
              id="checkout-country"
              name="country"
              type="text"
              required
              value={form.country}
              onChange={handleChange}
              disabled={isPlacingOrder}
              className="block w-full border border-ink-200 py-2.5 px-3 outline-none focus:border-ink-900 transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="checkout-coupon" className="block text-xs font-medium uppercase tracking-wide text-ink-600 mb-1.5">
          {t(lang, "checkout.coupon")}
        </label>
        <div className="flex gap-2">
          <input
            id="checkout-coupon"
            name="couponCode"
            type="text"
            value={form.couponCode}
            onChange={handleChange}
            disabled={isPlacingOrder}
            className="block w-full border border-ink-200 py-2.5 px-3 outline-none focus:border-ink-900 transition-colors"
            placeholder="WELCOME10"
          />
          <button
            type="button"
            onClick={() => {
              void handleApplyCoupon();
            }}
            disabled={isApplyingCoupon || isPlacingOrder || !form.couponCode.trim()}
            className="shrink-0 px-4 py-2 border border-ink-200 text-sm font-medium hover:border-ink-900 transition-colors disabled:opacity-50"
          >
            {isApplyingCoupon ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t(lang, "checkout.apply_coupon")
            )}
          </button>
        </div>
        {coupon && (
          <p className="mt-2 flex items-center gap-1 text-sm text-positive">
            <Check className="w-4 h-4" />
            {coupon.code} — {t(lang, "checkout.coupon_applied")}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-ink-600">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={form.acceptTerms}
            onChange={handleChange}
            disabled={isPlacingOrder}
            className="accent-ink-900"
          />
          I accept the terms and conditions
        </label>
      </div>

      <button
        type="submit"
        disabled={isPlacingOrder}
        className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-ink-900 text-white font-medium tracking-wide hover:bg-rust-600 transition-colors disabled:opacity-60"
      >
        {isPlacingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        {t(lang, "checkout.placeOrder")}
      </button>
    </form>
  );
}
