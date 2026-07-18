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
    <label className={cn("cursor-pointer", className)}>
      <input type={type} className="peer sr-only" {...props} />
      <span
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-[13px] text-ink-2 select-none",
          "peer-checked:border-accent peer-checked:bg-accent peer-checked:font-semibold peer-checked:text-on-accent",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          "peer-disabled:cursor-default peer-disabled:opacity-50",
          showCheck && "peer-checked:before:content-['✓']",
        )}
      >
        {children}
      </span>
    </label>
  );
}
