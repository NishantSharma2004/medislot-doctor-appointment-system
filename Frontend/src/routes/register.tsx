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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import type { ApiError, Role } from "@/lib/api/types";

const SPECIALIZATIONS = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopaedics",
  "ENT",
  "Neurology",
  "Gynecology",
  "Ophthalmology",
  "Psychiatry",
  "Dental",
];

const registerSchema = z
  .object({
    role: z.enum(["PATIENT", "DOCTOR"]),
    fullName: z.string().min(2, "Enter your full name").max(100, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email address ending with a domain (e.g. name@gmail.com)"),
    phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Enter a valid 10 to 15 digit phone number"),
    password: z.string().min(8, "Use at least 8 characters").max(72, "Password is too long"),
    confirmPassword: z.string(),

    specializationName: z.string().optional(),
    qualifications: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    consultationFee: z.number().optional(),
    clinicName: z.string().optional(),
    city: z.string().optional(),
    registrationNumber: z.string().optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterValues = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as string)?.toUpperCase() === "DOCTOR" ? ("DOCTOR" as Role) : ("PATIENT" as Role),
  }),
  head: () => ({
    meta: [
      { title: "Create an account — MediSlot" },
      {
        name: "description",
        content: "Register as a patient or doctor on MediSlot.",
      },
      { property: "og:title", content: "Create an account — MediSlot" },
      { property: "og:description", content: "Register to access clinic appointment tools." },
    ],
  }),
  component: RegisterPage,
});

export function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [role, setRole] = useState<Role>(search.role === "DOCTOR" ? "DOCTOR" : "PATIENT");
  const [error, setError] = useState<ApiError | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "PATIENT",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      specializationName: "General Medicine",
      qualifications: "MBBS, MD",
      yearsOfExperience: 5,
      consultationFee: 500,
      clinicName: "MediSlot Health Center",
      city: "Delhi",
      registrationNumber: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await registerAccount({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: role,
        specializationName: role === "DOCTOR" ? values.specializationName : undefined,
        qualifications: role === "DOCTOR" ? values.qualifications : undefined,
        yearsOfExperience: role === "DOCTOR" ? values.yearsOfExperience : undefined,
        consultationFee: role === "DOCTOR" ? values.consultationFee : undefined,
        clinicName: role === "DOCTOR" ? values.clinicName : undefined,
        city: role === "DOCTOR" ? values.city : undefined,
        registrationNumber: role === "DOCTOR" ? values.registrationNumber : undefined,
      } as any);

      toast.success(`${role === "DOCTOR" ? "Doctor" : "Patient"} account created successfully.`);
      navigate({ to: role === "DOCTOR" ? "/doctor/availability" : "/dashboard", replace: true });
    } catch (caught) {
      const apiError = caught as ApiError;
      setError(apiError);
      toast.error(apiError.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col px-4 py-10">
      <BackButton className="mb-4 self-start" />
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose account type below to get started with MediSlot.
      </p>

      <div className="surface-panel mt-6 p-6 space-y-6">
        {/* Role Switcher Tabs */}
        <div className="flex rounded-lg bg-muted p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setRole("PATIENT");
              form.setValue("role", "PATIENT");
            }}
            className={`flex-1 rounded-md py-2.5 transition-all flex items-center justify-center gap-2 ${
              role === "PATIENT"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="size-4 text-primary" /> Patient Account
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("DOCTOR");
              form.setValue("role", "DOCTOR");
            }}
            className={`flex-1 rounded-md py-2.5 transition-all flex items-center justify-center gap-2 ${
              role === "DOCTOR"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Stethoscope className="size-4 text-primary" /> Doctor Account
          </button>
        </div>

        {error ? <ErrorState error={error} title="Could not create account" /> : null}

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">{role === "DOCTOR" ? "Full Name (e.g. Dr. Rajesh Sharma)" : "Full Name"}</Label>
            <Input id="fullName" placeholder={role === "DOCTOR" ? "Dr. Rajesh Sharma" : "Riya Sharma"} {...form.register("fullName")} />
            {form.formState.errors.fullName ? (
              <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="user@medislot.test" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+919876543210" {...form.register("phone")} />
              {form.formState.errors.phone ? (
                <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
              ) : null}
            </div>
          </div>

          {/* Doctor-Specific Fields */}
          {role === "DOCTOR" ? (
            <div className="border-t border-b py-4 my-2 space-y-4 bg-primary/5 p-4 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Doctor Profile Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="specializationName">Specialization</Label>
                  <Select
                    defaultValue="General Medicine"
                    onValueChange={(val) => form.setValue("specializationName", val)}
                  >
                    <SelectTrigger id="specializationName">
                      <SelectValue placeholder="Select Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALIZATIONS.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input id="qualifications" placeholder="MBBS, MD" {...form.register("qualifications")} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City / Location</Label>
                  <Input id="city" placeholder="Delhi" {...form.register("city")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input id="clinicName" placeholder="MediSlot Care Clinic" {...form.register("clinicName")} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                  <Input id="consultationFee" type="number" defaultValue={500} {...form.register("consultationFee", { valueAsNumber: true })} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="registrationNumber">Medical Registration No.</Label>
                  <Input id="registrationNumber" placeholder="REG-DEL-2026" {...form.register("registrationNumber")} />
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="At least 8 characters" {...form.register("password")} />
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
              {form.formState.errors.confirmPassword ? (
                <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
              ) : null}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || form.formState.isSubmitting}>
            {isSubmitting || form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Create {role === "DOCTOR" ? "Doctor" : "Patient"} Account
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground text-center">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
