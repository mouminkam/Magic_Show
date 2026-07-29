"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Loader2, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/mocks";
import type { Order, Pagination } from "@/types";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import apiErrorMessage from "@/lib/apiErrorMessage";

export interface OrdersHistoryProps {
  isAuthenticated: boolean;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function formatMoneySYP(value: number | null | undefined): string {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "—";
  return `${Math.round(num).toLocaleString()} SYP`;
}

export default function OrdersHistory({ isAuthenticated }: OrdersHistoryProps) {
  const lang = useLanguageClient();

  const [items, setItems] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPaginate = useMemo(() => {
    const totalPages = pagination?.totalPages;
    return typeof totalPages === "number" && totalPages > 1;
  }, [pagination]);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.orders.list({ page });
      setItems(response.data.items);
      setPagination(response.meta.pagination);
    } catch (err) {
      setError(apiErrorMessage(err));
      setItems([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, isAuthenticated]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="bg-surface rounded-lg shadow-[var(--shadow-sm)] border border-line p-6 animate-in-up">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold text-ink">{t(lang, "profile.orders")}</h2>

        {pagination?.totalItems != null ? (
          <span className="text-sm text-muted">
            {pagination.totalItems} {t(lang, "profile.orders_count")}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <div className="min-h-[180px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : error ? (
        <div className="min-h-[180px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-ink font-medium">{t(lang, "something_went_wrong")}</p>
            <p className="text-muted text-sm mt-1">{typeof error === "string" ? error : "—"}</p>
            <button
              type="button"
              onClick={() => void fetchOrders()}
              className="mt-4 px-4 py-2 text-sm font-medium text-brand border border-brand rounded-sm hover:bg-brand-soft"
            >
              {t(lang, "try_again")}
            </button>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="min-h-[180px] flex flex-col items-center justify-center text-center">
          <Package className="w-10 h-10 text-faint mb-3" />
          <p className="text-ink font-medium">{t(lang, "profile.no_orders")}</p>
          <p className="text-muted text-sm mt-1">{t(lang, "profile.no_orders_hint")}</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex px-4 py-2 text-sm font-medium text-white bg-brand rounded-sm hover:bg-brand-hover"
          >
            {t(lang, "profile.start_shopping")}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((order) => {
            const status = order.status;
            const isComplete = status === "paid";
            const isCancelled = status === "cancelled";
            const statusLabel = isComplete
              ? "Complete"
              : isCancelled
                ? "Cancelled"
                : "Pending";
            const statusBadgeClass = isComplete
              ? "bg-positive-soft text-positive"
              : isCancelled
                ? "bg-sunken text-muted"
                : "bg-caution-soft text-caution";
            return (
            <div
              key={order.id}
              className="p-4 border border-line rounded-lg hover:border-rust-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink truncate">
                    {order.orderNumber || `${t(lang, "profile.order")} #${order.id}`}
                  </p>
                  <p className="text-sm text-muted mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                  <span
                    className={`inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded ${statusBadgeClass}`}
                    aria-label={statusLabel}
                  >
                    {statusLabel}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-ink">
                    {formatMoneySYP(order.totalAmount)}
                  </p>
                </div>
              </div>

              {Array.isArray(order.items) && order.items.length > 0 ? (
                <div className="mt-3 text-sm text-muted">
                  <span className="font-medium">{t(lang, "profile.items")}: </span>
                  {order.items.slice(0, 2).map((it) => it.productName).filter(Boolean).join(", ")}
                  {order.items.length > 2 ? ` +${order.items.length - 2}` : ""}
                </div>
              ) : null}
            </div>
          );
          })}

          {canPaginate ? (
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination?.hasPrev}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink border border-line-strong rounded-sm hover:bg-sunken disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                {t(lang, "profile.prev")}
              </button>

              <span className="text-sm text-muted">
                {t(lang, "profile.page")} {pagination?.currentPage ?? page} / {pagination?.totalPages ?? "—"}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination?.hasNext}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink border border-line-strong rounded-sm hover:bg-sunken disabled:opacity-50"
              >
                {t(lang, "profile.next")}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
