import { Kbd } from "langler-ui";

export const Basic = () => (
  <p className="text-[11px] text-ink-3">
    <Kbd>Space</Kbd> to reveal
  </p>
);

export const ShortcutList = () => (
  <div className="flex w-72 flex-col gap-2 text-sm text-ink-2">
    <div className="flex items-center justify-between">
      <span>Check answer</span>
      <Kbd>Enter</Kbd>
    </div>
    <div className="flex items-center justify-between">
      <span>Reveal reading</span>
      <Kbd>Space</Kbd>
    </div>
    <div className="flex items-center justify-between">
      <span>Pick an option</span>
      <Kbd>1–4</Kbd>
    </div>
    <div className="flex items-center justify-between">
      <span>Search lessons</span>
      <Kbd>⌘K</Kbd>
    </div>
  </div>
);
