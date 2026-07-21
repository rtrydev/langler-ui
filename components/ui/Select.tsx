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
          "h-10 w-full cursor-pointer appearance-none rounded-md border border-line bg-surface pr-9 pl-[13px] text-sm font-medium text-ink shadow-field transition-[border-color,box-shadow] duration-150",
          "focus:border-accent focus:shadow-ring focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          selectClassName,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[11px] text-ink-3"
      >
        ▾
      </span>
    </div>
  );
}
