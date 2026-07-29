"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Button from "@/components/Button";

export interface WishlistErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WishlistError({ error, reset }: WishlistErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <p className="text-muted mb-4">
          {error?.message || "Something went wrong loading your wishlist."}
        </p>
        <Button variant="primary" size="md" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
