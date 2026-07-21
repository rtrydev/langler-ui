"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Overline } from "@/components/ui/Overline";
import { gradeOrdering, seededShuffle, stringItems } from "@/lib/lesson-grading";

const tokenClass =
  "inline-flex items-center rounded-md border border-line bg-surface px-3 py-[7px] text-sm text-ink shadow-card transition-all duration-150 select-none hover:-translate-y-px hover:border-ink-3 focus-visible:shadow-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";
import type { ExercisePlayerProps } from "./types";

export function OrderingExercise({ exercise, onComplete }: ExercisePlayerProps) {
  const expected = stringItems(exercise);
  const [remaining, setRemaining] = useState(() =>
    seededShuffle(expected, exercise.exerciseId),
  );
  const [arranged, setArranged] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const outcome = gradeOrdering(exercise, arranged);

  function add(item: string, index: number) {
    setArranged([...arranged, item]);
    setRemaining(remaining.filter((_, itemIndex) => itemIndex !== index));
  }

  function remove(item: string, index: number) {
    setRemaining([...remaining, item]);
    setArranged(arranged.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-ink-2">{exercise.prompt || "Arrange the parts into the correct order."}</p>
      {exercise.payload?.translation ? <p className="mt-3 text-sm italic text-ink-3">{exercise.payload.translation}</p> : null}
      <div className="mt-6 min-h-24 rounded-lg border border-dashed border-line bg-tint p-3">
        <Overline className="mb-2">Your answer</Overline>
        <div className="flex flex-wrap gap-2">
          {arranged.map((item, index) => (
            <button className={tokenClass} disabled={checked} key={`${item}-${index}`} onClick={() => remove(item, index)} type="button">{item}</button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {remaining.map((item, index) => (
          <button className={tokenClass} disabled={checked} key={`${item}-${index}`} onClick={() => add(item, index)} type="button">{item}</button>
        ))}
      </div>
      {checked ? <Callout className="mt-5" tone={outcome.correct === outcome.total ? "success" : "warning"}>{outcome.correct === outcome.total ? "Correct order." : `Correct answer: ${expected.join(" ")}`}</Callout> : null}
      <div className="mt-7 flex justify-end gap-2">
        {checked ? <Button onClick={() => onComplete(outcome)} size="lg">Next →</Button> : <Button disabled={arranged.length !== expected.length} onClick={() => setChecked(true)} size="lg">Check</Button>}
      </div>
    </div>
  );
}
