import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CodeBlockProps = {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  preClassName?: string;
};

const codeVars = {
  "--code-surface": "oklch(0.212 0.015 270)",
  "--code-line": "oklch(1 0 0 / 0.1)",
  "--code-ink": "oklch(0.968 0.004 270)",
  "--code-ink-3": "oklch(0.565 0.013 270)",
} as CSSProperties;

export function CodeBlock({
  title,
  actions,
  children,
  className,
  preClassName,
}: CodeBlockProps) {
  return (
    <div
      style={codeVars}
      className={cn(
        "overflow-hidden rounded-md border border-[var(--code-line)] bg-[var(--code-surface)] shadow-raised",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-glass-line px-4 py-2.5">
          <span className="font-mono text-xs text-[var(--code-ink-3)]">
            {title}
          </span>
          {actions}
        </div>
      )}
      <pre
        className={cn(
          "overflow-y-auto px-4 py-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--code-ink)]",
          preClassName,
        )}
      >
        {children}
      </pre>
    </div>
  );
}
