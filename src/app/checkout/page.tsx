"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Protected from "@/components/auth/Protected";
import useCartStore from "@/store/cartStore";
import CheckoutForm from "./_components/CheckoutForm";
import OrderSummary from "./_components/OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);

  // An empty cart has nothing to check out; send the shopper back to the shop
  // rather than showing an empty form.
  useEffect(() => {
    if (items.length === 0) router.replace("/shop");
  }, [items.length, router]);

  if (items.length === 0) return null;

  return (
    <Protected redirectTo="/login?redirect=/checkout">
      <div className="min-h-screen bg-surface py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl text-ink-900 mb-8">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-12 items-start">
            <CheckoutForm />
            <div className="lg:sticky lg:top-28">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}
