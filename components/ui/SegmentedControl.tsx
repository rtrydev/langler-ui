import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SegmentedOption = {
  value: string;
  label: ReactNode;
};

export type SegmentedControlProps = {
  name: string;
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function SegmentedControl({
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex overflow-hidden rounded-[7px] border border-line bg-surface",
        className,
      )}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="cursor-pointer border-l border-line first:border-l-0"
        >
          <input
            type="radio"
            className="peer sr-only"
            name={name}
            value={option.value}
            checked={value !== undefined ? value === option.value : undefined}
            defaultChecked={
              defaultValue !== undefined
                ? defaultValue === option.value
                : undefined
            }
            onChange={
              onValueChange ? () => onValueChange(option.value) : undefined
            }
          />
          <span
            className={cn(
              "block px-3 py-1.5 text-xs text-ink-2 select-none",
              "peer-checked:bg-accent peer-checked:text-on-accent",
              "peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-accent",
            )}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
