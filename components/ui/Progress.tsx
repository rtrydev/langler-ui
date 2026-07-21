import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ProgressProps = Omit<ComponentProps<"div">, "children"> & {
  value: number;
};

export function Progress({ value, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 overflow-hidden rounded-full bg-tint shadow-field",
        className,
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-accent bg-[linear-gradient(90deg,var(--accent-hi),var(--accent))]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
