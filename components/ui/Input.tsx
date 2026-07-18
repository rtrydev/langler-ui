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
        "w-full rounded-lg border bg-surface px-3 py-2.5 text-base text-ink placeholder:text-ink-3 sm:text-sm",
        "focus:border-accent focus:ring-[3px] focus:ring-accent-soft focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid ? "border-crimson" : "border-line",
        className,
      )}
      {...props}
    />
  );
}
