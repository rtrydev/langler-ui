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
        "flex flex-col items-center px-6 py-10 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-[52px] items-center justify-center rounded-xl border border-line bg-surface text-2xl text-ink-3">
          {icon}
        </div>
      )}
      <div className="text-lg font-bold text-ink">{title}</div>
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
