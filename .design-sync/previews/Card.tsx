import { Badge, Card, Divider, Heading } from "langler-ui";

export const LessonCard = () => (
  <Card className="w-96">
    <div className="flex items-center gap-2">
      <Badge tone="vermilion">
        <span className="font-jp">日本語</span> · N4
      </Badge>
      <Badge tone="accent">Story</Badge>
    </div>
    <p className="mt-2.5 text-[15px] font-bold text-ink">
      The last train to Nara
    </p>
    <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
      Follow Mira through a missed connection — station vocabulary, polite
      requests, and reading platform signs.
    </p>
    <div className="mt-3.5 flex items-center gap-2 border-t border-line-2 pt-3 text-[11px] text-ink-3">
      12 exercises · about 15 min
    </div>
  </Card>
);

export const Elevations = () => (
  <div className="flex w-[26rem] flex-col gap-4">
    <Card elevation="flat">
      <p className="text-sm font-semibold text-ink">Flat</p>
      <p className="mt-1 text-[13px] text-ink-2">Border only, no shadow.</p>
    </Card>
    <Card elevation="card">
      <p className="text-sm font-semibold text-ink">Card</p>
      <p className="mt-1 text-[13px] text-ink-2">Default resting surface.</p>
    </Card>
    <Card elevation="raised">
      <p className="text-sm font-semibold text-ink">Raised</p>
      <p className="mt-1 text-[13px] text-ink-2">Hover and drag targets.</p>
    </Card>
    <Card elevation="floating">
      <p className="text-sm font-semibold text-ink">Floating</p>
      <p className="mt-1 text-[13px] text-ink-2">Dialogs and popovers.</p>
    </Card>
  </div>
);

export const Edges = () => (
  <div className="flex w-[26rem] flex-col gap-4">
    <Card edge="vermilion">
      <p className="text-sm font-bold text-ink">
        <span className="font-jp">日本語</span> Japanese
      </p>
      <p className="mt-1 text-[13px] text-ink-2">N4 · 8 lessons in progress</p>
    </Card>
    <Card edge="gold">
      <p className="text-sm font-bold text-ink">
        <span className="font-myanmar">မြန်မာ</span> Burmese
      </p>
      <p className="mt-1 text-[13px] text-ink-2">A2 · 3 lessons in progress</p>
    </Card>
    <Card edge="crimson" edgeSide="left">
      <p className="text-sm font-bold text-ink">Polski Polish</p>
      <p className="mt-1 text-[13px] text-ink-2">
        B1 · left-edge variant for list rows
      </p>
    </Card>
  </div>
);

export const DashedCta = () => (
  <Card className="w-96" dashed>
    <p className="text-sm font-semibold text-accent">
      Your first result will appear here.
    </p>
    <p className="mt-1 text-[13px] text-accent-strong">
      Finish a lesson and the score lands in this list.
    </p>
  </Card>
);

export const PaddingNoneList = () => (
  <Card className="w-96" padding="none">
    <div className="border-b border-line-2 px-5 py-4">
      <Heading as="h2" size="sm">Due today</Heading>
    </div>
    <div className="px-5 py-3 text-[13px] text-ink-2">
      <span className="font-jp text-ink">駅</span> — station
    </div>
    <Divider />
    <div className="px-5 py-3 text-[13px] text-ink-2">
      <span className="font-jp text-ink">切符</span> — ticket
    </div>
    <Divider />
    <div className="px-5 py-3 text-[13px] text-ink-2">
      <span className="font-jp text-ink">乗り換え</span> — transfer
    </div>
  </Card>
);
