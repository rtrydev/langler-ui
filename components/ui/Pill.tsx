import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type PillTone = "accent" | "vermilion" | "gold" | "crimson";

const selectedToneClasses: Record<PillTone, string> = {
  accent: "border-accent-border bg-accent-soft text-accent-strong",
  vermilion: "border-vermilion-border bg-vermilion-soft text-vermilion",
  gold: "border-gold-border bg-gold-soft text-gold",
  crimson: "border-crimson-border bg-crimson-soft text-crimson",
};

export type PillProps = ComponentProps<"button"> & {
  selected?: boolean;
  tone?: PillTone;
};

export function Pill({
  selected = false,
  tone = "accent",
  type = "button",
  className,
  ...props
}: PillProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex cursor-pointer touch-manipulation items-center gap-1.5 rounded-full border px-[13px] py-1.5 text-[13px] font-[540] shadow-card transition-all duration-150",
        "focus-visible:shadow-ring focus-visible:outline-none",
        selected
          ? selectedToneClasses[tone]
          : "border-line bg-surface text-ink-2 hover:-translate-y-px hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
