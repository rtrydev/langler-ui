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
        "block w-full cursor-pointer touch-manipulation rounded-md border bg-surface p-4 text-left transition-all duration-150",
        "focus-visible:shadow-ring focus-visible:outline-none",
        selected
          ? "border-accent shadow-[inset_0_0_0_1px_var(--accent),var(--shadow-card)]"
          : "border-line shadow-card hover:-translate-y-px hover:border-ink-3 hover:shadow-raised",
        className,
      )}
      {...props}
    />
  );
}
