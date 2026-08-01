import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, KeyRound, Loader2, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/components/common/BackButton";
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
  const [isResending, setIsResending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: email.trim() });
      setSubmitted(true);
      setResendCooldown(30);
      toast.success("Password reset token generated");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending || !email.trim()) return;
    setIsResending(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: email.trim() });
      toast.success(`Reset token resent to ${email}`);
      setResendCooldown(30);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to resend reset token");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12">
      <BackButton className="mb-4 self-start" />
      <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your registered email address to receive password reset instructions.
      </p>

      <div className="surface-panel mt-6 p-6">
        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-800 dark:text-emerald-300 text-left space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="font-semibold text-sm">Reset token generated!</p>
              </div>
              <p className="leading-relaxed">
                If an account with <span className="font-bold text-foreground">{email}</span> exists, password reset instructions with your reset token have been dispatched.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button asChild className="w-full gap-2">
                <Link to="/reset-password">
                  <KeyRound className="size-4" /> Enter Reset Token & Set New Password
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 text-primary border-primary/30 hover:bg-primary/5"
                disabled={resendCooldown > 0 || isResending}
                onClick={handleResend}
              >
                {isResending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Resending...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RotateCw className="size-4" /> Resend Link / Token ({resendCooldown}s)
                  </>
                ) : (
                  <>
                    <RotateCw className="size-4" /> Resend Link / Token
                  </>
                )}
              </Button>

              <Button asChild variant="ghost" className="w-full">
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
