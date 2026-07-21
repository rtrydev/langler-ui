import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type CardElevation = "flat" | "card" | "raised" | "floating" | "glass";
export type CardEdgeTone = "accent" | "vermilion" | "gold" | "crimson";
export type CardPadding = "none" | "sm" | "md" | "lg";

const elevationClasses: Record<CardElevation, string> = {
  flat: "border-line bg-surface",
  card: "border-line bg-surface shadow-card",
  raised: "border-line bg-surface shadow-raised",
  floating: "border-line bg-surface shadow-floating",
  glass:
    "border-glass-line bg-glass shadow-raised backdrop-blur-[18px] backdrop-saturate-150",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-7",
};

const edgeClasses: Record<"top" | "left", Record<CardEdgeTone, string>> = {
  top: {
    accent: "border-t-[3px] border-t-accent",
    vermilion: "border-t-[3px] border-t-vermilion",
    gold: "border-t-[3px] border-t-gold",
    crimson: "border-t-[3px] border-t-crimson",
  },
  left: {
    accent: "border-l-[3px] border-l-accent",
    vermilion: "border-l-[3px] border-l-vermilion",
    gold: "border-l-[3px] border-l-gold",
    crimson: "border-l-[3px] border-l-crimson",
  },
};

export type CardProps = ComponentProps<"div"> & {
  elevation?: CardElevation;
  padding?: CardPadding;
  edge?: CardEdgeTone;
  edgeSide?: "top" | "left";
  dashed?: boolean;
};

export function Card({
  elevation = "card",
  padding = "md",
  edge,
  edgeSide = "top",
  dashed = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border",
        dashed ? "border-dashed border-line" : elevationClasses[elevation],
        edge && edgeClasses[edgeSide][edge],
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
}
