"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { SessionChrome } from "@/components/SessionChrome";
import { useSession } from "@/components/SessionContext";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Overline } from "@/components/ui/Overline";
import { StepProgress } from "@/components/ui/StepProgress";
import { getLesson, saveLessonResult, type ExerciseOutcome, type LessonDetail, type LessonResultDocument } from "@/lib/api/lessons";
import { buildLessonResult } from "@/lib/lesson-grading";
import { exerciseTypeLabel, languageOption } from "@/lib/lesson-catalog";
import { lessonResultSchema } from "@/lib/validation/result";
import { ExerciseRenderer } from "./ExerciseRenderer";
import { ResultSummary } from "./ResultSummary";

type PlayerState = { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready"; lesson: LessonDetail };

export function LessonPlayer() {
  const session = useSession();
  const lessonId = useSearchParams().get("id") ?? "";
  const [state, setState] = useState<PlayerState>({ kind: "loading" });
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<ExerciseOutcome[]>([]);
  const startedAt = useRef(new Date().toISOString());
  const [result, setResult] = useState<LessonResultDocument | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    let active = true;
    getLesson(session, lessonId).then((response) => {
      if (active) setState(response.ok ? { kind: "ready", lesson: response.data } : { kind: "error", message: response.error.message });
    });
    return () => { active = false; };
  }, [lessonId, session]);

  async function persist(document: LessonResultDocument) {
    setSaving(true);
    setSaveError("");
    const validated = lessonResultSchema.safeParse(document);
    if (!validated.success) {
      setSaveError("The result could not be validated before saving.");
      setSaving(false);
      return;
    }
    const response = await saveLessonResult(session, lessonId, validated.data);
    if (!response.ok) setSaveError(response.error.message);
    setSaving(false);
  }

  function complete(outcome: ExerciseOutcome) {
    if (state.kind !== "ready") return;
    const next = [...outcomes, outcome];
    if (index < state.lesson.exercises.length - 1) {
      setOutcomes(next);
      setIndex(index + 1);
      return;
    }
    const document = buildLessonResult(crypto.randomUUID(), startedAt.current, new Date().toISOString(), next);
    setOutcomes(next);
    setResult(document);
    void persist(document);
  }

  function retry() {
    startedAt.current = new Date().toISOString();
    setIndex(0);
    setOutcomes([]);
    setResult(null);
    setSaveError("");
  }

  if (!lessonId) return <Callout tone="error">No lesson selected.</Callout>;
  if (state.kind === "loading") return <LoadingState>Preparing your lesson…</LoadingState>;
  if (state.kind === "error") return <Callout tone="error">{state.message}</Callout>;
  if (result) return <ResultSummary lesson={state.lesson} onRetry={retry} onRetrySave={() => void persist(result)} result={result} saveError={saveError} saving={saving} />;

  const exercise = state.lesson.exercises[index];
  const language = languageOption(state.lesson.language);
  return (
    <SessionChrome
      exitHref={`/lessons/detail/?id=${state.lesson.lessonId}`}
      exitLabel="Exit lesson"
      badge={<Badge tone={language?.tone}>{language?.nativeName ?? state.lesson.language}</Badge>}
      progress={<StepProgress className="w-full" completed={index + 1} total={state.lesson.exercises.length} />}
      counter={`${index + 1} / ${state.lesson.exercises.length}`}
      bodyClassName="min-h-[28rem] sm:p-8 lg:p-10"
      footer={<p className="text-center text-xs text-ink-3">Your place and answers stay here while you work through this exercise.</p>}
    >
      <Overline className="mb-2">{exerciseTypeLabel(exercise.type)}</Overline>
      <ExerciseRenderer exercise={exercise} language={state.lesson.language} level={state.lesson.level} onComplete={complete} />
    </SessionChrome>
  );
}
