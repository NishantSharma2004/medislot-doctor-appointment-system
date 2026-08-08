import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "US";
  const cleanName = name.trim().replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, "");
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "US";
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDoctorDisplayName(name?: string | null): string {
  if (!name || !name.trim()) return "Doctor";
  const trimmed = name.trim();
  if (/^Dr\.?\s+/i.test(trimmed)) {
    return trimmed;
  }
  return `Dr. ${trimmed}`;
}

