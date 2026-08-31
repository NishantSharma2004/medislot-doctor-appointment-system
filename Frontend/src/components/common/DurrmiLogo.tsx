import React from "react";

interface DurrmiLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function DurrmiLogoIcon({ className = "size-7 text-[#2A1608]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Durrmi Icon"
    >
      {/* Head 1 (Left dot) */}
      <circle cx="11" cy="7" r="4.5" />
      {/* Head 2 (Right dot) */}
      <circle cx="27" cy="7" r="4.5" />

      {/* Top Left Horizontal Arm Pill */}
      <rect x="4" y="14" width="20" height="9" rx="4.5" />

      {/* Bottom Connected Body Wrap */}
      <path
        d="M27 14C32 14 36 18 36 23V31C36 37 31 41 24 41H13C8 41 4 37 4 32V25H16C19.5 25 22 23 22 19.5V14H27Z"
      />
    </svg>
  );
}

export function DurrmiLogo({ className = "", iconOnly = false, size = "md" }: DurrmiLogoProps) {
  const sizeClasses = {
    sm: { icon: "size-6", text: "text-base tracking-[0.18em]" },
    md: { icon: "size-8", text: "text-xl tracking-[0.22em]" },
    lg: { icon: "size-11", text: "text-3xl tracking-[0.25em]" },
    xl: { icon: "size-16", text: "text-5xl tracking-[0.28em]" },
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
