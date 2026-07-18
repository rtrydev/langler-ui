import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type OptionCardProps = ComponentProps<"button"> & {
  selected?: boolean;
};

export function OptionCard({
  selected = false,
  type = "button",
  className,
  ...props
}: OptionCardProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "block w-full cursor-pointer rounded-[11px] border p-4 text-left transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        selected
          ? "border-accent bg-accent-soft ring-[3px] ring-accent-soft"
          : "border-line bg-surface hover:border-ink-3",
        className,
      )}
      {...props}
    />
  );
}
