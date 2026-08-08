import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { CalendarDays, LogOut, Menu, Stethoscope, User } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import { pingServer } from "@/lib/api/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth, homeRouteForRole } from "@/context/AuthContext";
import { NotificationBell } from "@/components/common/NotificationBell";
import type { Role } from "@/lib/api/types";
import { cn, getInitials } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  roles?: Role[];
  requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "Find a doctor", roles: ["PATIENT"] },
  { to: "/dashboard", label: "Dashboard", roles: ["PATIENT"], requiresAuth: true },
  { to: "/appointments", label: "Appointments", roles: ["PATIENT"], requiresAuth: true },
  { to: "/doctor", label: "Doctor desk", roles: ["DOCTOR"], requiresAuth: true },
  { to: "/doctor/availability", label: "Availability", roles: ["DOCTOR"], requiresAuth: true },
  { to: "/admin", label: "Admin Panel", roles: ["ADMIN"], requiresAuth: true },
];

function useVisibleNav() {
  const { isAuthenticated, user } = useAuth();
  return NAV_ITEMS.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.roles) {
      if (!user) {
        // Public guests see patient-focused navigation links
        if (!item.roles.includes("PATIENT")) return false;
      } else if (!item.roles.includes(user.role)) {
        return false;
      }
    }
    return true;
  });
}

export function AppHeader() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useVisibleNav();

  useEffect(() => {
    pingServer();
  }, []);

  function handleLogout() {
    logout();
    navigate({ to: "/login", replace: true });
  }

  return (
    <>
      {/* Demo Sandbox Quick Switch Bar */}
      {user?.email === "patient@medislot.test" ? (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-2 shadow-inner z-50 relative">
          <span>🧪 Demo Sandbox Active: Logged in as Demo Patient (Riya Sharma). Bookings route directly to Dr. Rajesh Sharma.</span>
          <button
            type="button"
            onClick={async () => {
              await login({ email: "doctor@medislot.test", password: "Password123!" });
              navigate({ to: "/doctor", replace: true });
            }}
            className="underline hover:text-emerald-100 font-bold bg-white/20 px-2.5 py-0.5 rounded text-[11px] transition-colors cursor-pointer"
          >
            Switch to Demo Doctor Desk ➔
          </button>
        </div>
      ) : null}

      {user?.email === "doctor@medislot.test" ? (
        <div className="bg-teal-700 text-white text-xs font-semibold py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-2 shadow-inner z-50 relative">
          <span>🧪 Demo Sandbox Active: Logged in as Demo Doctor (Dr. Rajesh Sharma). Inspect lab reports & issue prescriptions.</span>
          <button
            type="button"
            onClick={async () => {
              await login({ email: "patient@medislot.test", password: "Password123!" });
              navigate({ to: "/dashboard", replace: true });
            }}
            className="underline hover:text-teal-100 font-bold bg-white/20 px-2.5 py-0.5 rounded text-[11px] transition-colors cursor-pointer"
          >
            Switch to Demo Patient View ➔
          </button>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="MediSlot home">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope className="size-5" aria-hidden="true" />
          </span>
          <span className="truncate text-lg font-bold tracking-tight">MediSlot</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.to && "bg-primary-soft text-accent-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          {isAuthenticated && user ? (
            <>
              <NotificationBell />
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.fullName}
                      className="size-5 rounded-full object-cover"
                    />
                  ) : (
                    <span className="size-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">
                      {getInitials(user.fullName)}
                    </span>
                  )}
                  <span className="hidden max-w-28 truncate sm:inline">{user.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <span className="block truncate">{user.email}</span>
                  <span className="text-xs font-normal text-muted-foreground">{user.role}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: homeRouteForRole(user.role) })}>
                  <CalendarDays className="size-4" aria-hidden="true" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                  <User className="size-4" aria-hidden="true" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" aria-hidden="true" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Create account</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4">Menu</SheetTitle>
              <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1 px-2 pb-6">
                {items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                      pathname === item.to ? "bg-primary-soft text-accent-foreground" : "text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                {!isAuthenticated ? (
                  <div className="mt-3 flex flex-col gap-2 px-1">
                    <Button asChild variant="outline" onClick={() => setMobileOpen(false)}>
                      <Link to="/login">Sign in</Link>
                    </Button>
                    <Button asChild onClick={() => setMobileOpen(false)}>
                      <Link to="/register">Create account</Link>
                    </Button>
                  </div>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}

export function AppFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} MediSlot Clinic Appointment System</p>
        <p>Appointment scheduling only. For emergencies, contact your local emergency service.</p>
      </div>
    </footer>
  );
}

/** Standard page wrapper: heading block + content column. */
export function PageShell({
  title,
  description,
  actions,
  showBackButton = true,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  showBackButton?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {showBackButton ? (
        <div className="mb-4">
          <BackButton />
        </div>
      ) : null}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
