import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type StatusCircleTone =
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export type StatusCircleSize = "sm" | "md" | "lg";

const toneClasses: Record<StatusCircleTone, string> = {
  accent: "border-accent-border bg-accent-soft text-accent",
  success: "border-success-border bg-success-soft text-success",
  warning: "border-warning-border bg-warning-soft text-warning",
  error: "border-vermilion-border bg-vermilion-soft text-vermilion",
  neutral: "border-line bg-tint text-ink-2",
};

const sizeClasses: Record<StatusCircleSize, string> = {
  sm: "size-[22px] text-[13px]",
  md: "size-[30px] text-[15px]",
  lg: "size-11 text-[22px]",
};

export type StatusCircleProps = ComponentProps<"span"> & {
  tone?: StatusCircleTone;
  size?: StatusCircleSize;
};

export function StatusCircle({
  tone = "neutral",
  size = "sm",
  className,
  ...props
}: StatusCircleProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
