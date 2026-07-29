"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoryTreeNode } from "@/types";

export interface CategoryNavigationProps {
  categoryTree: CategoryTreeNode[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

/** Walks the tree and returns the slug trail down to `targetSlug`. */
function findAncestorTrail(
  nodes: CategoryTreeNode[],
  targetSlug: string,
  trail: string[] = []
): string[] | null {
  for (const node of nodes) {
    const nextTrail = [...trail, node.slug];
    if (node.slug === targetSlug) return nextTrail;
    const found = findAncestorTrail(node.children, targetSlug, nextTrail);
    if (found) return found;
  }
  return null;
}

interface CategoryDropdownItemProps {
  node: CategoryTreeNode;
  level: number;
  activeSlug: string;
  onSelect: (slug: string) => void;
}

function CategoryDropdownItem({
  node,
  level,
  activeSlug,
  onSelect,
}: CategoryDropdownItemProps) {
  const hasChildren = node.children.length > 0;
  const isActive = node.slug === activeSlug;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node.slug)}
        className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
          isActive
            ? "bg-sunken text-black font-semibold"
            : "text-ink hover:bg-sunken hover:text-black"
        }`}
        style={{ paddingInlineStart: `${12 + level * 14}px` }}
      >
        <span className="truncate">{node.name}</span>
        {hasChildren ? <span className="text-xs text-faint">▸</span> : null}
      </button>

      {hasChildren ? (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <CategoryDropdownItem
              key={child.slug}
              node={child}
              level={level + 1}
              activeSlug={activeSlug}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function CategoryNavigation({
  categoryTree,
  activeCategory,
  onCategoryChange,
}: CategoryNavigationProps) {
  const [openRootSlug, setOpenRootSlug] = useState<string | null>(null);
  const [suppressAutoOpen, setSuppressAutoOpen] = useState(false);

  const activeRootSlug = useMemo(() => {
    if (activeCategory === "All") return null;
    const trail = findAncestorTrail(categoryTree, activeCategory);
    return trail?.[0] ?? null;
  }, [categoryTree, activeCategory]);

  const effectiveOpenSlug = openRootSlug ?? (suppressAutoOpen ? null : activeRootSlug);

  const handleSelect = (slug: string) => {
    onCategoryChange(slug);
    setOpenRootSlug(null);
    setSuppressAutoOpen(true);
  };

  return (
    <nav className="py-6" aria-label="Product categories">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
        <button
          type="button"
          onClick={() => onCategoryChange("All")}
          className={`relative text-sm sm:text-base font-medium uppercase tracking-wide transition-all duration-300 pb-2 ${
            activeCategory === "All" ? "text-black font-bold" : "text-muted hover:text-black"
          }`}
        >
          All
          {activeCategory === "All" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-300" />
          )}
        </button>

        {categoryTree.map((root) => {
          const hasChildren = root.children.length > 0;
          const isActive = root.slug === activeCategory;
          const isOpen = effectiveOpenSlug === root.slug;

          return (
            <div key={root.slug} className="relative">
              <button
                type="button"
                onClick={() => {
                  if (!hasChildren) {
                    handleSelect(root.slug);
                    return;
                  }
                  setSuppressAutoOpen(false);
                  setOpenRootSlug((previous) => (previous === root.slug ? null : root.slug));
                }}
                aria-expanded={hasChildren ? isOpen : undefined}
                className={`relative inline-flex items-center gap-2 text-sm sm:text-base font-medium uppercase tracking-wide transition-all duration-300 pb-2 ${
                  isActive ? "text-black font-bold" : "text-muted hover:text-black"
                }`}
              >
                {root.name}
                {hasChildren ? (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                ) : null}

                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-300" />
                )}
              </button>

              {hasChildren && isOpen ? (
                <div className="absolute left-1/2 top-full z-30 mt-3 w-72 -translate-x-1/2 rounded-xl border border-line bg-surface p-2 shadow-xl">
                  {root.children.map((child) => (
                    <CategoryDropdownItem
                      key={child.slug}
                      node={child}
                      level={0}
                      activeSlug={activeCategory}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
