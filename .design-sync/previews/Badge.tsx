import { Badge } from "langler-ui";

export const Tones = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Beginner</Badge>
    <Badge tone="muted">12 exercises</Badge>
    <Badge tone="accent">STORY</Badge>
    <Badge tone="success">Passed</Badge>
    <Badge tone="warning">In progress</Badge>
  </div>
);

export const LanguageTones = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge tone="vermilion">
      <span className="font-jp">日本語</span> · N4
    </Badge>
    <Badge tone="gold">
      <span className="font-myanmar">မြန်မာ</span> · A2
    </Badge>
    <Badge tone="crimson">Polski · B1</Badge>
  </div>
);

export const InContext = () => (
  <div className="w-96 rounded-xl border border-line bg-surface p-5">
    <div className="flex items-center gap-2">
      <Badge tone="vermilion">
        <span className="font-jp">日本語</span> · N5
      </Badge>
      <Badge tone="accent">Story</Badge>
    </div>
    <p className="mt-2 text-sm font-bold text-ink">A morning in Kyoto</p>
    <div className="mt-3 flex flex-wrap gap-1.5">
      <Badge tone="muted">Multiple choice</Badge>
      <Badge tone="muted">Cloze</Badge>
      <Badge tone="muted">Word order</Badge>
    </div>
  </div>
);
