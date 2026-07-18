"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Overline } from "@/components/ui/Overline";
import {
  deleteLesson,
  getLesson,
  type LessonDetail,
  type LessonExercise,
} from "@/lib/api/lessons";
import {
  exerciseTypeLabel,
  languageOption,
  levelLabel,
} from "@/lib/lesson-catalog";

type DetailState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; lesson: LessonDetail };

function exerciseSubtitle(exercise: LessonExercise): string {
  const payload = exercise.payload;
  switch (exercise.type) {
    case "cloze":
      return payload?.blanks ? `${payload.blanks.length} blanks` : "";
    case "reading":
      return payload?.questions
        ? `${payload.questions.length} ${payload.questions.length === 1 ? "question" : "questions"}`
        : "";
    case "ordering":
    case "script_practice":
      return payload?.items ? `${payload.items.length} items` : "";
    case "matching":
      return payload?.pairs ? `${payload.pairs.length} pairs` : "";
    case "translation":
      return "Self-assessed";
    default:
      return "";
  }
}

export function LessonDetailView() {
  const session = useSession();
  const router = useRouter();
  const lessonId = useSearchParams().get("id") ?? "";
  const [state, setState] = useState<DetailState>({ kind: "loading" });
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!lessonId) {
      return;
    }
    let active = true;
    getLesson(session, lessonId).then((result) => {
      if (!active) return;
      setState(
        result.ok
          ? { kind: "ready", lesson: result.data }
          : { kind: "error", message: result.error.message },
      );
    });
    return () => {
      active = false;
    };
  }, [session, lessonId]);

  async function removeLesson() {
    if (!window.confirm("Delete this lesson? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    setDeleteError("");
    const result = await deleteLesson(session, lessonId);
    if (result.ok) {
      router.push("/lessons/");
    } else {
      setDeleting(false);
      setDeleteError(result.error.message);
    }
  }

  if (!lessonId) {
    return (
      <div className="grid max-w-md gap-4">
        <Callout tone="error">No lesson selected.</Callout>
        <div>
          <Link href="/lessons/">
            <Button variant="secondary">← Back to lessons</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (state.kind === "loading") {
    return (
      <p className="font-mono text-sm text-ink-2" role="status">
        Opening the lesson…
      </p>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="grid max-w-md gap-4">
        <Callout tone="error">{state.message}</Callout>
        <div>
          <Link href="/lessons/">
            <Button variant="secondary">← Back to lessons</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { lesson } = state;
  const language = languageOption(lesson.language);
  const imported = new Date(lesson.createdAt);
  const story = lesson.exercises.find(
    (exercise) =>
      exercise.type === "reading" && exercise.payload?.genre === "short_story",
  );

  return (
    <div>
      <Link
        className="mb-4 inline-block text-[12.5px] text-ink-3 hover:text-ink"
        href="/lessons/"
      >
        ← Lessons
      </Link>
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <Badge tone={language?.tone ?? "neutral"}>
          {language?.nativeName ?? lesson.language} ·{" "}
          {levelLabel(lesson.language, lesson.level)}
        </Badge>
        <span className="font-mono text-[11.5px] text-ink-3">
          {lesson.sourceModel ? `✷ ${lesson.sourceModel} · ` : ""}imported{" "}
          {Number.isNaN(imported.getTime())
            ? ""
            : imported.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
        </span>
      </div>
      <Heading as="h1" size="lg">
        {lesson.title}
      </Heading>
      {lesson.description ? (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
          {lesson.description}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3">
        {lesson.topic ? <span>Topic · {lesson.topic}</span> : null}
        {lesson.estimatedMinutes ? (
          <span>~{lesson.estimatedMinutes} min</span>
        ) : null}
        <span>
          {lesson.exercises.reduce(
            (total, exercise) => total + (exercise.points ?? 0),
            0,
          )}{" "}
          points
        </span>
      </div>

      <Overline as="h2" className="mt-8 mb-3">
        Exercises
      </Overline>
      <Card elevation="card" padding="none">
        <ol>
          {lesson.exercises.map((exercise, index) => {
            const isStory = exercise === story;
            const subtitle = exerciseSubtitle(exercise);
            return (
              <li
                className={`flex items-center gap-3.5 px-4 py-3.5 not-last:border-b not-last:border-b-line-2 ${isStory ? "border-l-[3px] border-l-accent" : ""}`}
                key={exercise.exerciseId}
              >
                <span className="w-4 text-xs font-semibold text-ink-3">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    {exerciseTypeLabel(exercise.type)}
                    {isStory && exercise.payload?.title ? (
                      <span className="font-jp text-ink-2">
                        — {exercise.payload.title}
                      </span>
                    ) : null}
                    {isStory ? <Badge tone="accent">STORY</Badge> : null}
                  </p>
                  {subtitle ? (
                    <p className="mt-0.5 text-[11.5px] text-ink-3">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
                {exercise.points ? (
                  <span className="text-xs font-semibold text-ink-2">
                    {exercise.points} pts
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Card>
      <p className="mt-2.5 flex gap-2 text-[11.5px] leading-relaxed text-ink-3">
        <span aria-hidden className="text-accent">
          ◆
        </span>
        {story
          ? "This lesson culminates in a short story."
          : "Connected reading begins in a later lesson."}
      </p>

      {deleteError ? (
        <Callout className="mt-6" tone="error">
          {deleteError}
        </Callout>
      ) : null}
      <div className="mt-6">
        <Button
          disabled={deleting}
          onClick={() => void removeLesson()}
          variant="danger"
        >
          {deleting ? "Deleting…" : "Delete lesson"}
        </Button>
      </div>
    </div>
  );
}
