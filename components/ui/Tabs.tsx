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
    <div className={cn("flex gap-[22px] border-b border-line", className)}>
      {items.map((item) => {
        const active = item.value === activeValue;
        const itemClassName = cn(
          "-mb-px cursor-pointer border-b-2 pb-3 text-sm font-[540] transition-colors",
          "focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent",
          active
            ? "border-accent text-ink"
            : "border-transparent text-ink-3 hover:text-ink",
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
