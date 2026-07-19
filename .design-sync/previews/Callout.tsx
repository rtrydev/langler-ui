import { Callout } from "langler-ui";

export const Tones = () => (
  <div className="flex w-96 flex-col gap-3">
    <Callout tone="info">
      The result is approximate guidance, not a certification. It pre-fills
      your lesson level, and you can always override it.
    </Callout>
    <Callout tone="success">
      Lesson imported. It&apos;s waiting in your library under Japanese.
    </Callout>
    <Callout tone="warning">
      You won&apos;t see this token again. Store it somewhere safe.
    </Callout>
    <Callout tone="error">
      Something went wrong. Your lessons are safe — try again.
    </Callout>
  </div>
);

export const CustomIcon = () => (
  <div className="w-96">
    <Callout tone="info" icon="旅">
      Story mode teaches vocabulary in context — follow Mira&apos;s trip
      through Kyoto and pick up words as the plot needs them.
    </Callout>
  </div>
);
