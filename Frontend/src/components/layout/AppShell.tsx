import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, LogOut, Menu, User } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import { DurrmiLogo } from "@/components/common/DurrmiLogo";
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

export function UserAvatar({ name, imageUrl, className }: { name?: string; imageUrl?: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

  const cleanUrl = imageUrl?.trim().replace(/^["']|["']$/g, "") || "";
  const isValidWebUrl =
    cleanUrl &&
    (cleanUrl.startsWith("http://") ||
      cleanUrl.startsWith("https://") ||
      cleanUrl.startsWith("data:image/") ||
      cleanUrl.startsWith("/"));

  if (isValidWebUrl && !hasError) {
    return (
      <img
        src={cleanUrl}
        alt={name || "User"}
        onError={() => setHasError(true)}
        className={cn("size-5 rounded-full object-cover shrink-0", className)}
      />
    );
  }

  return (
    <span className={cn("size-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center shrink-0", className)}>
      {getInitials(name || "User")}
    </span>
  );
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "Find a doctor", roles: ["PATIENT"] },
  { to: "/health-risk-calculator", label: "🤖 AI Risk Calculator", roles: ["PATIENT"] },
  { to: "/dashboard", label: "Dashboard", roles: ["PATIENT"], requiresAuth: true },
  { to: "/appointments", label: "Appointments", roles: ["PATIENT"], requiresAuth: true },
  { to: "/health-vault", label: "📂 Health Vault", roles: ["PATIENT"], requiresAuth: true },
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

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

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

      <header className="sticky top-0 z-40 border-b border-amber-200/50 bg-[#FAF7EF]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Left Brand Logo */}
          <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Durrmi home">
            <DurrmiLogo size="sm" />
          </Link>

          {/* Center Floating Pill Menu */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center bg-white/90 border border-amber-300/60 rounded-full px-7 py-2 shadow-xs gap-6 text-xs font-extrabold text-slate-800">
            <Link to="/" className="hover:text-amber-800 transition-colors">Home</Link>
            <a href="#why-durrmi" onClick={(e) => handleScrollTo(e, "why-durrmi")} className="hover:text-amber-800 transition-colors cursor-pointer">About Us</a>
            
            {/* Interactive Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-amber-800 transition-colors flex items-center gap-1 cursor-pointer outline-none font-extrabold">
                Services <ChevronDown className="size-3.5 text-amber-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64 p-2 bg-white rounded-2xl border border-amber-200 shadow-xl space-y-1 z-50">
                <DropdownMenuLabel className="text-[11px] font-black uppercase text-amber-900 tracking-wider px-2.5 py-1.5">
                  Clinical Specialisations
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-amber-100" />
                <DropdownMenuItem onClick={() => navigate({ to: "/doctors", search: { specialization: "General Medicine" } })} className="cursor-pointer rounded-xl font-extrabold text-xs py-2 text-slate-800 hover:bg-amber-50">
                  🩺 General Medicine
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/doctors", search: { specialization: "Dermatology" } })} className="cursor-pointer rounded-xl font-extrabold text-xs py-2 text-slate-800 hover:bg-amber-50">
                  ✨ Dermatology & Skin Care
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/doctors", search: { specialization: "Cardiology" } })} className="cursor-pointer rounded-xl font-extrabold text-xs py-2 text-slate-800 hover:bg-amber-50">
                  🫀 Cardiology & Heart Health
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/doctors", search: { specialization: "Neurology" } })} className="cursor-pointer rounded-xl font-extrabold text-xs py-2 text-slate-800 hover:bg-amber-50">
                  🧠 Neurology & Headache
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/doctors", search: { specialization: "Ophthalmology" } })} className="cursor-pointer rounded-xl font-extrabold text-xs py-2 text-slate-800 hover:bg-amber-50">
                  👁️ Ophthalmology & Eye Care
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/doctors", search: { specialization: "Orthopaedics" } })} className="cursor-pointer rounded-xl font-extrabold text-xs py-2 text-slate-800 hover:bg-amber-50">
                  🦴 Orthopaedics & Joint Care
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-amber-100" />
                <DropdownMenuItem onClick={() => navigate({ to: "/doctors" })} className="cursor-pointer rounded-xl font-black text-xs py-2 text-amber-950 bg-amber-100/70 hover:bg-amber-200">
                  🔍 Explore All Specialisations ➔
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="#pricing" onClick={(e) => handleScrollTo(e, "pricing")} className="hover:text-amber-800 transition-colors cursor-pointer">Pricing</a>
            <Link to="/doctors" className="hover:text-amber-800 transition-colors">Meet Our Therapists</Link>
            <a href="#faq" onClick={(e) => handleScrollTo(e, "faq")} className="hover:text-amber-800 transition-colors cursor-pointer">FAQ</a>
          </nav>

          {/* Right Action Buttons (Login & Sign Up) */}
          <div className="flex items-center justify-end gap-3">
            {isAuthenticated && user ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 rounded-full border-amber-300 bg-white font-bold text-slate-900">
                      <UserAvatar name={user.fullName} imageUrl={user.profileImageUrl} className="size-5" />
                      <span className="hidden max-w-28 truncate sm:inline">{user.fullName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <span className="block truncate font-bold">{user.fullName}</span>
                      <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
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
              <div className="flex items-center gap-2.5">
                <Button asChild size="sm" className="h-9 px-5 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs shadow-xs border border-amber-500/40">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-9 px-5 rounded-full border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs shadow-xs">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-full border-amber-300" aria-label="Open menu">
                  <Menu className="size-4" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-[#FAF7EF]">
                <SheetTitle className="px-4 pt-4 font-black text-slate-900">Menu</SheetTitle>
                <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1.5 px-2 pb-6">
                  <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-100">
                    Home
                  </Link>
                  <a href="/#why-durrmi" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-100">
                    About Us
                  </a>
                  <Link to="/doctors" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-100">
                    Services / Specialisations
                  </Link>
                  <a href="/#pricing" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-100">
                    Pricing
                  </a>
                  <Link to="/doctors" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-100">
                    Meet Our Therapists
                  </Link>
                  <a href="/#faq" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-100">
                    FAQ
                  </a>
                  {!isAuthenticated ? (
                    <div className="mt-3 flex flex-col gap-2 px-1">
                      <Button asChild className="rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs" onClick={() => setMobileOpen(false)}>
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full border-slate-300 bg-white font-extrabold text-xs" onClick={() => setMobileOpen(false)}>
                        <Link to="/register">Sign Up</Link>
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
