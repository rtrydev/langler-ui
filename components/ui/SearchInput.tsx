import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";

export type SearchInputProps = Omit<ComponentProps<"input">, "type"> & {
  className?: string;
  inputClassName?: string;
};

export function SearchInput({
  className,
  inputClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2 text-ink-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3-3" strokeLinecap="round" />
      </svg>
      <Input
        type="search"
        className={cn("pl-9 text-[13px]", inputClassName)}
        {...props}
      />
    </div>
  );
}
