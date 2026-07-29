"use client";

import { forwardRef, type ComponentProps } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "solid";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ComponentProps<"button">, "type"> {
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button without shifting layout. */
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: `
      bg-ink-900 text-white tracking-wide
      hover:bg-rust-600 active:bg-rust-700
    `,
  // Kept distinct from `primary` at the type level for callers that want to
  // express intent, but currently shares its visual treatment.
  secondary: `
      bg-ink-900 text-white tracking-wide
      hover:bg-rust-600 active:bg-rust-700
    `,
  outline: `
      border border-line-strong text-ink tracking-wide bg-transparent
      hover:border-ink hover:bg-ink-900 hover:text-white
    `,
  ghost: `
      bg-transparent text-ink tracking-wide
      hover:bg-sunken
    `,
  destructive: `
      bg-critical text-white tracking-wide
      hover:brightness-95 active:brightness-90
    `,
  solid: `
      bg-rust-500 text-white tracking-wide
      hover:bg-rust-600
    `,
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-sm py-2 px-4",
  md: "text-base py-3 px-6",
  lg: "text-base py-3.5 px-8",
};

const SPINNER_SIZE: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-4.5 h-4.5",
};

const BASE_CLASSES =
  "relative outline-none border-none z-10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium inline-flex items-center justify-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    type = "button",
    disabled = false,
    className = "",
    variant = "primary",
    size = "md",
    loading = false,
    ...props
  },
  ref,
) {
  const combinedClasses = [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  ]
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={combinedClasses}
      {...props}
    >
      {loading && (
        <Loader2 className={`${SPINNER_SIZE[size]} animate-spin`} aria-hidden="true" />
      )}
      {children}
    </button>
  );
});

export default Button;
