"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { gradeOrdering, stringItems } from "@/lib/lesson-grading";
import type { ExercisePlayerProps } from "./types";

export function OrderingExercise({ exercise, onComplete }: ExercisePlayerProps) {
  const expected = stringItems(exercise);
  const initial = [...expected].reverse();
  const [remaining, setRemaining] = useState(initial);
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
      <div className="mt-6 min-h-24 rounded-xl border border-dashed border-accent-border bg-accent-soft p-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-accent">Your answer</p>
        <div className="flex flex-wrap gap-2">
          {arranged.map((item, index) => (
            <Button disabled={checked} key={`${item}-${index}`} onClick={() => remove(item, index)} variant="secondary">{item}</Button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {remaining.map((item, index) => (
          <Button disabled={checked} key={`${item}-${index}`} onClick={() => add(item, index)} variant="secondary">{item}</Button>
        ))}
      </div>
      {checked ? <Callout className="mt-5" tone={outcome.correct === outcome.total ? "success" : "warning"}>{outcome.correct === outcome.total ? "Correct order." : `Correct answer: ${expected.join(" ")}`}</Callout> : null}
      <div className="mt-7 flex justify-end gap-2">
        {checked ? <Button onClick={() => onComplete(outcome)}>Next →</Button> : <Button disabled={arranged.length !== expected.length} onClick={() => setChecked(true)}>Check</Button>}
      </div>
    </div>
  );
}
