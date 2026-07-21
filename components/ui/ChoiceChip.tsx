import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ChoiceChipProps = Omit<ComponentProps<"input">, "type" | "children"> & {
  type?: "radio" | "checkbox";
  showCheck?: boolean;
  children: ReactNode;
};

export function ChoiceChip({
  type = "radio",
  showCheck = type === "checkbox",
  className,
  children,
  ...props
}: ChoiceChipProps) {
  return (
    <label className={cn("cursor-pointer touch-manipulation", className)}>
      <input type={type} className="peer sr-only" {...props} />
      <span
        className={cn(
          "flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 py-[9px] text-sm text-ink shadow-card transition-all duration-150 select-none",
          "hover:-translate-y-px hover:border-ink-3",
          "peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:font-[540] peer-checked:text-accent-strong",
          "peer-focus-visible:shadow-ring peer-focus-visible:outline-none",
          "peer-disabled:cursor-default peer-disabled:opacity-50",
          showCheck && "peer-checked:before:content-['✓']",
        )}
      >
        {children}
      </span>
    </label>
  );
}
