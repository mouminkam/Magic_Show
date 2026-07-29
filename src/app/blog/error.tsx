"use client";

import { useEffect } from "react";
import Link from "next/link";

export interface BlogErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogError({ error, reset }: BlogErrorProps) {
  useEffect(() => {
    console.error("Blog Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sunken">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 text-critical">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-ink mb-4">
            خطأ في تحميل المدونة
          </h2>
          <p className="text-muted mb-8">
            {error.message || 'نعتذر، حدث خطأ أثناء تحميل المقالات'}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-ink-900 text-white rounded-lg hover:bg-ink-800 transition-colors"
          >
            حاول مرة أخرى
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-line-strong text-ink rounded-lg hover:bg-sunken transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
