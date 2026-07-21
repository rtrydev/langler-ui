import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center rounded-[6px] border border-b-2 border-line bg-surface px-[7px] py-0.5 font-mono text-xs text-ink-2 shadow-card",
        className,
      )}
      {...props}
    />
  );
}
