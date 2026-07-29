"use client";

import { Suspense } from "react";
import type { Locale } from "@/types";
import SectionBoundary from "@/components/ui/SectionBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import ShopControls from "./ShopControls";

export interface SidebarControlsProps {
  lang: Locale;
}

/** Desktop facet sidebar. */
export default function SidebarControls({ lang }: SidebarControlsProps) {
  return (
    <SectionBoundary>
      <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
        <ShopControls variant="sidebar" lang={lang} />
      </Suspense>
    </SectionBoundary>
  );
}
