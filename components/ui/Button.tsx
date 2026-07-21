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
  primary:
    "border-accent-strong bg-accent bg-[linear-gradient(180deg,var(--accent-hi),var(--accent))] text-on-accent shadow-btn hover:-translate-y-px hover:brightness-[1.06] hover:shadow-btn-hover active:translate-y-0 active:brightness-[0.97]",
  secondary:
    "border-line bg-surface text-ink shadow-card hover:border-ink-3 hover:bg-tint",
  accent: "border-accent-border bg-accent-soft text-accent-strong hover:brightness-[1.03]",
  ghost: "border-transparent bg-transparent text-ink-2 hover:bg-tint hover:text-ink",
  danger: "border-transparent bg-transparent text-crimson hover:bg-crimson-soft",
  contrast:
    "border-ink bg-ink text-paper hover:-translate-y-px hover:opacity-90",
  link: "border-transparent bg-transparent text-accent hover:text-accent-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-sm px-3 text-[13px]",
  md: "h-[38px] gap-2 rounded-md px-[15px] text-sm",
  lg: "h-[46px] gap-2 rounded-md px-[22px] text-[15px]",
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
        "inline-flex cursor-pointer touch-manipulation items-center justify-center border font-[540] tracking-[-0.01em] whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color,filter,opacity] duration-150 ease-[cubic-bezier(.4,0,.2,1)] select-none",
        "focus-visible:shadow-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:brightness-100",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
