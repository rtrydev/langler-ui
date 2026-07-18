import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "danger"
  | "contrast"
  | "link";

export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-line bg-transparent text-ink hover:bg-surface",
  accent:
    "border border-accent-border bg-transparent text-accent hover:bg-accent-soft",
  ghost: "bg-transparent text-ink-2 hover:bg-tint",
  danger: "bg-transparent text-crimson hover:bg-crimson-soft",
  contrast: "bg-ink text-paper hover:opacity-90",
  link: "bg-transparent text-accent hover:text-accent-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 rounded-[7px] px-3 py-1.5 text-xs",
  md: "gap-2 rounded-lg px-4 py-2.5 text-[13px]",
  lg: "gap-2 rounded-lg px-6 py-3 text-sm",
};

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-default disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
