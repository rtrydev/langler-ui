"use client";

import { useEffect, useState } from "react";
import { JapaneseReader } from "@/components/JapaneseReader";
import { BurmeseReader } from "@/components/BurmeseReader";
import { Glossary } from "@/components/Glossary";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Input } from "@/components/ui/Input";
import { OptionCard } from "@/components/ui/OptionCard";
import { Overline } from "@/components/ui/Overline";
import { Switch } from "@/components/ui/Switch";
import { useSession } from "@/components/SessionContext";
import { listVocabulary, type VocabEntry } from "@/lib/api/reference";
import { cn } from "@/lib/cn";
import { gradeReading, matchesAnswer, questionAnswers, seededShuffle } from "@/lib/lesson-grading";
import type { ExercisePlayerProps } from "./types";

export function ReadingExercise({
  exercise,
  language,
  level,
  onComplete,
}: ExercisePlayerProps & { language: string; level: string }) {
  const session = useSession();
  const [vocabulary, setVocabulary] = useState<VocabEntry[]>([]);
  const [showReadings, setShowReadings] = useState(true);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const questions = exercise.payload?.questions ?? [];
  const outcome = gradeReading(exercise, responses);

  useEffect(() => {
    if (language !== "ja") return;
    let active = true;
    listVocabulary(session, language, level).then((result) => {
      if (active && result.ok) setVocabulary(result.data);
    });
    return () => { active = false; };
  }, [language, level, session]);

  return (
    <div className="grid min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,23rem)] lg:gap-9">
      <article className="lg:max-h-[64vh] lg:overflow-y-auto lg:pr-3">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <Overline className="!text-accent">{exercise.payload?.genre === "short_story" ? "Short story" : "Reading"}</Overline>
            <h2 className="mt-1 font-jp-serif text-2xl font-semibold">{exercise.payload?.title}</h2>
          </div>
          {language === "ja" ? <Switch checked={showReadings} onChange={(event) => setShowReadings(event.target.checked)}>Furigana</Switch> : null}
        </div>
        {language === "ja" ? (
          <JapaneseReader annotations={exercise.payload?.annotations} passage={exercise.payload?.passage ?? ""} showReadings={showReadings} vocabulary={vocabulary} />
        ) : language === "my" ? (
          <BurmeseReader passage={exercise.payload?.passage ?? ""} />
        ) : (
          <div className="space-y-5 font-serif text-xl leading-[2.1]">{(exercise.payload?.passage ?? "").split(/\n+/).map((paragraph, index) => <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>)}</div>
        )}
        {language === "ja" ? <p className="mt-5 text-xs italic text-ink-3">Tap a dotted word for its reference definition.</p> : null}
        <Glossary annotations={exercise.payload?.annotations} language={language} />
      </article>
      <section aria-label="Comprehension questions" className="mt-7 border-t border-line pt-7 lg:mt-0 lg:max-h-[64vh] lg:overflow-y-auto lg:rounded-xl lg:border-t-0 lg:bg-surface-2 lg:p-6">
        <div className="grid gap-7">
          {questions.map((question, questionIndex) => {
            const answers = questionAnswers(question);
            const wrong =
              checked &&
              answers.length > 0 &&
              !matchesAnswer(responses[questionIndex] ?? "", answers);
            return (
              <fieldset disabled={checked} key={`${question.question}-${questionIndex}`}>
                <legend className="font-jp text-base font-medium leading-relaxed"><span className="mr-2 text-xs text-ink-3">{questionIndex + 1}.</span>{question.question}</legend>
                {question.kind === "multiple_choice" ? (
                  <div className="mt-3 grid gap-2">{seededShuffle(question.options ?? [], `${exercise.exerciseId}-${questionIndex}`).map((option) => <OptionCard className={cn("font-jp py-3", checked && option === question.answer && "!border-success-border !bg-success-soft", checked && responses[questionIndex] === option && option !== question.answer && "!border-vermilion-border !bg-vermilion-soft")} key={option} onClick={() => setResponses({ ...responses, [questionIndex]: option })} selected={responses[questionIndex] === option}>{option}</OptionCard>)}</div>
                ) : (
                  <Input className="mt-3 font-jp" onChange={(event) => setResponses({ ...responses, [questionIndex]: event.target.value })} value={responses[questionIndex] ?? ""} />
                )}
                {wrong ? (
                  <p className="mt-2 text-sm text-vermilion">Correct answer: <span className="font-jp">{question.answer}</span></p>
                ) : null}
              </fieldset>
            );
          })}
        </div>
        {checked ? <Callout className="mt-5" tone={outcome.correct === outcome.total ? "success" : "warning"}>{outcome.correct} of {outcome.total} gradable answers correct.</Callout> : null}
        <div className="mt-6 flex justify-end">{checked ? <Button onClick={() => onComplete(outcome)} size="lg">Next →</Button> : <Button disabled={questions.some((_, index) => !(responses[index] ?? "").trim())} onClick={() => setChecked(true)} size="lg">Check</Button>}</div>
      </section>
    </div>
  );
}
