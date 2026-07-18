"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { selfOutcome } from "@/lib/lesson-grading";
import { SelfAssessment } from "./SelfAssessment";
import type { ExercisePlayerProps } from "./types";

export function TranslationExercise({ exercise, onComplete }: ExercisePlayerProps) {
  const [response, setResponse] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-ink-2">{exercise.prompt || "Translate the sentence."}</p>
      <p className="mt-6 font-jp-serif text-2xl leading-loose">{exercise.payload?.source}</p>
      <Textarea className="mt-5 min-h-32" onChange={(event) => setResponse(event.target.value)} placeholder="Write your translation…" value={response} />
      {!revealed ? (
        <Button className="mt-4" disabled={!response.trim()} onClick={() => setRevealed(true)}>Compare answer</Button>
      ) : (
        <>
          <Card className="mt-5" elevation="flat">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Reference answer</p>
            <p className="mt-2 leading-relaxed">{exercise.payload?.reference || "No reference answer was provided. Assess whether your meaning is clear and accurate."}</p>
          </Card>
          <SelfAssessment rating={rating} onChange={setRating} onContinue={() => rating !== null && onComplete(selfOutcome(exercise, rating))} />
        </>
      )}
    </div>
  );
}
