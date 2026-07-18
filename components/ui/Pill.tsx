import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type PillTone = "accent" | "vermilion" | "gold" | "crimson";

const selectedToneClasses: Record<PillTone, string> = {
  accent: "bg-accent",
  vermilion: "bg-vermilion",
  gold: "bg-gold",
  crimson: "bg-crimson",
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
        "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-[7px] text-[13px] transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        selected
          ? cn("font-semibold text-on-accent", selectedToneClasses[tone])
          : "border border-line bg-surface font-medium text-ink-2 hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
