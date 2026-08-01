import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
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
import type { ApiError } from "@/lib/api/types";

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
      navigate({ to: search.redirect ?? homeRouteForRole(response.user.role), replace: true });
    } catch (caught) {
      const apiError = caught as ApiError;
      setError(apiError);
      toast.error("Sign in failed");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12">
      <BackButton className="mb-4 self-start" />
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Access your appointments, availability and clinic tools.
      </p>

      <div className="surface-panel mt-6 p-6">
        {error ? (
          <div className="mb-4">
            <ErrorState error={error} title="Could not sign in" onRetry={() => onSubmit(form.getValues())} />
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(form.formState.errors.email)}
              aria-describedby={form.formState.errors.email ? "email-error" : undefined}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p id="email-error" role="alert" className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(form.formState.errors.password)}
              aria-describedby={form.formState.errors.password ? "password-error" : undefined}
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p id="password-error" role="alert" className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          New patient?{" "}
          <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <div className="surface-panel mt-4 p-4 text-sm">
        <p className="font-medium">Demo accounts (mock service, password: password123)</p>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li>patient@medislot.test — patient</li>
          <li>doctor@medislot.test — doctor</li>
          <li>admin@medislot.test — administrator</li>
        </ul>
      </div>
    </div>
  );
}
