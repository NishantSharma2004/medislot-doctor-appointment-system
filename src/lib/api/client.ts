import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "./types";

/**
 * Centralized Axios client.
 *
 * Only VITE_API_BASE_URL is used here — no database, JWT or AI provider
 * secrets ever live in the frontend. All calls go to the Spring Boot backend.
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8080";

const TOKEN_STORAGE_KEY = "medislot.token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/** Called by AuthContext so the client can log the user out on HTTP 401. */
let onUnauthorized: (() => void) | null = null;
export function registerUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// Attach the JWT issued by the Spring Boot backend.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

function parseRetryAfter(value?: string | number | null): number | undefined {
  if (value === undefined || value === null) return undefined;
  const seconds = Number(value);
  if (!Number.isNaN(seconds)) return Math.max(1, Math.round(seconds));
  const date = Date.parse(String(value));
  if (Number.isNaN(date)) return undefined;
  return Math.max(1, Math.round((date - Date.now()) / 1000));
}

/** Converts any Axios failure into the single ApiError shape used by the UI. */
export function normalizeError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return { status: 0, code: "SERVER", message: "Something went wrong. Please try again." };
  }

  const axiosError = error as AxiosError<{
    message?: string;
    error?: string;
    fieldErrors?: Record<string, string>;
  }>;

  if (!axiosError.response) {
    return {
      status: 0,
      code: "NETWORK",
      message: "We could not reach the server. Check your connection and try again.",
    };
  }

  const { status, data, headers } = axiosError.response;
  const backendMessage = data?.message ?? data?.error;

  switch (status) {
    case 401:
      return {
        status,
        code: "UNAUTHORIZED",
        message: backendMessage ?? "Your session has expired. Please sign in again.",
      };
    case 403:
      return {
        status,
        code: "FORBIDDEN",
        message: backendMessage ?? "You do not have permission to perform this action.",
      };
    case 404:
      return { status, code: "NOT_FOUND", message: backendMessage ?? "Resource not found." };
    case 409:
      return {
        status,
        code: "CONFLICT",
        message: backendMessage ?? "That time slot has just been taken. Please pick another one.",
      };
    case 422:
    case 400:
      return {
        status,
        code: "VALIDATION",
        message: backendMessage ?? "Please check the highlighted fields and try again.",
        fieldErrors: data?.fieldErrors,
      };
    case 429: {
      const retryAfterSeconds = parseRetryAfter(
        (headers?.["retry-after"] as string | undefined) ?? undefined,
      );
      return {
        status,
        code: "RATE_LIMITED",
        message: backendMessage ?? "Too many requests.",
        retryAfterSeconds,
      };
    }
    default:
      return {
        status,
        code: "SERVER",
        message: backendMessage ?? "The server had a problem. Please try again shortly.",
      };
  }
}

/** Human readable rate-limit copy shared by every screen. */
export function rateLimitMessage(error: ApiError): string {
  const wait = error.retryAfterSeconds;
  return wait
    ? `Too many requests. Please wait ${wait} second${wait === 1 ? "" : "s"} before trying again.`
    : "Too many requests. Please wait a moment before trying again.";
}

export function toDisplayMessage(error: ApiError): string {
  return error.code === "RATE_LIMITED" ? rateLimitMessage(error) : error.message;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeError(error);
    if (normalized.code === "UNAUTHORIZED") {
      setStoredToken(null);
      onUnauthorized?.();
    }
    return Promise.reject(normalized);
  },
);
