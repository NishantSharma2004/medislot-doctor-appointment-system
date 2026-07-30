import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Reusable pagination control driven by the backend PageResponse
 * (zero-based `page`, plus `totalPages` / `totalElements`).
 */
export function PaginationControls({
  page,
  totalPages,
  totalElements,
  onPageChange,
  label = "results",
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  if (totalElements === 0) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i).filter(
    (i) => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Page {page + 1} of {totalPages} · {totalElements} {label}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Prev
        </Button>
        {pages.map((p, index) => (
          <span key={p} className="flex items-center">
            {index > 0 && p - pages[index - 1] > 1 ? (
              <span className="px-1 text-muted-foreground" aria-hidden="true">
                …
              </span>
            ) : null}
            <Button
              variant={p === page ? "default" : "ghost"}
              size="sm"
              className="min-w-9"
              onClick={() => onPageChange(p)}
              aria-label={`Go to page ${p + 1}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p + 1}
            </Button>
          </span>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
