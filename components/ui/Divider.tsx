import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Divider({ className, ...props }: ComponentProps<"hr">) {
  return <hr className={cn("h-px border-0 bg-line", className)} {...props} />;
}
