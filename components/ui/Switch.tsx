import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type SwitchProps = Omit<ComponentProps<"input">, "type"> & {
  children?: React.ReactNode;
};

export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-[13px] text-ink-2",
        className,
      )}
    >
      <input type="checkbox" role="switch" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          "relative h-5 w-[34px] shrink-0 rounded-full bg-line transition-colors",
          "after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-surface after:shadow-card after:transition-transform after:content-['']",
          "peer-checked:bg-accent peer-checked:after:translate-x-[14px]",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          "peer-disabled:opacity-50",
        )}
      />
      {children}
    </label>
  );
}
