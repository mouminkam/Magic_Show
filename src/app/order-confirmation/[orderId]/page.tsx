"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, MapPin, Package } from "lucide-react";
import type { Order } from "@/types";
import { api } from "@/mocks";
import apiErrorMessage from "@/lib/apiErrorMessage";
import { formatPrice } from "@/lib/utils/formatters";
import { getProductThumbUrl } from "@/lib/utils/imageUtils";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import Protected from "@/components/auth/Protected";

function OrderConfirmation({ orderId }: { orderId: string }) {
  const lang = useLanguageClient();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    api.orders
      .getById(orderId)
      .then(({ data }) => {
        if (!cancelled) setOrder(data);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(apiErrorMessage(cause));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sunken flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-line-strong border-t-brand animate-spin" />
      </div>
    );
  }

  if (error !== null || order === null) {
    return (
      <div className="min-h-screen bg-sunken flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-ink mb-4">
            {t(lang, "something_went_wrong")}
          </h2>
          <p className="text-muted mb-6">{error ?? t(lang, "order_not_found")}</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-brand text-brand-fg rounded-md hover:bg-brand-hover transition-colors focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
          >
            {t(lang, "back_to_shop")}
          </Link>
        </div>
      </div>
    );
  }

  const address = order.shippingAddress;

  return (
    <div className="min-h-screen bg-sunken py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-in-up">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-positive-soft">
            <CheckCircle2 className="h-9 w-9 text-positive" strokeWidth={1.75} />
          </div>
          <span className="eyebrow">Order confirmed</span>
          <h1 className="mt-2 text-3xl font-semibold text-ink">
            {t(lang, "order_confirmation.title")}
          </h1>
          <p className="mt-2 text-muted">
            Order <span className="font-mono tnum text-ink">{order.orderNumber}</span> — a
            confirmation has been sent to your account.
          </p>
        </div>

        <div
          className="bg-surface rounded-xl border border-line shadow-[var(--shadow-md)] p-6 mb-6 animate-in-up"
          style={{ animationDelay: "60ms" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Package className="h-4 w-4 text-faint" />
            <h2 className="eyebrow">{t(lang, "order_confirmation.details")}</h2>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 relative skeleton rounded-md flex-shrink-0 overflow-hidden">
                  <Image
                    src={getProductThumbUrl(item)}
                    alt={item.productName}
                    fill
                    sizes="64px"
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{item.productName}</p>
                  <p className="text-sm text-muted tnum">
                    Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <div className="font-semibold text-ink tnum shrink-0">
                  {formatPrice(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-line space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{t(lang, "order_confirmation.subtotal")}</span>
              <span className="tnum text-ink">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-positive">
                <span>{t(lang, "order_confirmation.discount")}</span>
                <span className="tnum">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">
                {t(lang, "order_confirmation.shipping_cost")}
              </span>
              <span className="tnum text-ink">
                {order.shippingAmount === 0 ? "Free" : formatPrice(order.shippingAmount)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base text-ink pt-2 border-t border-line mt-2">
              <span>{t(lang, "order_confirmation.total")}</span>
              <span className="tnum">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div
          className="bg-surface rounded-xl border border-line shadow-[var(--shadow-sm)] p-6 mb-8 animate-in-up"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-faint" />
            <h2 className="eyebrow">{t(lang, "order_confirmation.shipping")}</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            {address.firstName} {address.lastName}
            <br />
            {address.addressLine1}
            <br />
            {address.city}, {address.country}
            <br />
            {address.phone}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-block text-center px-6 py-3 bg-brand text-brand-fg rounded-md hover:bg-brand-hover transition-colors font-medium focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
          >
            {t(lang, "continue_shopping")}
          </Link>
          <Link
            href="/profile"
            className="inline-block text-center px-6 py-3 border border-line-strong text-ink rounded-md hover:bg-sunken transition-colors font-medium focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
          >
            {t(lang, "order_confirmation.my_profile")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId ?? "";

  return (
    <Protected redirectTo={`/login?redirect=/order-confirmation/${orderId}`}>
      <OrderConfirmation orderId={orderId} />
    </Protected>
  );
}
