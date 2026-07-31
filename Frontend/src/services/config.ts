import type { ApiError } from "@/lib/api/types";

/**
 * Toggle for the whole service layer.
 * Set VITE_USE_MOCK_API=true to run in mock mode.
 * Defaults to FALSE so every request routes through the live Spring Boot REST client.
 */
export const USE_MOCK_API =
  (import.meta.env.VITE_USE_MOCK_API as string | undefined) === "true";

export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function mockError(error: ApiError): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(error), 350));
}

/** Simple in-memory rate limiter so HTTP 429 handling can be exercised on mocks. */
export function createMockRateLimiter(limit: number, windowMs: number) {
  let hits: number[] = [];
  return function check(): ApiError | null {
    const now = Date.now();
    hits = hits.filter((t) => now - t < windowMs);
    if (hits.length >= limit) {
      const retryAfterSeconds = Math.ceil((windowMs - (now - hits[0])) / 1000);
      return {
        status: 429,
        code: "RATE_LIMITED",
        message: "Too many requests.",
        retryAfterSeconds: Math.max(1, retryAfterSeconds),
      };
    }
    hits.push(now);
    return null;
  };
}
