import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/common/ErrorState";
import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/types";

interface ResetSearch {
  token?: string;
}

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetSearch => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Reset Password — MediSlot" },
      { name: "description", content: "Set a new password for your MediSlot account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [token, setToken] = useState(search.token ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);

    if (!token.trim()) {
      setValidationError("OTP / Reset Token is required.");
      toast.error("Please enter your OTP / Reset Token");
      return;
    }

    if (newPassword.length < 8) {
      setValidationError("New password must be at least 8 characters long.");
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match. Please ensure both password fields are identical.");
      toast.error("New password and confirmation password do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/reset-password", {
        token: token.trim(),
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      toast.success("Password reset successfully! Please sign in with your new password.");
      navigate({ to: "/login" });
    } catch (err) {
      const errorObj = err as ApiError;
      setApiError(errorObj);
      toast.error(errorObj.message || "Failed to reset password. Please check your reset token.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12">
      <BackButton className="mb-4 self-start" />
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your OTP / reset token and new password.
      </p>

      <div className="surface-panel mt-6 p-6">
        {/* Render explicit API Error Card */}
        {apiError ? (
          <div className="mb-4">
            <ErrorState error={apiError} title="Password Reset Error" />
          </div>
        ) : null}

        {/* Render local validation error */}
        {validationError ? (
          <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive font-medium">
            ⚠️ {validationError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="reset-token">OTP / Reset Token</Label>
            <Input
              id="reset-token"
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setValidationError(null);
              }}
              placeholder="Enter OTP / token code sent to your email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reset-new-password">New Password</Label>
            <div className="relative">
              <Input
                id="reset-new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setValidationError(null);
                }}
                placeholder="At least 8 characters"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-1 rounded-md transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                title={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reset-confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="reset-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Re-enter your new password"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-1 rounded-md transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword ? (
              <p className="text-xs font-semibold text-destructive mt-1">
                ❌ Passwords do not match
              </p>
            ) : newPassword && confirmPassword && newPassword === confirmPassword ? (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                ✓ Passwords match
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full font-semibold">
            {isSubmitting ? "Resetting password..." : "Reset Password"}
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-medium text-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
