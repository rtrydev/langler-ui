import { StatusCircle } from "langler-ui";

export const ExerciseOutcomes = () => (
  <div className="flex w-80 flex-col gap-2.5 text-sm text-ink">
    <div className="flex items-center gap-3">
      <StatusCircle tone="success">✓</StatusCircle>
      <span className="flex-1 font-medium">1 · Multiple choice</span>
      <span className="font-semibold">2 / 2</span>
    </div>
    <div className="flex items-center gap-3">
      <StatusCircle tone="neutral">◐</StatusCircle>
      <span className="flex-1 font-medium">2 · Cloze</span>
      <span className="font-semibold">1 / 2</span>
    </div>
    <div className="flex items-center gap-3">
      <StatusCircle tone="error">✕</StatusCircle>
      <span className="flex-1 font-medium">3 · Word order</span>
      <span className="font-semibold">0 / 2</span>
    </div>
  </div>
);

export const Tones = () => (
  <div className="flex items-center gap-3">
    <StatusCircle tone="accent">✓</StatusCircle>
    <StatusCircle tone="success">✓</StatusCircle>
    <StatusCircle tone="warning">◐</StatusCircle>
    <StatusCircle tone="error">✕</StatusCircle>
    <StatusCircle tone="neutral">◐</StatusCircle>
  </div>
);

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <StatusCircle size="sm" tone="success">
      ✓
    </StatusCircle>
    <StatusCircle size="md" tone="success">
      ✓
    </StatusCircle>
    <StatusCircle size="lg" tone="success">
      ✓
    </StatusCircle>
  </div>
);
