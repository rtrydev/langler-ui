"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Input } from "@/components/ui/Input";
import { OptionCard } from "@/components/ui/OptionCard";
import {
  gradeOrthography,
  matchesAnswer,
  orthographyItems,
  seededShuffle,
} from "@/lib/lesson-grading";
import type { ExercisePlayerProps } from "./types";

export function PolishOrthographyExercise({
  exercise,
  onComplete,
}: ExercisePlayerProps) {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const items = orthographyItems(exercise);
  const outcome = gradeOrthography(exercise, responses);

  if (items.length === 0) {
    return <p className="text-sm text-ink-2">No orthography items were provided.</p>;
  }

  return (
    <div className="max-w-3xl" lang="pl">
      <p className="text-sm text-ink-2">
        {exercise.prompt || "Choose or type the correct Polish spelling."}
      </p>
      <div className="mt-6 grid gap-7">
        {items.map((item, index) => {
          const correct = matchesAnswer(responses[index] ?? "", [item.answer ?? ""]);
          return (
            <fieldset disabled={checked} key={`${item.answer}-${index}`}>
              <legend className="text-base font-medium leading-relaxed">
                <span className="mr-2 text-xs text-ink-3">{index + 1}.</span>
                {item.glyph || (item.kind === "choice" ? "Choose the correct spelling." : "Type the Polish word.")}
              </legend>
              {item.meaning ? (
                <p className="mt-1 text-xs text-ink-3">{item.meaning}</p>
              ) : null}
              {item.kind === "choice" ? (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {seededShuffle(item.options ?? [], `${exercise.exerciseId}-${index}`).map(
                    (option) => (
                      <OptionCard
                        className={`py-3 text-lg ${checked && option === item.answer ? "border-success" : ""}`}
                        key={option}
                        onClick={() => setResponses({ ...responses, [index]: option })}
                        selected={responses[index] === option}
                      >
                        {option}
                      </OptionCard>
                    ),
                  )}
                </div>
              ) : (
                <Input
                  aria-label={`Orthography answer ${index + 1}`}
                  className={`mt-3 max-w-sm text-lg ${checked ? (correct ? "border-success text-success" : "border-crimson text-crimson") : ""}`}
                  onChange={(event) =>
                    setResponses({ ...responses, [index]: event.target.value })
                  }
                  placeholder="Wpisz poprawną pisownię"
                  value={responses[index] ?? ""}
                />
              )}
              {checked && !correct ? (
                <p className="mt-2 text-sm text-crimson">
                  Correct spelling: <span className="font-semibold">{item.answer}</span>
                </p>
              ) : null}
            </fieldset>
          );
        })}
      </div>
      {checked ? (
        <Callout
          className="mt-6"
          tone={outcome.correct === outcome.total ? "success" : "warning"}
        >
          {outcome.correct} of {outcome.total} spellings correct.
        </Callout>
      ) : null}
      <div className="mt-7 flex justify-end gap-2">
        {checked ? (
          <>
            <Button onClick={() => setChecked(false)} variant="secondary">
              Try again
            </Button>
            <Button onClick={() => onComplete(outcome)}>Next →</Button>
          </>
        ) : (
          <Button
            disabled={items.some((_, index) => !(responses[index] ?? "").trim())}
            onClick={() => setChecked(true)}
          >
            Check
          </Button>
        )}
      </div>
    </div>
  );
}
