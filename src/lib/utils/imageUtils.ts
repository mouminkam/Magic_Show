import type { ImageUrlSet } from "@/types";

/** Shown whenever a source is missing or fails to load. */
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80&auto=format&fit=crop";

/**
 * Normalises an image source into something `next/image` can render.
 *
 * The mock data layer only ever produces local `/images/...` paths, but this
 * still guards against empty strings and whitespace so a bad record can never
 * render a broken `<img src="">`.
 */
export function resolveImageUrl(src: string | null | undefined): string {
  if (typeof src !== "string") return FALLBACK_IMAGE;
  const trimmed = src.trim();
  return trimmed === "" ? FALLBACK_IMAGE : trimmed;
}

export type ImageSize = keyof ImageUrlSet;

/** Anything that can supply an image: a product, a cart line, an image record. */
export interface ImageSource {
  imageUrls?: ImageUrlSet | null;
  image?: string | null;
  url?: string | null;
}

/**
 * Picks the best URL for the requested size, degrading gracefully:
 * `imageUrls[size]` → `imageUrls.full` → `image` → `url` → fallback.
 */
export function pickImageUrl(
  source: ImageSource | null | undefined,
  size: ImageSize = "medium"
): string {
  if (!source) return FALLBACK_IMAGE;

  const candidates = [
    source.imageUrls?.[size],
    source.imageUrls?.full,
    source.image,
    source.url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate.trim();
    }
  }

  return FALLBACK_IMAGE;
}

export const getProductThumbUrl = (source: ImageSource | null | undefined): string =>
  pickImageUrl(source, "thumb");

export const getProductMediumUrl = (source: ImageSource | null | undefined): string =>
  pickImageUrl(source, "medium");

export const getProductFullUrl = (source: ImageSource | null | undefined): string =>
  pickImageUrl(source, "full");
