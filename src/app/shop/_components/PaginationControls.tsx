"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Maximum number pills rendered before the list is windowed with ellipses. */
const MAX_VISIBLE_PAGES = 7;

/**
 * Builds the page list, collapsing long ranges so a 40-page result set does not
 * render 40 buttons. `null` marks an ellipsis.
 */
export function buildPageList(currentPage: number, totalPages: number): Array<number | null> {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage - 1 > 1) pages.add(currentPage - 1);
  if (currentPage + 1 < totalPages) pages.add(currentPage + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const withGaps: Array<number | null> = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) withGaps.push(null);
    withGaps.push(page);
  });

  return withGaps;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav
      className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-line"
      aria-label="Pagination"
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page, index) =>
          page === null ? (
            <span
              key={`gap-${index}`}
              className="w-10 h-10 flex items-center justify-center text-faint"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={`w-10 h-10 rounded flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? "bg-gray-800 text-white shadow-lg"
                  : "bg-surface text-muted border border-line-strong hover:border-gray-400 hover:shadow-md"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
