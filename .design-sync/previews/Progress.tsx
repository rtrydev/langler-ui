import { Progress } from "langler-ui";

export const LessonCompletion = () => (
  <div className="w-80">
    <div className="mb-1.5 flex items-center justify-between text-xs text-ink-2">
      <span>Hiragana basics</span>
      <span>60%</span>
    </div>
    <Progress value={60} />
  </div>
);

export const Sweep = () => (
  <div className="flex w-80 flex-col gap-3">
    {[
      { label: "Not started", value: 0 },
      { label: "Katakana drills", value: 25 },
      { label: "Particles は and が", value: 45 },
      { label: "Counting objects", value: 80 },
      { label: "Greetings", value: 100 },
    ].map((row) => (
      <div key={row.label} className="flex items-center gap-3">
        <span className="w-36 shrink-0 text-xs text-ink-2">{row.label}</span>
        <Progress className="flex-1" value={row.value} />
        <span className="w-8 text-right text-xs text-ink-3">{row.value}%</span>
      </div>
    ))}
  </div>
);
