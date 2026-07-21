import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-dashed border-line bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-10 items-center justify-center rounded-md border border-line bg-surface text-xl text-ink-3 shadow-card">
          {icon}
        </div>
      )}
      <div className="text-lg font-semibold text-ink">{title}</div>
      {description && (
        <div className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-2">
          {description}
        </div>
      )}
      {children && (
        <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
