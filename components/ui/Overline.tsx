import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type OverlineProps = ComponentProps<"div"> & {
  as?: "div" | "span" | "h2" | "h3" | "h4";
};

export function Overline({
  as: Tag = "div",
  className,
  ...props
}: OverlineProps) {
  return (
    <Tag
      className={cn(
        "font-mono text-[11px] font-medium tracking-[0.14em] text-ink-3 uppercase",
        className,
      )}
      {...props}
    />
  );
}
