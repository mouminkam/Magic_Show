"use client";

import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import useToastStore, { type ToastType } from "@/store/toastStore";

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-positive" />,
  error: <AlertCircle className="w-5 h-5 text-critical" />,
  warning: <AlertTriangle className="w-5 h-5 text-caution" />,
  info: <Info className="w-5 h-5 text-accent-info" />,
};

const BACKGROUNDS: Record<ToastType, string> = {
  success: "bg-positive-soft border-positive/30",
  error: "bg-critical-soft border-critical/30",
  warning: "bg-caution-soft border-caution/30",
  info: "bg-accent-info-soft border-accent-info/30",
};

/** Global toast outlet, mounted once from the root layout. */
export default function Toast() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2 max-w-md"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${BACKGROUNDS[toast.type]} border rounded-lg shadow-[var(--shadow-lg)] p-4 flex items-start gap-3 animate-in slide-in-from-right`}
        >
          <div className="flex-shrink-0">{ICONS[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-faint hover:text-muted transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
