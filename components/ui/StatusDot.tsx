import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type StatusDotTone =
  | "accent"
  | "vermilion"
  | "gold"
  | "crimson"
  | "success"
  | "warning"
  | "neutral";

const toneClasses: Record<StatusDotTone, string> = {
  accent: "bg-accent",
  vermilion: "bg-vermilion",
  gold: "bg-gold",
  crimson: "bg-crimson",
  success: "bg-success",
  warning: "bg-warning",
  neutral: "bg-ink-3",
};

export type StatusDotProps = Omit<ComponentProps<"span">, "children"> & {
  tone?: StatusDotTone;
};

export function StatusDot({
  tone = "neutral",
  className,
  ...props
}: StatusDotProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
