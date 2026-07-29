"use client";

import { useState } from "react";
import { Range } from "react-range";
import type { NumericRange, SelectOption } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";

export interface FilterSidebarProps {
  priceRange: NumericRange;
  availablePriceRange: NumericRange;
  onPriceRangeChange: (range: NumericRange) => void;
  isPending: boolean;
  isPriceDebouncing: boolean;
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  colors: string[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  seasons: SelectOption[];
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
}

/** Facets past this count are hidden behind a "Show more" toggle. */
const LIST_LIMIT = 5;

interface FacetListProps {
  title: string;
  options: SelectOption[];
  selected: string;
  onSelect: (value: string) => void;
}

function FacetList({ title, options, selected, onSelect }: FacetListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visible = isExpanded ? options : options.slice(0, LIST_LIMIT);

  return (
    <div className="border-t border-line pt-6 flex flex-col gap-4">
      <h3 className="text-lg font-bold uppercase tracking-wide text-ink mb-4">{title}</h3>
      <div className="flex flex-col gap-4">
        {visible.map((option) => (
          <button
            key={option.value}
            type="button"
            // Clicking the active facet clears it.
            onClick={() => onSelect(selected === option.value ? "" : option.value)}
            aria-pressed={selected === option.value}
            className={`py-2 text-sm font-medium rounded transition-all duration-200 w-full hover:bg-black hover:text-white ${
              selected === option.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-surface text-ink border-line-strong hover:border-gray-400"
            }`}
          >
            {option.label}
          </button>
        ))}
        {options.length > LIST_LIMIT && (
          <button
            type="button"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="py-2 text-sm font-medium text-orange-500 rounded transition-colors w-full hover:bg-orange-500 hover:text-white"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function FilterSidebar({
  priceRange,
  availablePriceRange,
  onPriceRangeChange,
  isPending,
  isPriceDebouncing,
  sizes,
  selectedSize,
  onSizeChange,
  colors,
  selectedColor,
  onColorChange,
  seasons,
  selectedSeason,
  onSeasonChange,
}: FilterSidebarProps) {
  const rangeMin = availablePriceRange.min;
  const rangeMax = Math.max(availablePriceRange.max, rangeMin + 1);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  // The slider is uncontrolled between renders, so values must stay in bounds
  // even if the URL carries something outside the catalogue's range.
  const values: [number, number] = [
    clamp(priceRange.min, rangeMin, rangeMax),
    clamp(priceRange.max, rangeMin, rangeMax),
  ];

  const percent = (value: number) => ((value - rangeMin) / (rangeMax - rangeMin)) * 100;

  const handleNumericInput = (raw: string, bound: "min" | "max") => {
    const parsed = Number(raw);
    if (raw === "" || Number.isNaN(parsed)) return;
    if (bound === "min") {
      onPriceRangeChange({ min: clamp(parsed, rangeMin, values[1]), max: values[1] });
    } else {
      onPriceRangeChange({ min: values[0], max: clamp(parsed, values[0], rangeMax) });
    }
  };

  const isBusy = isPending || isPriceDebouncing;

  return (
    <div className="space-y-8 pr-4">
      <div className="border-t border-line pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold uppercase tracking-wide text-ink">Price</h3>
          <div className="text-xs font-semibold text-muted tracking-wide">USD</div>
        </div>

        <div
          className={`space-y-4 rounded-xl border border-line bg-surface p-4 transition-all ${
            isBusy ? "opacity-80" : "opacity-100"
          }`}
        >
          <div className="py-1">
            <Range
              step={1}
              min={rangeMin}
              max={rangeMax}
              values={values}
              onChange={([min, max]) => {
                if (min !== undefined && max !== undefined) {
                  onPriceRangeChange({ min, max });
                }
              }}
              renderTrack={({ props, children }) => {
                const { ref, onMouseDown, onTouchStart, style, ...rest } = props;
                const key = (props as { key?: React.Key }).key;
                return (
                  <div
                    key={key}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    className="w-full"
                    style={style}
                  >
                    <div
                      ref={ref}
                      {...rest}
                      className="relative h-1.5 w-full rounded-full bg-gray-200"
                    >
                      <div
                        className="absolute inset-y-0 rounded-full bg-gray-900"
                        style={{
                          left: `${percent(values[0])}%`,
                          width: `${percent(values[1]) - percent(values[0])}%`,
                        }}
                      />
                      {children}
                    </div>
                  </div>
                );
              }}
              renderThumb={({ props, isDragged }) => {
                const { key, ...rest } = props;
                return (
                  <div
                    key={key}
                    {...rest}
                    className="flex items-center justify-center touch-manipulation"
                    style={{ ...rest.style, outline: "none" }}
                  >
                    <div
                      className={`h-5 w-5 rounded-full border border-gray-900 bg-surface shadow-sm transition-all duration-150 ${
                        isDragged ? "scale-110" : "hover:shadow-md"
                      }`}
                    />
                  </div>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted">Min</span>
              <input
                inputMode="numeric"
                value={String(values[0])}
                onChange={(event) => handleNumericInput(event.target.value, "min")}
                className="h-10 w-full rounded-lg border border-line px-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted">Max</span>
              <input
                inputMode="numeric"
                value={String(values[1])}
                onChange={(event) => handleNumericInput(event.target.value, "max")}
                className="h-10 w-full rounded-lg border border-line px-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </label>
          </div>

          <div className="flex items-center justify-between text-xs text-muted font-semibold">
            <span>{formatPrice(values[0])}</span>
            <span className={isBusy ? "animate-pulse" : ""}>{formatPrice(values[1])}</span>
          </div>
        </div>
      </div>

      <FacetList
        title="Size"
        options={sizes.map((size) => ({ value: size, label: size }))}
        selected={selectedSize}
        onSelect={onSizeChange}
      />

      <FacetList
        title="Color"
        options={colors.map((color) => ({ value: color, label: color }))}
        selected={selectedColor}
        onSelect={onColorChange}
      />

      <FacetList
        title="Season"
        options={seasons}
        selected={selectedSeason}
        onSelect={onSeasonChange}
      />
    </div>
  );
}
