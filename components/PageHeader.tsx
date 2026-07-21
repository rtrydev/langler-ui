import type { ReactNode } from "react";
import { Heading, type HeadingSize } from "@/components/ui/Heading";
import { Overline } from "@/components/ui/Overline";
import { cn } from "@/lib/cn";

export type PageHeaderProps = {
  kicker?: ReactNode;
  title: ReactNode;
  size?: HeadingSize;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({
  kicker,
  title,
  size = "xl",
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {kicker && <Overline className="mb-2">{kicker}</Overline>}
        <Heading as="h1" size={size}>
          {title}
        </Heading>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
