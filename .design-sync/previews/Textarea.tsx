import { Textarea } from "langler-ui";

export const Translation = () => (
  <div className="w-96">
    <Textarea
      className="min-h-32"
      placeholder="Write your translation…"
      defaultValue="Excuse me, does this train stop at Shin-Ōsaka?"
    />
  </div>
);

export const JapaneseWriting = () => (
  <div className="w-96">
    <Textarea
      className="min-h-32 font-jp text-base"
      placeholder="Write here…"
      defaultValue="週末に京都へ行って、古いお寺を見ました。天気がよくて、写真をたくさん撮りました。"
    />
  </div>
);

export const States = () => (
  <div className="flex w-96 flex-col gap-3">
    <Textarea
      invalid
      className="font-mono text-xs leading-relaxed"
      defaultValue='{"title": "Counting in Burmese", "exercises": ['
    />
    <Textarea disabled placeholder="Write your translation…" />
  </div>
);
