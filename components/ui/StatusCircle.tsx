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
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  error: "bg-vermilion-soft text-vermilion",
  neutral: "bg-tint text-ink-2",
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
        "inline-flex shrink-0 items-center justify-center rounded-full",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
