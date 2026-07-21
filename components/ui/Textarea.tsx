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
        "min-h-24 w-full resize-y rounded-md border bg-surface px-[13px] py-[11px] text-sm leading-relaxed text-ink shadow-field transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid
          ? "border-vermilion focus:border-vermilion focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--vermilion),transparent_66%)]"
          : "border-line focus:border-accent focus:shadow-ring",
        className,
      )}
      {...props}
    />
  );
}
