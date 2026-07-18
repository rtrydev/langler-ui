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
        "relative flex aspect-square items-center justify-center rounded-[7px] border",
        guides && "glyph-guides",
        dashed && "border-dashed",
        selected
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-surface",
        ghost && "text-line",
        className,
      )}
      {...props}
    >
      {children}
      {index !== undefined && (
        <span className="absolute top-0.5 left-1 text-[10px] font-bold text-accent">
          {index}
        </span>
      )}
    </div>
  );
}
