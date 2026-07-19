import { Divider } from "langler-ui";

export const BetweenSections = () => (
  <div className="w-96">
    <p className="text-sm font-semibold text-ink">Vocabulary</p>
    <p className="mt-1 text-[13px] text-ink-2">
      18 new words from this lesson.
    </p>
    <Divider className="my-4" />
    <p className="text-sm font-semibold text-ink">Grammar notes</p>
    <p className="mt-1 text-[13px] text-ink-2">
      The て-form for sequencing actions.
    </p>
  </div>
);

export const InList = () => (
  <div className="w-96 rounded-xl border border-line bg-surface px-5 py-1">
    <p className="py-3 text-[13px] text-ink-2">
      <span className="font-jp text-ink">おはよう</span> — good morning
    </p>
    <Divider />
    <p className="py-3 text-[13px] text-ink-2">
      <span className="font-jp text-ink">ありがとう</span> — thank you
    </p>
    <Divider />
    <p className="py-3 text-[13px] text-ink-2">
      <span className="font-jp text-ink">すみません</span> — excuse me
    </p>
  </div>
);
