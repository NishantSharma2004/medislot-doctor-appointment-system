import { Navigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth, homeRouteForRole } from "@/context/AuthContext";
import { FullPageLoader } from "@/components/common/Loading";
import type { Role } from "@/lib/api/types";

/** Requires a signed-in user; unauthenticated visitors are sent to /login. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isLoading) return <FullPageLoader label="Checking your session" />;
  if (!isAuthenticated) {
    return <Navigate to="/login" search={{ redirect: pathname }} replace />;
  }
  return <>{children}</>;
}

/** Requires a signed-in user with one of the allowed roles. */
export function RoleBasedRoute({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isLoading) return <FullPageLoader label="Checking your access" />;
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" search={{ redirect: pathname }} replace />;
  }
  if (!hasRole(allow)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

export { homeRouteForRole };
