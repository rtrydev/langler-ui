import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone =
  | "neutral"
  | "muted"
  | "accent"
  | "vermilion"
  | "gold"
  | "crimson"
  | "success"
  | "warning";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-tint text-ink-2",
  muted: "bg-tint text-ink-3",
  accent: "bg-accent-soft text-accent",
  vermilion: "bg-vermilion-soft text-vermilion",
  gold: "bg-gold-soft text-gold",
  crimson: "bg-crimson-soft text-crimson",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

export type BadgeProps = ComponentProps<"span"> & {
  tone?: BadgeTone;
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[5px] px-2 py-[3px] text-[11px] font-semibold whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
