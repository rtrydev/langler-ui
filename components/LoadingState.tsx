import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LoadingStateProps = {
  children: ReactNode;
  className?: string;
};

export function LoadingState({ children, className }: LoadingStateProps) {
  return (
    <p
      role="status"
      className={cn(
        "animate-pulse font-mono text-[13px] text-ink-3",
        className,
      )}
    >
      {children}
    </p>
  );
}
