"use client";

import { Suspense } from "react";
import type { Locale } from "@/types";
import SectionBoundary from "@/components/ui/SectionBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import ShopControls from "./ShopControls";

export interface TopControlsProps {
  lang: Locale;
}

/** Category navigation plus the mobile filter trigger. */
export default function TopControls({ lang }: TopControlsProps) {
  return (
    <SectionBoundary>
      <Suspense fallback={<SectionSkeleton variant="default" height="h-20" />}>
        <ShopControls variant="top" lang={lang} />
      </Suspense>
    </SectionBoundary>
  );
}
