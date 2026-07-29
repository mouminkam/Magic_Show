import { ApiError } from "@/types";
import type { ApiResponse, PaginatedResponse, Pagination } from "@/types";

/**
 * Shared plumbing for the mock service layer: simulated latency, response
 * envelopes and pagination. Every service function goes through these so
 * components keep exercising real loading/error states.
 */

/** Latency window, in milliseconds, applied to every mock call. */
const LATENCY_MIN_MS = 120;
const LATENCY_MAX_MS = 380;

/**
 * Server renders must not be slowed down by fake latency — it would show up
 * directly in TTFB — so delays only apply in the browser.
 */
const shouldDelay = typeof window !== "undefined";

export function delay(ms?: number): Promise<void> {
  if (!shouldDelay) return Promise.resolve();
  const duration = ms ?? LATENCY_MIN_MS + Math.random() * (LATENCY_MAX_MS - LATENCY_MIN_MS);
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

/** Resolves `value` after a realistic delay, wrapped in a success envelope. */
export async function respond<T>(value: T, ms?: number): Promise<ApiResponse<T>> {
  await delay(ms);
  return { success: true, data: value };
}

/** Rejects with an `ApiError` after a realistic delay. */
export async function fail(
  message: string,
  status = 400,
  code = "BAD_REQUEST",
  details?: Record<string, string[]>
): Promise<never> {
  await delay();
  throw new ApiError(message, status, code, details);
}

export interface PageRequest {
  page?: number;
  limit?: number;
}

/** Clamps a page request to sane bounds. */
export function normalizePageRequest(
  request: PageRequest,
  defaultLimit: number
): { page: number; limit: number } {
  const page = Math.max(1, Math.trunc(request.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Math.trunc(request.limit ?? defaultLimit) || defaultLimit));
  return { page, limit };
}

export function buildPagination(
  totalItems: number,
  page: number,
  limit: number
): Pagination {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(page, totalPages);
  return {
    currentPage,
    limit,
    totalItems,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

/** Slices `items` for the requested page and wraps it in a paginated envelope. */
export async function respondPaginated<T>(
  items: T[],
  page: number,
  limit: number
): Promise<PaginatedResponse<T>> {
  await delay();
  const pagination = buildPagination(items.length, page, limit);
  const start = (pagination.currentPage - 1) * limit;
  return {
    success: true,
    data: { items: items.slice(start, start + limit) },
    meta: { pagination },
  };
}

/** Case- and accent-insensitive substring match used by search and filters. */
export function matches(haystack: string, needle: string): boolean {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
