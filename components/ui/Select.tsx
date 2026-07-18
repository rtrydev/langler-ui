import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type SelectProps = ComponentProps<"select"> & {
  selectClassName?: string;
};

export function Select({
  className,
  selectClassName,
  children,
  ...props
}: SelectProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <select
        className={cn(
          "w-full cursor-pointer appearance-none rounded-lg border border-line bg-surface py-2 pr-8 pl-3 text-[13px] font-medium text-ink",
          "focus:border-accent focus:ring-[3px] focus:ring-accent-soft focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          selectClassName,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] text-ink-3"
      >
        ▾
      </span>
    </div>
  );
}
