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
          "inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-[540] text-ink-2 transition-colors",
          "hover:bg-tint hover:text-ink focus-visible:shadow-ring focus-visible:outline-none",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span
          aria-hidden
          className="font-mono text-ink-3 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
        {summary}
      </summary>
      {children}
    </details>
  );
}
