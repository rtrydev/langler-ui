"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Switch } from "@/components/ui/Switch";
import { getLesson, type LessonDetail } from "@/lib/api/lessons";
import { languageOption, levelLabel } from "@/lib/lesson-catalog";
import { WorksheetExercise } from "./WorksheetExercise";

type PrintState = { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready"; lesson: LessonDetail };

export function PrintableWorksheet() {
  const session = useSession();
  const lessonId = useSearchParams().get("id") ?? "";
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [state, setState] = useState<PrintState>({ kind: "loading" });

  useEffect(() => {
    if (!lessonId) return;
    let active = true;
    getLesson(session, lessonId).then((response) => {
      if (active) setState(response.ok ? { kind: "ready", lesson: response.data } : { kind: "error", message: response.error.message });
    });
    return () => { active = false; };
  }, [lessonId, session]);

  if (!lessonId) return <Callout tone="error">No lesson selected.</Callout>;
  if (state.kind === "loading") return <p role="status">Preparing worksheet…</p>;
  if (state.kind === "error") return <Callout tone="error">{state.message}</Callout>;
  const language = languageOption(state.lesson.language);

  return (
    <div className="print-workspace">
      <div className="print-toolbar mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
        <Link href={`/lessons/detail/?id=${state.lesson.lessonId}`}><Button variant="secondary">← Lesson</Button></Link>
        <div className="flex items-center gap-4"><Switch checked={includeAnswers} onChange={(event) => setIncludeAnswers(event.target.checked)}>Include answer key</Switch><Button onClick={() => window.print()}>Print worksheet</Button></div>
      </div>
      <article className="worksheet-page" lang={state.lesson.language}>
        <header className="worksheet-header"><div><h1>{state.lesson.title}</h1><p>{language?.nativeName ?? state.lesson.language} · {levelLabel(state.lesson.language, state.lesson.level)}{state.lesson.topic ? ` · ${state.lesson.topic}` : ""}</p></div><p>Name __________________<br />Date __________________</p></header>
        {state.lesson.exercises.map((exercise, index) => <WorksheetExercise answers={false} exercise={exercise} index={index} key={exercise.exerciseId} />)}
        <footer>Generated with Langler · AI-generated content</footer>
      </article>
      {includeAnswers ? <article className="worksheet-page worksheet-answer-key" lang={state.lesson.language}><header className="worksheet-header"><div><span>ANSWER KEY</span><h1>{state.lesson.title}</h1></div></header>{state.lesson.exercises.map((exercise, index) => <WorksheetExercise answers exercise={exercise} index={index} key={exercise.exerciseId} />)}<footer>Generated with Langler · Answer key</footer></article> : null}
    </div>
  );
}
