import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type MeterBarsProps = Omit<ComponentProps<"div">, "children"> & {
  value: number;
  max?: number;
};

export function MeterBars({
  value,
  max = 4,
  className,
  ...props
}: MeterBarsProps) {
  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-5 rounded-[2px]",
            i < value ? "bg-accent" : "bg-tint",
          )}
        />
      ))}
    </div>
  );
}
