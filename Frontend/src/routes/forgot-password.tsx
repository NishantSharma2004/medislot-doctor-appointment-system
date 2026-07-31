import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/types";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — MediSlot" },
      { name: "description", content: "Request password reset link for your MediSlot account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Password reset instructions sent");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your registered email address to receive password reset instructions.
      </p>

      <div className="surface-panel mt-6 p-6">
        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-semibold text-sm">Reset token generated!</p>
              <p className="mt-1">
                If an account with <span className="font-bold text-foreground">{email}</span> exists, password reset instructions with your reset token have been dispatched.
              </p>
            </div>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/reset-password">Enter Reset Token & Set New Password</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">Email Address</Label>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending instructions..." : "Send Reset Link"}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
