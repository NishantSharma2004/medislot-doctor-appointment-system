import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "./types";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "https://medislot-doctor-appointment-system.onrender.com";

const TOKEN_STORAGE_KEY = "medislot.token";
const REFRESH_TOKEN_STORAGE_KEY = "medislot.refreshToken";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null, refreshToken?: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else window.localStorage.removeItem(TOKEN_STORAGE_KEY);

  if (refreshToken !== undefined) {
    if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    else window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

let onUnauthorized: (() => void) | null = null;
export function registerUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

function parseRetryAfter(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function normalizeError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return {
      status: 0,
      code: "UNKNOWN",
      message: "An unexpected error occurred. Please try again.",
    };
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
      message: `We could not reach the server at ${API_BASE_URL}. If the free server was sleeping, please wait a moment and click Try again.`,
    };
  }

  const { status, data, headers } = axiosError.response;
  let backendMessage = data?.message ?? data?.error;

  if (!backendMessage && data?.fieldErrors && typeof data.fieldErrors === "object") {
    backendMessage = Object.entries(data.fieldErrors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join("; ");
  }

  switch (status) {
    case 401:
      return {
        status,
        code: "UNAUTHORIZED",
        message: backendMessage ?? "Your session has expired or authentication is invalid. Please sign in again.",
      };
    case 403:
      return {
        status,
        code: "FORBIDDEN",
        message: backendMessage ?? "You do not have permission to perform this action.",
      };
    case 404:
      return { status, code: "NOT_FOUND", message: backendMessage ?? "Requested resource or endpoint was not found." };
    case 409:
      return {
        status,
        code: "CONFLICT",
        message: backendMessage ?? "That slot or resource is in a conflicting state. Please try another.",
      };
    case 422:
    case 400:
      return {
        status,
        code: "VALIDATION",
        message: backendMessage ?? "Validation failed. Please check your inputs.",
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
    case 503:
      return {
        status,
        code: "SERVER",
        message: backendMessage ?? "Service temporarily unavailable. Please try again shortly.",
      };
    default:
      return {
        status,
        code: "SERVER",
        message: backendMessage ?? `Server error (${status}). Please try again.`,
      };
  }
}

export function rateLimitMessage(error: ApiError): string {
  const wait = error.retryAfterSeconds;
  return wait
    ? `Too many requests. Please wait ${wait} second${wait === 1 ? "" : "s"} before trying again.`
    : "Too many requests. Please wait a moment before trying again.";
}

export function toDisplayMessage(error: ApiError): string {
  return error.code === "RATE_LIMITED" ? rateLimitMessage(error) : error.message;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const normalized = normalizeError(error);

    if (normalized.code === "UNAUTHORIZED" && originalRequest && !originalRequest._retry) {
      const refreshToken = getStoredRefreshToken();
      if (refreshToken && !originalRequest.url?.includes("/auth/refresh")) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post<{ accessToken?: string; token?: string; refreshToken?: string }>(
            `${API_BASE_URL}/api/v1/auth/refresh`,
            { refreshToken },
          );
          const newAccessToken = data.accessToken ?? data.token;
          const newRefreshToken = data.refreshToken ?? refreshToken;

          if (newAccessToken) {
            setStoredToken(newAccessToken, newRefreshToken);
            processQueue(null, newAccessToken);
            originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          setStoredToken(null, null);
          onUnauthorized?.();
          return Promise.reject(normalizeError(refreshErr));
        } finally {
          isRefreshing = false;
        }
      }

      setStoredToken(null, null);
      onUnauthorized?.();
    }

    return Promise.reject(normalized);
  },
);
