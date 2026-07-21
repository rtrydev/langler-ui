"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Overline } from "@/components/ui/Overline";
import { Textarea } from "@/components/ui/Textarea";
import { selfOutcome } from "@/lib/lesson-grading";
import { SelfAssessment } from "./SelfAssessment";
import type { ExercisePlayerProps } from "./types";

export function WritingExercise({ exercise, onComplete }: ExercisePlayerProps) {
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const feedbackPrompt = `Give concise language-learning feedback on this response. Explain corrections without rewriting the learner's voice.\n\nTask: ${exercise.prompt ?? ""}\n\nLearner response:\n${text}`;

  async function copyFeedbackPrompt() {
    await navigator.clipboard.writeText(feedbackPrompt);
    setCopied(true);
  }

  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-xl leading-relaxed">{exercise.prompt}</h2>
      {exercise.payload?.guidance ? <Callout className="mt-4" tone="info">{exercise.payload.guidance}</Callout> : null}
      <Textarea className="mt-5 min-h-64 font-jp text-base" onChange={(event) => setText(event.target.value)} placeholder="Write here…" value={text} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button disabled={!text.trim()} onClick={() => setRevealed(true)} size="lg">Review my writing</Button>
        <Button disabled={!text.trim()} onClick={() => void copyFeedbackPrompt()} size="lg" variant="secondary">{copied ? "Copied for your AI" : "Copy for AI feedback"}</Button>
      </div>
      {revealed ? (
        <>
          <Card className="mt-5 bg-surface-2" elevation="flat">
            <Overline>Self-assessment rubric</Overline>
            <p className="mt-2 text-sm leading-relaxed">Check that you answered the prompt, used the target structures, and can understand your response when reading it back.</p>
            {exercise.payload?.modelAnswer ? <p className="mt-4 border-t border-line pt-4 font-jp leading-relaxed"><Overline as="span" className="block">Model response</Overline>{exercise.payload.modelAnswer}</p> : null}
          </Card>
          <SelfAssessment rating={rating} onChange={setRating} onContinue={() => rating !== null && onComplete(selfOutcome(exercise, rating))} />
        </>
      ) : null}
    </div>
  );
}
