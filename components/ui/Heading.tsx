import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type HeadingSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<HeadingSize, string> = {
  sm: "text-[18px]",
  md: "text-[20px]",
  lg: "text-2xl",
  xl: "text-[28px]",
};

export type HeadingProps = ComponentProps<"h1"> & {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: HeadingSize;
};

export function Heading({
  as: Tag = "h2",
  size = "md",
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        "font-display font-semibold tracking-[-0.02em] text-ink",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
