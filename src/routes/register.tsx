import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import type { ApiError } from "@/lib/api/types";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Enter your full name").max(80, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterValues = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create a patient account — MediSlot" },
      {
        name: "description",
        content: "Register as a patient to book and manage clinic appointments on MediSlot.",
      },
      { property: "og:title", content: "Create a patient account — MediSlot" },
      { property: "og:description", content: "Register to book clinic appointments." },
    ],
  }),
  component: RegisterPage,
});

const FIELDS: Array<{
  name: keyof RegisterValues;
  label: string;
  type: string;
  autoComplete: string;
  hint?: string;
}> = [
  { name: "fullName", label: "Full name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", hint: "10 digits, no spaces" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    hint: "At least 8 characters, with a letter and a number",
  },
  { name: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password" },
];

function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<ApiError | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterValues) {
    setError(null);
    try {
      await registerAccount({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      toast.success("Account created. You are signed in.");
      navigate({ to: "/dashboard", replace: true });
    } catch (caught) {
      const apiError = caught as ApiError;
      setError(apiError);
      toast.error("Registration failed");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Create your patient account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Registration is for patients. Doctor and administrator accounts are created by the clinic.
      </p>

      <div className="surface-panel mt-6 p-6">
        {error ? (
          <div className="mb-4">
            <ErrorState error={error} title="Could not create the account" />
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {FIELDS.map((field) => {
            const fieldError = form.formState.errors[field.name];
            return (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={
                    fieldError ? `${field.name}-error` : field.hint ? `${field.name}-hint` : undefined
                  }
                  {...form.register(field.name)}
                />
                {field.hint && !fieldError ? (
                  <p id={`${field.name}-hint`} className="text-xs text-muted-foreground">
                    {field.hint}
                  </p>
                ) : null}
                {fieldError ? (
                  <p id={`${field.name}-error`} role="alert" className="text-sm text-destructive">
                    {fieldError.message as string}
                  </p>
                ) : null}
              </div>
            );
          })}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Create account
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
