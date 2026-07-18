import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CalloutTone = "info" | "success" | "warning" | "error";

const toneClasses: Record<CalloutTone, string> = {
  info: "border-accent-border bg-accent-soft text-accent-strong",
  success: "border-success-border bg-success-soft text-success",
  warning: "border-warning-border bg-warning-soft text-warning-strong",
  error: "border-vermilion-border bg-vermilion-soft text-vermilion-strong",
};

const iconClasses: Record<CalloutTone, string> = {
  info: "text-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-vermilion",
};

const defaultIcons: Record<CalloutTone, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕",
};

export type CalloutProps = ComponentProps<"div"> & {
  tone?: CalloutTone;
  icon?: ReactNode;
};

export function Callout({
  tone = "info",
  icon,
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "flex items-start gap-2.5 rounded-[9px] border px-3.5 py-3 text-[13px] leading-relaxed",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      <span aria-hidden className={cn("text-[15px]", iconClasses[tone])}>
        {icon ?? defaultIcons[tone]}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
