import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type InputProps = ComponentProps<"input"> & {
  invalid?: boolean;
};

export function Input({ invalid = false, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full rounded-md border bg-surface px-[13px] text-base text-ink shadow-field transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3 focus:outline-none sm:text-sm",
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
