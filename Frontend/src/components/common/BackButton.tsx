import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  className?: string;
  fallbackTo?: string;
  label?: string;
}

export function BackButton({ className = "", fallbackTo = "/", label = "Back" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    const search = (router.state.location.search as Record<string, unknown>) ?? {};
    const hasRedirect = typeof search.redirect === "string" && search.redirect.length > 0;

    if (hasRedirect) {
      router.navigate({ to: fallbackTo });
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1 && document.referrer.includes(window.location.host)) {
      router.history.back();
    } else {
      router.navigate({ to: fallbackTo });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`group inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground ${className}`}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
      <span>{label}</span>
    </Button>
  );
}
