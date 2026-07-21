"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { OptionCard } from "@/components/ui/OptionCard";
import { cn } from "@/lib/cn";
import { gradeMultipleChoice, seededShuffle } from "@/lib/lesson-grading";
import type { ExercisePlayerProps } from "./types";

export function MultipleChoiceExercise({ exercise, onComplete }: ExercisePlayerProps) {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const questions = exercise.payload?.questions ?? [];
  const outcome = gradeMultipleChoice(exercise, responses);

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-ink-2">{exercise.prompt || "Choose the correct answer."}</p>
      <div className="mt-6 grid gap-7">
        {questions.map((question, questionIndex) => {
          const options = seededShuffle(
            question.options ?? [],
            `${exercise.exerciseId}-${questionIndex}`,
          );
          const wrong = checked && responses[questionIndex] !== question.answer;
          return (
            <fieldset disabled={checked} key={`${question.question}-${questionIndex}`}>
              <legend className="font-jp text-base font-medium leading-relaxed">
                <span className="mr-2 text-xs text-ink-3">{questionIndex + 1}.</span>
                {question.question}
              </legend>
              <div className="mt-3 grid gap-2">
                {options.map((option) => (
                  <OptionCard
                    className={cn(
                      "font-jp py-3",
                      checked && option === question.answer && "!border-success-border !bg-success-soft",
                      checked && responses[questionIndex] === option && option !== question.answer && "!border-vermilion-border !bg-vermilion-soft",
                    )}
                    key={option}
                    onClick={() => setResponses({ ...responses, [questionIndex]: option })}
                    selected={responses[questionIndex] === option}
                  >
                    {option}
                  </OptionCard>
                ))}
              </div>
              {wrong ? (
                <p className="mt-2 text-sm text-vermilion">
                  Correct answer: <span className="font-jp">{question.answer}</span>
                </p>
              ) : null}
            </fieldset>
          );
        })}
      </div>
      {checked ? (
        <Callout className="mt-5" tone={outcome.correct === outcome.total ? "success" : "warning"}>
          {outcome.correct} of {outcome.total} questions correct.
        </Callout>
      ) : null}
      <div className="mt-7 flex justify-end">
        {checked ? (
          <Button onClick={() => onComplete(outcome)} size="lg">Next →</Button>
        ) : (
          <Button
            disabled={questions.some((_, index) => !responses[index])}
            onClick={() => setChecked(true)}
            size="lg"
          >
            Check
          </Button>
        )}
      </div>
    </div>
  );
}
