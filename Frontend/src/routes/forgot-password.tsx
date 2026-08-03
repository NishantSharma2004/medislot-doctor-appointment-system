import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, Eye, KeyRound, Loader2, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/types";

interface ForgotSearch {
  email?: string;
}

export const Route = createFileRoute("/forgot-password")({
  validateSearch: (search: Record<string, unknown>): ForgotSearch => ({
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Forgot Password — MediSlot" },
      { name: "description", content: "Request password reset link for your MediSlot account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const search = Route.useSearch();
  const [email, setEmail] = useState(search.email ?? "");
  const [tokenCode, setTokenCode] = useState<string | null>(null);
  const [showOtpOnScreen, setShowOtpOnScreen] = useState(false);
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
    setShowOtpOnScreen(false);
    try {
      const res = await apiClient.post<{ message: string; resetToken?: string }>("/auth/forgot-password", {
        email: email.trim(),
      });
      setSubmitted(true);
      setResendCooldown(30);
      if (res.data?.resetToken) {
        setTokenCode(res.data.resetToken);
      }
      toast.success(`Password reset email sent to ${email}`);
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
      const res = await apiClient.post<{ message: string; resetToken?: string }>("/auth/forgot-password", {
        email: email.trim(),
      });
      setResendCooldown(30);
      if (res.data?.resetToken) {
        setTokenCode(res.data.resetToken);
      }
      toast.success(`Password reset email resent to ${email}`);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to resend reset email");
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
                <p className="font-semibold text-sm">Reset instructions sent!</p>
              </div>
              <p className="leading-relaxed">
                If an account with <span className="font-bold text-foreground">{email}</span> exists, we have sent a password reset OTP to your email address. Please check your inbox or spam folder.
              </p>
            </div>

            {/* Option 1: Real Email Path */}
            <div className="space-y-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 text-primary border-primary/30 hover:bg-primary/5 h-10"
                disabled={resendCooldown > 0 || isResending}
                onClick={handleResend}
              >
                {isResending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Resending Reset Email...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RotateCw className="size-4" /> Resend Email ({resendCooldown}s)
                  </>
                ) : (
                  <>
                    <RotateCw className="size-4" /> Resend Email
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-background px-2 text-muted-foreground">
                  OR USE INSTANT OTP FALLBACK
                </span>
              </div>
            </div>

            {/* Option 2: Instant On-Screen OTP Fallback Path */}
            {tokenCode ? (
              <div className="space-y-3">
                {!showOtpOnScreen ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 text-foreground font-medium border-dashed border-primary/50 hover:bg-primary/5 h-11"
                    onClick={() => setShowOtpOnScreen(true)}
                  >
                    <Eye className="size-4 text-primary" /> Didn't get email? Show OTP on screen
                  </Button>
                ) : (
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 space-y-3 text-left animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        ⚡ 6-Digit Password Reset OTP Code
                      </span>
                      <span className="text-[11px] text-muted-foreground bg-background px-2 py-0.5 rounded border">
                        Valid for 10 mins
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-background p-3 rounded-lg border font-mono text-2xl font-bold tracking-widest text-primary shadow-xs">
                      <span>{tokenCode}</span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="font-sans text-xs gap-1.5"
                        onClick={() => {
                          navigator.clipboard.writeText(tokenCode);
                          toast.success("OTP copied to clipboard!");
                        }}
                      >
                        <Copy className="size-3.5 text-primary" /> Copy OTP
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Use this 6-digit OTP code to set your new password directly below.
                    </p>
                  </div>
                )}

                <Button asChild className="w-full gap-2 h-11 text-sm font-semibold">
                  <Link to="/reset-password" search={{ token: tokenCode ?? undefined }}>
                    <KeyRound className="size-4" /> Enter Reset OTP & Set New Password
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-2">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <span>⚠️</span> No Account Found for "{email}"
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This email address is not registered in MediSlot (or had a typo during sign up). Please create an account to get started.
                  </p>
                  <Button asChild size="sm" className="w-full mt-1">
                    <Link to="/register">Create Account Now</Link>
                  </Button>
                </div>
              </div>
            )}

            <Button asChild variant="ghost" className="w-full mt-2">
              <Link to="/login">Back to Sign In</Link>
            </Button>
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
              {search.email ? (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                  ✓ Pre-filled from your login attempt
                </p>
              ) : null}
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
