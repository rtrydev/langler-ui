import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type SwitchProps = Omit<ComponentProps<"input">, "type"> & {
  children?: React.ReactNode;
};

export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer touch-manipulation items-center gap-2 text-[13px] text-ink-2",
        className,
      )}
    >
      <input type="checkbox" role="switch" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full border border-line bg-tint transition-all duration-200",
          "after:absolute after:top-[2px] after:left-[2px] after:size-[18px] after:rounded-full after:bg-surface after:shadow-card after:transition-transform after:duration-200 after:content-['']",
          "peer-checked:border-accent-strong peer-checked:bg-[linear-gradient(180deg,var(--accent-hi),var(--accent))] peer-checked:after:translate-x-4 peer-checked:after:bg-white",
          "peer-focus-visible:shadow-ring peer-focus-visible:outline-none",
          "peer-disabled:opacity-50",
        )}
      />
      {children}
    </label>
  );
}
