"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered instead of the default panel when the boundary trips. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const lang = useLanguageClient();

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-faint mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-ink mb-2">
          {t(lang, "something_went_wrong")}
        </h2>
        <p className="text-muted mb-6">{error?.message || t(lang, "an_error_occurred")}</p>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-white rounded-lg hover:bg-ink-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {t(lang, "try_again")}
        </button>
      </div>
    </div>
  );
}

/**
 * Catches render errors in a subtree, reports them to Sentry (a no-op without a
 * DSN) and offers a retry that clears the error state.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.captureException(error, {
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
  }
}
