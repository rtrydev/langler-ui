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
  neutral: "border-line bg-tint text-ink-2",
  muted: "border-line bg-tint text-ink-3",
  accent: "border-accent-border bg-accent-soft text-accent-strong",
  vermilion: "border-vermilion-border bg-vermilion-soft text-vermilion",
  gold: "border-gold-border bg-gold-soft text-gold",
  crimson: "border-crimson-border bg-crimson-soft text-crimson",
  success: "border-success-border bg-success-soft text-success",
  warning: "border-warning-border bg-warning-soft text-warning",
};

export type BadgeProps = ComponentProps<"span"> & {
  tone?: BadgeTone;
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-[9px] py-[5px] text-xs leading-none font-[560] whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
