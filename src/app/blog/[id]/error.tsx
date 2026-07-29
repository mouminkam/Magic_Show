"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export interface BlogPostErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogPostError({ error, reset }: BlogPostErrorProps) {
  useEffect(() => {
    console.error("Blog post error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sunken px-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-ink mb-4">Something went wrong</h2>
        <p className="text-muted mb-8">
          {error.message || "We could not load this article. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-white rounded-lg hover:bg-ink-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/blog"
            className="px-6 py-3 border border-line-strong text-ink rounded-lg hover:bg-sunken transition-colors"
          >
            Back to blog
          </Link>
        </div>
      </div>
    </div>
  );
}
