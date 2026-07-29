"use client";

import type { ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";

export interface SectionBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/** Error boundary sized for a single page section rather than a whole route. */
export default function SectionBoundary({ children, fallback }: SectionBoundaryProps) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
