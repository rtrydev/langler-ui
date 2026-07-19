import { StepProgress } from "langler-ui";

export const PlayerHeader = () => (
  <div className="flex w-96 items-center gap-3">
    <StepProgress className="flex-1" completed={3} total={8} />
    <span className="shrink-0 text-xs text-ink-3">3 / 8</span>
  </div>
);

export const Sweep = () => (
  <div className="flex w-80 flex-col gap-3">
    {[0, 2, 5, 8].map((completed) => (
      <div key={completed} className="flex items-center gap-3">
        <StepProgress className="flex-1" completed={completed} total={8} />
        <span className="w-8 shrink-0 text-right text-xs text-ink-3">
          {completed}/8
        </span>
      </div>
    ))}
  </div>
);

export const ShortStage = () => (
  <div className="w-64">
    <StepProgress completed={2} total={4} />
  </div>
);
