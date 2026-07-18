import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type StepProgressProps = Omit<ComponentProps<"div">, "children"> & {
  total: number;
  completed: number;
};

export function StepProgress({
  total,
  completed,
  className,
  ...props
}: StepProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      className={cn("flex gap-[5px]", className)}
      {...props}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-[5px] flex-1 rounded-[3px]",
            i < completed ? "bg-accent" : "bg-line",
          )}
        />
      ))}
    </div>
  );
}
