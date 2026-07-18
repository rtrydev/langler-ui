import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({
  invalid = false,
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-24 w-full rounded-[11px] border bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-3",
        "focus:border-accent focus:ring-[3px] focus:ring-accent-soft focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid ? "border-crimson" : "border-line",
        className,
      )}
      {...props}
    />
  );
}
