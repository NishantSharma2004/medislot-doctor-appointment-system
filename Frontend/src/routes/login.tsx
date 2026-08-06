import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Stethoscope, User } from "lucide-react";
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
      { title: "Sign in — MediSlot" },
      { name: "description", content: "Sign in to manage your MediSlot clinic appointments." },
      { property: "og:title", content: "Sign in — MediSlot" },
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
  const [error, setError] = useState<ApiError | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      const response = await login(values);
      toast.success(`Welcome back, ${response.user.fullName}`);

      let targetRedirect = search.redirect;
      const role = response.user.role;

      // Prevent redirecting to unauthorized role pages when switching roles
      if (role === "PATIENT" && targetRedirect && (targetRedirect.startsWith("/doctor") || targetRedirect.startsWith("/admin"))) {
        targetRedirect = undefined;
      } else if (role === "DOCTOR" && targetRedirect && (targetRedirect.startsWith("/admin") || targetRedirect.startsWith("/dashboard"))) {
        targetRedirect = undefined;
      }

      navigate({ to: targetRedirect ?? homeRouteForRole(role), replace: true });
    } catch (caught) {
      const apiError = caught as ApiError;
      setError(apiError);
      toast.error("Sign in failed");
    }
  }

  const fillDemoCredentials = (role: "PATIENT" | "DOCTOR") => {
    if (role === "PATIENT") {
      form.setValue("email", "patient@medislot.test");
      form.setValue("password", "Password123!");
    } else {
      form.setValue("email", "doctor@medislot.test");
      form.setValue("password", "Password123!");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-10">
      <BackButton className="mb-4 self-start" />
      <h1 className="text-2xl font-bold tracking-tight">
        {roleTab === "DOCTOR" ? "Doctor Sign In" : "Patient Sign In"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {roleTab === "DOCTOR"
          ? "Access your doctor dashboard, publish availability and review patients."
          : "Access your booked appointments, prescriptions and health records."}
      </p>

      <div className="surface-panel mt-6 p-6 space-y-5">
        {/* Role Switcher Tabs */}
        <div className="flex rounded-lg bg-muted p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRoleTab("PATIENT")}
            className={`flex-1 rounded-md py-2.5 transition-all flex items-center justify-center gap-2 ${
              roleTab === "PATIENT"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="size-4 text-primary" /> Patient Sign In
          </button>
          <button
            type="button"
            onClick={() => setRoleTab("DOCTOR")}
            className={`flex-1 rounded-md py-2.5 transition-all flex items-center justify-center gap-2 ${
              roleTab === "DOCTOR"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Stethoscope className="size-4 text-primary" /> Doctor Sign In
          </button>
        </div>

        {error ? (
          <ErrorState error={error} title="Could not sign in" onRetry={() => onSubmit(form.getValues())} />
        ) : null}

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email Address <span className="text-destructive font-bold">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={roleTab === "DOCTOR" ? "doctor@medislot.test" : "patient@medislot.test"}
              autoComplete="email"
              aria-invalid={Boolean(form.formState.errors.email)}
              className={form.formState.errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-xs font-semibold text-destructive">{form.formState.errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                Password <span className="text-destructive font-bold">*</span>
              </Label>
              <Link
                to="/forgot-password"
                search={{ email: form.watch("email") || undefined }}
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(form.formState.errors.password)}
              className={form.formState.errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-xs font-semibold text-destructive">{form.formState.errors.password.message}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Sign in as {roleTab === "DOCTOR" ? "Doctor" : "Patient"}
          </Button>
        </form>

        <div className="border-t pt-4 text-center space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            onClick={() => fillDemoCredentials(roleTab === "DOCTOR" ? "DOCTOR" : "PATIENT")}
          >
            Fill Demo {roleTab === "DOCTOR" ? "Doctor" : "Patient"} Credentials
          </Button>

          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
