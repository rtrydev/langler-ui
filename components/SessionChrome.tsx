import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type SessionChromeProps = {
  exitHref: string;
  exitLabel: string;
  badge?: ReactNode;
  progress?: ReactNode;
  counter?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function SessionChrome({
  exitHref,
  exitLabel,
  badge,
  progress,
  counter,
  footer,
  children,
  className,
  bodyClassName,
}: SessionChromeProps) {
  return (
    <Card
      elevation="raised"
      padding="none"
      className={cn(
        "mx-auto flex min-h-[31rem] max-w-[620px] flex-col overflow-hidden",
        className,
      )}
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <Link
          aria-label={exitLabel}
          href={exitHref}
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-tint hover:text-ink"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
        {badge}
        <div className="flex flex-1 items-center">{progress}</div>
        {counter && (
          <span className="shrink-0 font-mono text-xs text-ink-3">
            {counter}
          </span>
        )}
      </header>
      <div className={cn("flex flex-1 flex-col p-5 sm:p-8", bodyClassName)}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-line p-4 sm:p-5">{footer}</div>
      )}
    </Card>
  );
}
