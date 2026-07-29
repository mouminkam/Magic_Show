"use client";

import { Suspense, useCallback, useEffect, useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter as FilterIcon, X } from "lucide-react";
import type { CategoryTreeNode, Locale, NumericRange, ShopFilters } from "@/types";
import { api } from "@/mocks";
import { t } from "@/locales/i18n/getTranslation";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

const CategoryNavigation = dynamic(() => import("./CategoryNavigation"), {
  loading: () => <SectionSkeleton variant="default" height="h-20" />,
});

const FilterSidebar = dynamic(() => import("./FilterSidebar"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
});

const MobileFilterDrawer = dynamic(() => import("./MobileFilterDrawer"), {
  loading: () => <SectionSkeleton variant="default" height="h-screen" />,
});

/** Which parts of the control set to render. */
export type ShopControlsVariant = "top" | "sidebar";

export interface ShopControlsProps {
  variant: ShopControlsVariant;
  lang: Locale;
}

interface UiFilters {
  category: string;
  size: string;
  color: string;
  season: string;
  minPrice: number;
  maxPrice: number;
}

const EMPTY_FILTERS: ShopFilters = {
  sizes: [],
  colors: [],
  seasons: [],
  priceRange: { min: 0, max: 1000 },
};

const PRICE_DEBOUNCE_MS = 600;
const DRAWER_CLOSE_MS = 300;

function readFilters(searchKey: string, priceRange: NumericRange): UiFilters {
  const params = new URLSearchParams(searchKey);
  const parsePrice = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  return {
    category: params.get("category") ?? "All",
    size: params.get("size") ?? "",
    color: params.get("color") ?? "",
    season: params.get("season") ?? "",
    minPrice: parsePrice("minPrice", priceRange.min),
    maxPrice: parsePrice("maxPrice", priceRange.max),
  };
}

/**
 * Category navigation and facet filters. Filter state lives in the URL so the
 * server component re-queries the catalogue on every change and the result is
 * shareable and back-button friendly.
 */
export default function ShopControls({ variant, lang }: ShopControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [filters, setFilters] = useState<ShopFilters>(EMPTY_FILTERS);

  const [isFilterMounted, setIsFilterMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchKey = searchParams?.toString() ?? "";
  const priceRange = filters.priceRange;

  const [uiFilters, setUiFilters] = useState<UiFilters>(() =>
    readFilters(searchKey, EMPTY_FILTERS.priceRange)
  );
  const [draftPrice, setDraftPrice] = useState<NumericRange>(() => ({
    min: uiFilters.minPrice,
    max: uiFilters.maxPrice,
  }));
  const [isPriceDebouncing, setIsPriceDebouncing] = useState(false);
  const priceDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Facets come from the catalogue, so the sidebar can never offer a filter
  // that matches nothing.
  useEffect(() => {
    let cancelled = false;

    Promise.all([api.products.getCategoryTree(), api.products.getFilters()])
      .then(([treeResponse, filtersResponse]) => {
        if (cancelled) return;
        setCategoryTree(treeResponse.data);
        setFilters(filtersResponse.data);
      })
      .catch(() => {
        if (!cancelled) setFilters(EMPTY_FILTERS);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep local state in step with the URL (back/forward, or a reset elsewhere).
  useEffect(() => {
    const next = readFilters(searchKey, priceRange);
    setUiFilters(next);
    setDraftPrice({ min: next.minPrice, max: next.maxPrice });
  }, [searchKey, priceRange]);

  useEffect(
    () => () => {
      if (drawerCloseTimer.current) clearTimeout(drawerCloseTimer.current);
      if (priceDebounceTimer.current) clearTimeout(priceDebounceTimer.current);
    },
    []
  );

  const pushFilters = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchKey);

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "All") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      params.set("page", "1");

      startTransition(() => {
        router.push(`/shop?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchKey]
  );

  // Debounce slider drags so a drag does not fire a navigation per pixel.
  useEffect(() => {
    if (draftPrice.min === uiFilters.minPrice && draftPrice.max === uiFilters.maxPrice) {
      setIsPriceDebouncing(false);
      return;
    }

    if (priceDebounceTimer.current) clearTimeout(priceDebounceTimer.current);
    priceDebounceTimer.current = setTimeout(() => {
      pushFilters({
        minPrice: draftPrice.min === priceRange.min ? null : draftPrice.min,
        maxPrice: draftPrice.max === priceRange.max ? null : draftPrice.max,
      });
      setIsPriceDebouncing(false);
    }, PRICE_DEBOUNCE_MS);

    return () => {
      if (priceDebounceTimer.current) clearTimeout(priceDebounceTimer.current);
    };
  }, [draftPrice, uiFilters.minPrice, uiFilters.maxPrice, priceRange, pushFilters]);

  const openDrawer = () => {
    if (drawerCloseTimer.current) {
      clearTimeout(drawerCloseTimer.current);
      drawerCloseTimer.current = null;
    }
    setIsFilterMounted(true);
    // Mount first, then flip the transform on the next frame so the slide-in
    // animation actually plays.
    requestAnimationFrame(() => setIsDrawerOpen(true));
  };

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    if (drawerCloseTimer.current) clearTimeout(drawerCloseTimer.current);
    drawerCloseTimer.current = setTimeout(() => {
      setIsFilterMounted(false);
      drawerCloseTimer.current = null;
    }, DRAWER_CLOSE_MS);
  }, []);

  const handleReset = () => {
    if (priceDebounceTimer.current) clearTimeout(priceDebounceTimer.current);
    setIsPriceDebouncing(false);
    setUiFilters({
      category: "All",
      size: "",
      color: "",
      season: "",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
    setDraftPrice({ min: priceRange.min, max: priceRange.max });
    startTransition(() => {
      router.push("/shop?page=1", { scroll: false });
    });
  };

  const sidebarProps = {
    priceRange: draftPrice,
    availablePriceRange: priceRange,
    onPriceRangeChange: (range: NumericRange) => {
      setIsPriceDebouncing(true);
      setDraftPrice(range);
    },
    isPending,
    isPriceDebouncing,
    sizes: filters.sizes,
    selectedSize: uiFilters.size,
    onSizeChange: (size: string) => pushFilters({ size: size || null }),
    colors: filters.colors,
    selectedColor: uiFilters.color,
    onColorChange: (color: string) => pushFilters({ color: color || null }),
    seasons: filters.seasons,
    selectedSeason: uiFilters.season,
    onSeasonChange: (season: string) => pushFilters({ season: season || null }),
  };

  if (variant === "top") {
    return (
      <>
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" height="h-20" />}>
            <CategoryNavigation
              categoryTree={categoryTree}
              activeCategory={uiFilters.category}
              onCategoryChange={(category) =>
                pushFilters({ category: category === "All" ? null : category })
              }
            />
          </Suspense>
        </ErrorBoundary>

        <div className="lg:hidden flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-muted hover:text-ink underline"
          >
            {t(lang, "reset_filters")}
          </button>

          <button
            type="button"
            onClick={openDrawer}
            className="flex items-center px-5 py-3 bg-gray-900 text-white rounded-lg gap-2 shadow-lg font-semibold focus:outline-none"
          >
            <FilterIcon className="w-5 h-5" />
            <span>{t(lang, "filter")}</span>
          </button>
        </div>

        {isFilterMounted && (
          <ErrorBoundary>
            <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
              <MobileFilterDrawer open={isDrawerOpen} onRequestClose={closeDrawer}>
                <div className="flex justify-between items-center mb-4 sticky top-0 z-50 bg-surface py-0 mt-20">
                  <h2 className="text-lg font-bold">{t(lang, "filters")}</h2>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    aria-label="Close filters"
                    className="p-2 rounded-full hover:bg-sunken transition"
                  >
                    <X className="w-6 h-6 bg-black text-white rounded-sm p-1" />
                  </button>
                </div>

                <FilterSidebar {...sidebarProps} />

                <div className="mt-8 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 bg-gray-200 text-ink rounded-lg px-6 py-3 font-bold text-base shadow hover:bg-gray-300 transition-all duration-200"
                  >
                    {t(lang, "reset")}
                  </button>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="flex-1 bg-black text-white rounded-lg px-6 py-3 font-bold text-base shadow hover:bg-gray-800 transition-all duration-200"
                  >
                    {t(lang, "done")}
                  </button>
                </div>
              </MobileFilterDrawer>
            </Suspense>
          </ErrorBoundary>
        )}
      </>
    );
  }

  return (
    <div className="hidden lg:block">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{t(lang, "filters")}</h2>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-muted hover:text-ink underline"
            >
              {t(lang, "reset")}
            </button>
          </div>
          <FilterSidebar {...sidebarProps} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
