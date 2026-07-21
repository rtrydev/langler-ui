"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { MeterBars } from "@/components/ui/MeterBars";
import { Overline } from "@/components/ui/Overline";
import { ScaleStrip } from "@/components/ui/ScaleStrip";
import type { AssessmentView } from "@/lib/api/assessments";
import { languageOption, levelDescriptor, levelLabel } from "@/lib/lesson-catalog";

type ResultScreenProps = {
  view: AssessmentView;
  onRetake: () => void;
};

export function ResultScreen({ view, onRetake }: ResultScreenProps) {
  const result = view.result;
  const option = languageOption(view.language);
  if (!result || !option) {
    return (
      <div className="mx-auto max-w-xl">
        <Callout tone="error">This assessment has no result yet.</Callout>
      </div>
    );
  }
  const tested = new Map(result.bands.map((band) => [band.band, band]));
  const descriptor = levelDescriptor(result.estimatedLevel);

  return (
    <Card className="mx-auto max-w-[620px] text-center" padding="lg">
      <Overline>Placement complete · {option.englishName}</Overline>
      <p className="mt-6 text-sm text-ink-2">
        {result.floor ? "Start from the beginning at" : "Your estimated level is"}
      </p>
      <p className="mt-2 font-display text-5xl font-semibold tracking-[-0.02em] text-ink sm:text-6xl">
        <span className="align-middle font-mono text-3xl font-medium text-accent sm:text-4xl">
          ≈{" "}
        </span>
        {levelLabel(view.language, result.estimatedLevel)}
      </p>
      {descriptor ? (
        <p className="mt-2 text-sm text-ink-2">{descriptor}</p>
      ) : null}

      <ScaleStrip
        className="mx-auto mt-7 max-w-sm"
        items={option.levels.map((band) => {
          const outcome = tested.get(band);
          return {
            label: band,
            active: band === result.estimatedLevel,
            struck: Boolean(outcome && !outcome.passed),
          };
        })}
      />

      <div className="mx-auto mt-6 grid max-w-sm gap-2.5">
        {result.bands.map((band) => (
          <div className="flex items-center gap-3" key={band.band}>
            <span className="w-9 text-left font-mono text-[11px] font-[560] text-ink-2">
              {band.band}
            </span>
            <MeterBars className="flex-1" max={band.total} value={band.correct} />
            <span className="font-mono text-[11px] text-ink-3">
              {band.correct}/{band.total}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-ink-3">
        {result.confidence} confidence
      </p>

      <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed text-ink-2">
        {view.guidance}
      </p>

      <Callout className="mt-5 text-left" tone="success">
        This estimate now pre-fills your lesson level. You can change it any
        time you create a lesson.
      </Callout>

      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={onRetake} size="lg" variant="secondary">
          Retake
        </Button>
        <Link href="/create/">
          <Button size="lg">Save &amp; continue</Button>
        </Link>
      </div>
    </Card>
  );
}
