"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Input } from "@/components/ui/Input";
import { gradeCloze, matchesAnswer } from "@/lib/lesson-grading";
import type { ExercisePlayerProps } from "./types";

export function ClozeExercise({ exercise, onComplete }: ExercisePlayerProps) {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const blanks = exercise.payload?.blanks ?? [];
  const byIndex = new Map(blanks.map((blank) => [blank.index, blank]));
  const parts = (exercise.payload?.text ?? "").split(/(\{\{\d+\}\})/g);
  const outcome = gradeCloze(exercise, responses);

  return (
    <div>
      <p className="mb-7 text-sm text-ink-2">{exercise.prompt || "Fill each blank."}</p>
      <div className="max-w-3xl font-jp-serif text-[clamp(1.35rem,4vw,1.9rem)] leading-[2.35]">
        {parts.map((part, index) => {
          const match = part.match(/^\{\{(\d+)\}\}$/);
          if (!match) return <span key={`${part}-${index}`}>{part}</span>;
          const blankIndex = Number(match[1]);
          const blank = byIndex.get(blankIndex);
          const correct = blank
            ? matchesAnswer(responses[blankIndex] ?? "", [blank.answer, ...(blank.alternates ?? [])])
            : false;
          return (
            <Input
              aria-label={`Blank ${blankIndex}`}
              className={`mx-1 inline-block w-36 rounded-b-none border-x-0 border-t-0 px-2 text-center font-jp text-lg ${checked ? (correct ? "border-success text-success" : "border-crimson text-crimson") : "border-accent bg-accent-soft"}`}
              disabled={checked}
              key={`blank-${blankIndex}`}
              onChange={(event) => setResponses({ ...responses, [blankIndex]: event.target.value })}
              placeholder={blank?.hint ?? ""}
              value={responses[blankIndex] ?? ""}
            />
          );
        })}
      </div>
      {checked ? (
        <Callout className="mt-6" tone={outcome.correct === outcome.total ? "success" : "warning"}>
          {outcome.correct} of {outcome.total} blanks correct.
          {blanks.filter((blank) => !matchesAnswer(responses[blank.index] ?? "", [blank.answer, ...(blank.alternates ?? [])])).map((blank) => (
            <span className="mt-1 block font-jp" key={blank.index}>Blank {blank.index}: {blank.answer}</span>
          ))}
        </Callout>
      ) : null}
      <div className="mt-7 flex justify-end gap-2">
        {checked ? (
          <>
            <Button onClick={() => setChecked(false)} variant="secondary">Try again</Button>
            <Button onClick={() => onComplete(outcome)}>Next →</Button>
          </>
        ) : (
          <Button disabled={blanks.some((blank) => !(responses[blank.index] ?? "").trim())} onClick={() => setChecked(true)}>Check</Button>
        )}
      </div>
    </div>
  );
}
