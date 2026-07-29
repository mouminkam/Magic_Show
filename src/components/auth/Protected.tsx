"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import useAuthStore from "@/store/authStore";

export interface ProtectedProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Gate for authenticated-only pages. Shows a spinner until the auth store has
 * hydrated, then either renders `children` or redirects to `redirectTo`.
 */
export default function Protected({ children, redirectTo = "/login" }: ProtectedProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useAuthStore((state) => state.hydrated);
  const lang = useLanguageClient();

  useEffect(() => {
    setMounted(true);
    // The root layout also hydrates, but a directly-loaded protected route can
    // mount this before that effect runs, so make it idempotent and re-run here.
    useAuthStore.getState().hydrateFromStorage();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace(redirectTo);
  }, [hydrated, isAuthenticated, router, redirectTo]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4" suppressHydrationWarning>
            {mounted ? t(lang, "please_login") : " "}
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink-900 mx-auto" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
