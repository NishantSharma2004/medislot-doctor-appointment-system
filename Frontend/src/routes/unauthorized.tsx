import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeRouteForRole, useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Access Denied — MediSlot" },
      { name: "description", content: "You do not have permission to access this page." },
    ],
  }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  const { user } = useAuth();
  const dashboardLink = homeRouteForRole(user?.role);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive mb-4">
        <ShieldAlert className="size-8" />
      </span>
      <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your account role does not have permission to access this page or area.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="outline">
          <Link to="/">Go Home</Link>
        </Button>
        <Button asChild>
          <Link to={dashboardLink}>Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
