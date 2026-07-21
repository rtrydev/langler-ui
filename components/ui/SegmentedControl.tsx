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
        "inline-flex gap-0.5 rounded-md border border-line bg-tint p-[3px]",
        className,
      )}
    >
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer touch-manipulation">
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
              "block rounded-[8px] px-[13px] py-1.5 text-[13px] font-[540] text-ink-2 transition-all duration-150 select-none",
              "peer-checked:bg-surface peer-checked:text-ink peer-checked:shadow-card",
              "peer-focus-visible:shadow-ring peer-focus-visible:outline-none",
            )}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
