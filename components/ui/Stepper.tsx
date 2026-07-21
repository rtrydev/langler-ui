import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type StepperProps = {
  steps: ReactNode[];
  current: number;
  onStepSelect?: (index: number) => void;
  className?: string;
};

export function Stepper({
  steps,
  current,
  onStepSelect,
  className,
}: StepperProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <Fragment key={index}>
            {index > 0 && <div className="mx-3.5 h-px flex-1 bg-line" />}
            <button
              type="button"
              disabled={!onStepSelect}
              aria-current={active ? "step" : undefined}
              onClick={onStepSelect ? () => onStepSelect(index) : undefined}
              className={cn(
                "flex items-center gap-2.5",
                onStepSelect && "cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-[560]",
                  active
                    ? "border border-accent-strong bg-accent bg-[linear-gradient(180deg,var(--accent-hi),var(--accent))] text-on-accent"
                    : done
                      ? "bg-accent-soft text-accent-strong"
                      : "border border-line bg-surface text-ink-3",
                )}
              >
                {done ? "✓" : index + 1}
              </span>
              <span
                className={cn(
                  "text-[13px]",
                  active && "font-[560] text-ink",
                  done && "font-medium text-ink",
                  !done && !active && "font-medium text-ink-3",
                )}
              >
                {label}
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
