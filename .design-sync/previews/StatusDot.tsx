import { StatusDot } from "langler-ui";

export const LanguageTones = () => (
  <div className="flex flex-col gap-2 text-sm text-ink">
    <p className="flex items-center">
      <StatusDot className="mr-2" tone="vermilion" />
      日本語 · Japanese
    </p>
    <p className="flex items-center">
      <StatusDot className="mr-2" tone="gold" />
      <span className="font-myanmar">ဗမာစာ</span>
      <span className="ml-1">· Burmese</span>
    </p>
    <p className="flex items-center">
      <StatusDot className="mr-2" tone="crimson" />
      Polski · Polish
    </p>
  </div>
);

export const AllTones = () => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-2">
    {(
      [
        "accent",
        "vermilion",
        "gold",
        "crimson",
        "success",
        "warning",
        "neutral",
      ] as const
    ).map((tone) => (
      <span key={tone} className="flex items-center gap-1.5">
        <StatusDot tone={tone} />
        {tone}
      </span>
    ))}
  </div>
);

export const InlineStatus = () => (
  <div className="flex flex-col gap-2 text-sm text-ink">
    <p className="flex items-center">
      <StatusDot className="mr-2" tone="success" />
      Lesson synced
    </p>
    <p className="flex items-center">
      <StatusDot className="mr-2" tone="warning" />
      12 reviews due
    </p>
  </div>
);
