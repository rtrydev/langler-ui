import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ScaleStripItem = {
  label: string;
  active?: boolean;
  struck?: boolean;
};

export type ScaleStripProps = Omit<ComponentProps<"div">, "children"> & {
  items: ScaleStripItem[];
};

export function ScaleStrip({ items, className, ...props }: ScaleStripProps) {
  return (
    <div className={cn("flex gap-1", className)} {...props}>
      {items.map((item) => (
        <span
          className={cn(
            "flex-1 rounded-md border py-1.5 text-center font-mono text-[11px] font-[560]",
            item.active
              ? "border-accent-strong bg-accent bg-[linear-gradient(180deg,var(--accent-hi),var(--accent))] text-on-accent shadow-btn"
              : "border-line text-ink-3",
            item.struck && !item.active && "line-through opacity-70",
          )}
          key={item.label}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
