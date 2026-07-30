import { AlertTriangle, Clock, Inbox, RefreshCw, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toDisplayMessage } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/types";

/** Reusable error block. Understands the normalized ApiError, incl. HTTP 429. */
export function ErrorState({
  error,
  onRetry,
  title,
}: {
  error: ApiError | null;
  onRetry?: () => void;
  title?: string;
}) {
  if (!error) return null;
  const isRateLimited = error.code === "RATE_LIMITED";
  const isForbidden = error.code === "FORBIDDEN";
  const Icon = isRateLimited ? Clock : isForbidden ? ShieldAlert : AlertTriangle;

  return (
    <div
      role="alert"
      className="surface-panel flex flex-col items-start gap-3 border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          {title ?? (isRateLimited ? "Rate limit reached" : "Something went wrong")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{toDisplayMessage(error)}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

/** Reusable empty state. */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="surface-panel flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
        {icon ?? <Inbox className="size-6" aria-hidden="true" />}
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
