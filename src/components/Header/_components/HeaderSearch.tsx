"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import type { Locale, ProductSummary } from "@/types";
import { api } from "@/mocks";
import { formatPrice } from "@/lib/utils/formatters";
import { resolveImageUrl } from "@/lib/utils/imageUtils";
import { t } from "@/locales/i18n/getTranslation";
import OptimizedImage from "@/components/ui/OptimizedImage";

export interface HeaderSearchProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Locale;
}

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

/** Full-screen product search dialog with debounced typeahead results. */
export default function HeaderSearch({ isOpen, onClose, lang }: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reset whenever the dialog closes so it never reopens with stale results.
  useEffect(() => {
    if (isOpen) return;
    setQuery("");
    setResults([]);
    setIsSearching(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const term = query.trim();
    if (term.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timer = setTimeout(() => {
      api.products
        .search(term)
        .then(({ data }) => {
          if (!cancelled) setResults(data);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (productId: number) => {
    router.push(`/shop/${productId}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t(lang, "search")}
    >
      <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-line">
          <div className="flex items-center">
            <Search className="w-6 h-6 text-orange-500 mr-3" />
            <span className="text-xl font-normal text-ink tracking-wide">
              {t(lang, "search")}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-ink transition-colors"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {/* The dialog exists to receive typing, so the field takes focus on open. */}
          <input
            type="search"
            autoFocus
            placeholder={t(lang, "search_placeholder")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full px-4 py-4 text-lg text-ink placeholder-faint focus:outline-none focus:ring-2 focus:ring-brand-ring rounded-lg border border-line"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : query.trim().length < MIN_QUERY_LENGTH ? (
            <p className="text-muted text-center py-4">{t(lang, "search_min_chars")}</p>
          ) : results.length === 0 ? (
            <p className="text-muted text-center py-4">{t(lang, "search_no_results")}</p>
          ) : (
            <ul className="space-y-2">
              {results.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(product.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sunken text-left"
                  >
                    <div className="w-12 h-12 skeleton rounded flex-shrink-0 overflow-hidden">
                      <OptimizedImage
                        src={resolveImageUrl(product.image)}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink truncate">{product.name}</p>
                      <p className="text-sm text-muted">{formatPrice(product.price)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
