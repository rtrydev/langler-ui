import { MeterBars } from "langler-ui";

export const WordFrequency = () => (
  <div className="flex w-64 flex-col gap-2.5">
    {[
      { word: "水 (mizu)", value: 4 },
      { word: "犬 (inu)", value: 3 },
      { word: "傘 (kasa)", value: 2 },
      { word: "襖 (fusuma)", value: 1 },
    ].map((row) => (
      <div key={row.word} className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-ink-2">{row.word}</span>
        <MeterBars value={row.value} />
      </div>
    ))}
  </div>
);

export const Sweep = () => (
  <div className="flex flex-col gap-2.5">
    {[0, 1, 2, 3, 4].map((value) => (
      <div key={value} className="flex items-center gap-3">
        <span className="w-8 text-xs text-ink-3">{value}/4</span>
        <MeterBars value={value} />
      </div>
    ))}
  </div>
);

export const SixBands = () => (
  <div className="flex items-center gap-3">
    <span className="text-[13px] text-ink-2">Mastery</span>
    <MeterBars max={6} value={4} />
  </div>
);
