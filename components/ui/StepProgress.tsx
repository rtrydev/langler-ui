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
      className={cn("flex gap-1.5", className)}
      {...props}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 flex-1 rounded-full",
            i < completed
              ? "bg-accent bg-[linear-gradient(90deg,var(--accent-hi),var(--accent))]"
              : i === completed
                ? "bg-accent-soft"
                : "bg-tint",
          )}
        />
      ))}
    </div>
  );
}
