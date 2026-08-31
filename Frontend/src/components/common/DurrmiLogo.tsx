import React from "react";

interface DurrmiLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function DurrmiLogoIcon({ className = "size-7 text-[#2A1608]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 105"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Durrmi Icon"
    >
      {/* Head 1 (Top Left Circle) */}
      <circle cx="26" cy="20" r="14" />

      {/* Head 2 (Top Right Circle) */}
      <circle cx="74" cy="20" r="14" />

      {/* Middle Left Pill / Arm */}
      <rect x="12" y="42" width="48" height="22" rx="11" />

      {/* Bottom Right L/J Curved Body Wrap */}
      <path
        d="M60 42 H74 A14 14 0 0 1 88 56 V68 A28 28 0 0 1 60 96 H23 A11 11 0 0 1 12 85 V83 A11 11 0 0 1 23 72 H58 A8 8 0 0 0 66 64 V48 A6 6 0 0 0 60 42 Z"
      />
    </svg>
  );
}

export function DurrmiLogo({ className = "", iconOnly = false, size = "md" }: DurrmiLogoProps) {
  const sizeClasses = {
    sm: { icon: "size-7", text: "text-lg tracking-[0.2em]" },
    md: { icon: "size-9", text: "text-2xl tracking-[0.22em]" },
    lg: { icon: "size-12", text: "text-3xl tracking-[0.25em]" },
    xl: { icon: "size-20", text: "text-5xl tracking-[0.28em]" },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <DurrmiLogoIcon className={`${sizeClasses.icon} text-[#2A1608] shrink-0`} />
      {!iconOnly && (
        <span
          className={`font-black uppercase text-[#2A1608] ${sizeClasses.text}`}
          style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontWeight: 900 }}
        >
          DURRMI
        </span>
      )}
    </div>
  );
}
