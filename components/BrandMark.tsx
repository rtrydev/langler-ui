import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandMarkProps = {
  className?: string;
  size: number;
};

export function BrandMark({ className, size }: BrandMarkProps) {
  return (
    <Image
      alt=""
      aria-hidden
      className={cn("shrink-0", className)}
      height={size}
      src="/brand/langler-mark.png"
      width={size}
    />
  );
}
