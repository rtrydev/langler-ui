import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type FieldMessageTone = "muted" | "error" | "success";

const toneClasses: Record<FieldMessageTone, string> = {
  muted: "text-ink-3",
  error: "text-vermilion",
  success: "text-success",
};

export type FieldMessageProps = ComponentProps<"p"> & {
  tone?: FieldMessageTone;
};

export function FieldMessage({
  tone = "muted",
  className,
  ...props
}: FieldMessageProps) {
  return (
    <p
      className={cn("mt-1.5 text-xs", toneClasses[tone], className)}
      {...props}
    />
  );
}
