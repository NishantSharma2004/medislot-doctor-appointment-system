import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Stethoscope, User, Eye, EyeOff, Sparkles, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ErrorState } from "@/components/common/ErrorState";
import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { homeRouteForRole, useAuth } from "@/context/AuthContext";
import type { ApiError, Role } from "@/lib/api/types";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Durrmi Healthcare" },
      { name: "description", content: "Sign in to manage your Durrmi clinic appointments." },
      { property: "og:title", content: "Sign in — Durrmi Healthcare" },
      { property: "og:description", content: "Sign in to manage your clinic appointments." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [roleTab, setRoleTab] = useState<Role>("PATIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      const response = await login(values);
      const role = response.user.role;

      // Enforce strict tab role validation (prevent Patient logging in via Doctor tab)
      if (roleTab && role !== roleTab && (role === "PATIENT" || role === "DOCTOR")) {
        const expectedRoleName = roleTab === "DOCTOR" ? "Doctor" : "Patient";
        const actualRoleName = role === "DOCTOR" ? "Doctor" : "Patient";
        const roleErrorMessage = `Account Role Mismatch: This account is registered as a ${actualRoleName}, but you selected ${expectedRoleName} Sign In tab.`;

        setError({
          status: 400,
          message: roleErrorMessage,
        });
        toast.error(`Please select the ${actualRoleName} Sign In tab`);
        return;
      }

      toast.success(`Welcome back, ${response.user.fullName}`);

      let targetRedirect = search.redirect;

      // Strict role-based target redirect sanitizer
      if (role === "PATIENT") {
        if (targetRedirect && (targetRedirect.startsWith("/doctor") || targetRedirect.startsWith("/admin"))) {
          targetRedirect = undefined;
        }
      } else if (role === "DOCTOR") {
        if (!targetRedirect || !targetRedirect.startsWith("/doctor")) {
          targetRedirect = undefined;
        }
      } else if (role === "ADMIN") {
        if (!targetRedirect || !targetRedirect.startsWith("/admin")) {
          targetRedirect = undefined;
        }
      }

      navigate({ to: targetRedirect ?? homeRouteForRole(role), replace: true });
    } catch (caught) {
      const apiError = caught as ApiError;
      setError(apiError);
      toast.error("Sign in failed");
    }
  }

  const fillDemoCredentials = (role: "PATIENT" | "DOCTOR" | "ADMIN") => {
    if (role === "PATIENT") {
      form.setValue("email", "patient@durrmi.test");
      form.setValue("password", "Password123!");
    } else if (role === "DOCTOR") {
      form.setValue("email", "doctor@durrmi.test");
      form.setValue("password", "Password123!");
    } else {
      form.setValue("email", "admin@durrmi.test");
      form.setValue("password", "Password123!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-md">
        <BackButton className="mb-6 self-start" />
        
        <div className="text-center space-y-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-300">
            <Sparkles className="size-3 text-amber-600" /> Welcome To Durrmi
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {roleTab === "DOCTOR" ? "Doctor Sign In" : "Patient Sign In"}
          </h1>
          <p className="text-xs text-slate-600">
            {roleTab === "DOCTOR"
              ? "Access your doctor desk, publish slots and review patient records."
              : "Access your booked appointments, prescriptions and health vault."}
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200/80 bg-white p-8 shadow-xs space-y-6">
          {/* Role Switcher Tabs */}
          <div className="flex rounded-2xl bg-amber-50 p-1 text-xs font-bold border border-amber-200/60">
            <button
              type="button"
              onClick={() => setRoleTab("PATIENT")}
              className={`flex-1 rounded-xl py-2.5 transition-all flex items-center justify-center gap-2 ${
                roleTab === "PATIENT"
                  ? "bg-white text-slate-900 shadow-xs font-extrabold border border-amber-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="size-4 text-amber-600" /> Patient Sign In
            </button>
            <button
              type="button"
              onClick={() => setRoleTab("DOCTOR")}
              className={`flex-1 rounded-xl py-2.5 transition-all flex items-center justify-center gap-2 ${
                roleTab === "DOCTOR"
                  ? "bg-white text-slate-900 shadow-xs font-extrabold border border-amber-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Stethoscope className="size-4 text-amber-600" /> Doctor Sign In
            </button>
          </div>

          {error ? (
            <ErrorState error={error} title="Could not sign in" onRetry={() => onSubmit(form.getValues())} />
          ) : null}

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Email Address <span className="text-rose-600 font-bold">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={roleTab === "DOCTOR" ? "doctor@medislot.test" : "patient@medislot.test"}
                autoComplete="email"
                aria-invalid={Boolean(form.formState.errors.email)}
                className={`h-11 rounded-xl border-slate-200 text-xs font-medium ${form.formState.errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-xs font-bold text-rose-600">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                  Password <span className="text-rose-600 font-bold">*</span>
                </Label>
                <Link
                  to="/forgot-password"
                  search={{ email: form.watch("email") || undefined }}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  className={`h-11 rounded-xl pr-10 border-slate-200 text-xs font-medium ${form.formState.errors.password ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p className="text-xs font-bold text-rose-600">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full h-11 rounded-2xl bg-amber-600 text-white font-extrabold hover:bg-amber-700 shadow-sm" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Sign in as {roleTab === "DOCTOR" ? "Doctor" : "Patient"}
            </Button>
          </form>

          <div className="border-t pt-4 text-center space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-[11px] font-bold text-slate-600 border-slate-300 hover:bg-slate-100"
                onClick={() => fillDemoCredentials(roleTab === "DOCTOR" ? "DOCTOR" : "PATIENT")}
              >
                <KeyRound className="size-3.5 mr-1 text-amber-600" /> Demo {roleTab === "DOCTOR" ? "Doctor" : "Patient"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-[11px] font-bold text-amber-900 border-amber-300 bg-amber-50 hover:bg-amber-100"
                onClick={() => fillDemoCredentials("ADMIN")}
              >
                <KeyRound className="size-3.5 mr-1 text-amber-700" /> Demo Admin
              </Button>
            </div>

            <p className="text-xs font-medium text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-extrabold text-amber-700 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
