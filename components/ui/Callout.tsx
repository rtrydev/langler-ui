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

function DefaultIcon({ tone }: { tone: CalloutTone }) {
  const common = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-5",
  };
  switch (tone) {
    case "success":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      );
    case "warning":
      return (
        <svg {...common}>
          <path d="M12 4l8.5 15h-17z" />
          <path d="M12 10v4" />
          <path d="M12 17.2v.01" />
        </svg>
      );
    case "error":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 9l6 6M15 9l-6 6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8v.01" />
        </svg>
      );
  }
}

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
        "flex items-start gap-3 rounded-md border px-4 py-3.5 text-[13px] leading-relaxed",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      <span aria-hidden className={cn("mt-px flex-none", iconClasses[tone])}>
        {icon ?? <DefaultIcon tone={tone} />}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
