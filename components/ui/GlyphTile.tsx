import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type GlyphTileProps = ComponentProps<"div"> & {
  guides?: boolean;
  dashed?: boolean;
  ghost?: boolean;
  selected?: boolean;
  index?: number;
};

export function GlyphTile({
  guides = false,
  dashed = false,
  ghost = false,
  selected = false,
  index,
  className,
  children,
  ...props
}: GlyphTileProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-lg border",
        guides && "glyph-guides",
        dashed && "border-dashed",
        selected
          ? "border-accent bg-accent-soft text-accent shadow-[0_0_0_3px_var(--ring),var(--shadow-card)]"
          : "border-line bg-surface shadow-card",
        ghost && "text-line",
        className,
      )}
      {...props}
    >
      {children}
      {index !== undefined && (
        <span className="absolute top-0.5 left-1 font-mono text-[10px] font-bold text-accent">
          {index}
        </span>
      )}
    </div>
  );
}
