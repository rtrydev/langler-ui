import { Overline } from "langler-ui";

export const SectionLabel = () => <Overline as="h2">Due today</Overline>;

export const AboveList = () => (
  <div className="w-96">
    <Overline as="h2" className="mb-3">Recent lessons</Overline>
    <div className="rounded-xl border border-line bg-surface px-5 py-4">
      <p className="text-sm font-bold text-ink">The last train to Nara</p>
      <p className="mt-1 text-xs text-ink-3">
        Japanese · N4 · finished yesterday
      </p>
    </div>
    <Overline as="h2" className="mt-6 mb-3">Per-language snapshot</Overline>
    <div className="rounded-xl border border-line bg-surface px-5 py-4">
      <p className="text-sm font-bold text-ink">Polski Polish</p>
      <p className="mt-1 text-xs text-ink-3">B1 · 42 words in review</p>
    </div>
  </div>
);
