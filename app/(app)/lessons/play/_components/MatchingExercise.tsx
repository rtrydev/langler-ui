"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { OptionCard } from "@/components/ui/OptionCard";
import { gradeMatching, seededShuffle } from "@/lib/lesson-grading";
import type { ExercisePlayerProps } from "./types";

export function MatchingExercise({ exercise, onComplete }: ExercisePlayerProps) {
  const pairs = exercise.payload?.pairs ?? [];
  const rightItems = seededShuffle(
    pairs.map((pair) => pair.right),
    exercise.exerciseId,
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const outcome = gradeMatching(exercise, matches);

  function assign(right: string) {
    if (!selected) return;
    const previous = Object.entries(matches).find(([, value]) => value === right)?.[0];
    const next = { ...matches };
    if (previous) delete next[previous];
    next[selected] = right;
    setMatches(next);
    setSelected(null);
  }

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-ink-2">{exercise.prompt || "Match each item with its meaning."}</p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="grid content-start gap-2">
          {pairs.map((pair) => <OptionCard className="font-jp text-base" disabled={checked} key={pair.left} onClick={() => setSelected(pair.left)} selected={selected === pair.left}>{pair.left}<span className="mt-1 block text-xs text-ink-3">{matches[pair.left] ?? "Choose a match"}</span></OptionCard>)}
        </div>
        <div className="grid content-start gap-2">
          {rightItems.map((right) => <OptionCard disabled={checked || !selected} key={right} onClick={() => assign(right)} selected={Object.values(matches).includes(right)}>{right}</OptionCard>)}
        </div>
      </div>
      {checked ? (
        <Callout className="mt-5" tone={outcome.correct === outcome.total ? "success" : "warning"}>
          {outcome.correct} of {outcome.total} pairs correct.
          {pairs.filter((pair) => matches[pair.left] !== pair.right).map((pair) => (
            <span className="mt-1 block font-jp" key={pair.left}>{pair.left} → {pair.right}</span>
          ))}
        </Callout>
      ) : null}
      <div className="mt-7 flex justify-end">
        {checked ? <Button onClick={() => onComplete(outcome)}>Next →</Button> : <Button disabled={Object.keys(matches).length !== pairs.length} onClick={() => setChecked(true)}>Check</Button>}
      </div>
    </div>
  );
}
