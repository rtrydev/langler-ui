import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DisclosureProps = Omit<ComponentProps<"details">, "title"> & {
  summary: ReactNode;
};

export function Disclosure({
  summary,
  className,
  children,
  ...props
}: DisclosureProps) {
  return (
    <details className={cn("group", className)} {...props}>
      <summary
        className={cn(
          "inline-flex cursor-pointer list-none items-center gap-1.5 rounded-[5px] text-xs font-semibold text-accent",
          "hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span
          aria-hidden
          className="transition-transform group-open:rotate-90"
        >
          ›
        </span>
        {summary}
      </summary>
      {children}
    </details>
  );
}
