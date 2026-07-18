import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CodeBlockProps = {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  preClassName?: string;
};

export function CodeBlock({
  title,
  actions,
  children,
  className,
  preClassName,
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[11px] border border-[#35322d] bg-[#211f1c]",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-[#35322d] px-3.5 py-2.5">
          <span className="font-mono text-xs text-[#a8a29a]">{title}</span>
          {actions}
        </div>
      )}
      <pre
        className={cn(
          "overflow-y-auto px-4 py-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-[#d8d3ca]",
          preClassName,
        )}
      >
        {children}
      </pre>
    </div>
  );
}
