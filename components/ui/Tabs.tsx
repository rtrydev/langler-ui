import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = {
  value: string;
  label: ReactNode;
  href?: string;
};

export type TabsProps = {
  items: TabItem[];
  activeValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
};

export function Tabs({ items, activeValue, onSelect, className }: TabsProps) {
  return (
    <div className={cn("flex gap-5 border-b border-line", className)}>
      {items.map((item) => {
        const active = item.value === activeValue;
        const itemClassName = cn(
          "cursor-pointer border-b-2 px-0.5 pb-2.5 text-sm transition-colors",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
          active
            ? "border-accent font-semibold text-accent"
            : "border-transparent text-ink-3 hover:text-ink-2",
        );
        return item.href ? (
          <a
            key={item.value}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={itemClassName}
          >
            {item.label}
          </a>
        ) : (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={onSelect ? () => onSelect(item.value) : undefined}
            className={itemClassName}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
