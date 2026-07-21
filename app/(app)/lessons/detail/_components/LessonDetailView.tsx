"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { useSession } from "@/components/SessionContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Heading } from "@/components/ui/Heading";
import { Overline } from "@/components/ui/Overline";
import { cn } from "@/lib/cn";
import {
  deleteLesson,
  getLesson,
  listLessonCompletions,
  type LessonCompletion,
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

function completionDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function scoreTone(percent: number): "success" | "warning" | "crimson" {
  if (percent >= 80) return "success";
  if (percent >= 50) return "warning";
  return "crimson";
}

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
    case "polish_orthography":
      return payload?.items ? `${payload.items.length} items` : "";
    case "multiple_choice":
      return payload?.questions
        ? `${payload.questions.length} ${payload.questions.length === 1 ? "question" : "questions"}`
        : "";
    case "matching":
      return payload?.pairs ? `${payload.pairs.length} pairs` : "";
    case "translation":
    case "writing":
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
  const [completions, setCompletions] = useState<LessonCompletion[]>([]);
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
    listLessonCompletions(session, lessonId).then((result) => {
      if (!active) return;
      if (result.ok) {
        setCompletions(result.data);
      }
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
    return <LoadingState>Opening the lesson…</LoadingState>;
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
  const totalPoints = lesson.exercises.reduce(
    (total, exercise) => total + (exercise.points ?? 0),
    0,
  );

  return (
    <div>
      <Link href="/lessons/">
        <Button size="sm" variant="ghost">
          ← Lessons
        </Button>
      </Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
        <div className="grid gap-8">
          <div>
            <Badge tone={language?.tone ?? "neutral"}>
              {language?.nativeName ?? lesson.language} ·{" "}
              {levelLabel(lesson.language, lesson.level)}
            </Badge>
            <Heading as="h1" className="mt-3" size="lg">
              {lesson.title}
            </Heading>
            {lesson.description ? (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
                {lesson.description}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-ink-3">
              <span>
                {lesson.sourceModel ? `✷ ${lesson.sourceModel} · ` : ""}imported{" "}
                {Number.isNaN(imported.getTime())
                  ? ""
                  : imported.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
              </span>
              {lesson.topic ? <span>Topic · {lesson.topic}</span> : null}
              {lesson.estimatedMinutes ? (
                <span>~{lesson.estimatedMinutes} min</span>
              ) : null}
              <span>{totalPoints} points</span>
            </div>
          </div>

          <div>
            <Overline as="h2" className="mb-3">
              Exercises
            </Overline>
            <Card className="overflow-hidden" elevation="card" padding="none">
              <ol>
                {lesson.exercises.map((exercise, index) => {
                  const isStory = exercise === story;
                  const subtitle = exerciseSubtitle(exercise);
                  return (
                    <li
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 not-last:border-b not-last:border-b-line",
                        isStory && "bg-tint",
                      )}
                      key={exercise.exerciseId}
                    >
                      <span className="font-mono text-xs text-ink-3">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                          {exerciseTypeLabel(exercise.type)}
                          {isStory && exercise.payload?.title ? (
                            <span className="font-jp text-ink-2">
                              — {exercise.payload.title}
                            </span>
                          ) : null}
                          {isStory ? <Badge tone="vermilion">STORY</Badge> : null}
                        </p>
                        {subtitle ? (
                          <p className="mt-0.5 font-mono text-[11px] text-ink-3">
                            {subtitle}
                          </p>
                        ) : null}
                      </div>
                      {exercise.points ? (
                        <span className="font-mono text-xs font-semibold text-ink-2">
                          {exercise.points} pts
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </Card>
            <p className="mt-3 flex gap-2 font-mono text-[11px] leading-relaxed text-ink-3">
              <span aria-hidden className="text-vermilion">
                ◆
              </span>
              {story
                ? "This lesson opens with a short story that introduces the new words in context."
                : "Connected reading begins in a later lesson."}
            </p>
          </div>

          {completions.length > 0 ? (
            <div>
              <Overline as="h2" className="mb-3">
                Completions
              </Overline>
              <Card className="overflow-hidden" elevation="card" padding="none">
                <ol>
                  {completions.map((completion) => {
                    const percent =
                      completion.maxScore > 0
                        ? Math.round((completion.score / completion.maxScore) * 100)
                        : 0;
                    return (
                      <li
                        className="flex items-center gap-4 px-5 py-3.5 not-last:border-b not-last:border-b-line"
                        key={completion.attemptId}
                      >
                        <span className="min-w-0 flex-1 text-sm text-ink">
                          {completionDate(completion.completedAt)}
                        </span>
                        <span className="font-mono text-xs text-ink-2">
                          {completion.score}/{completion.maxScore}
                        </span>
                        <Badge tone={scoreTone(percent)}>{percent}%</Badge>
                      </li>
                    );
                  })}
                </ol>
              </Card>
            </div>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-6">
          <Card className="grid gap-3" elevation="card">
            <Link href={`/lessons/play/?id=${lesson.lessonId}`}>
              <Button fullWidth size="lg">
                Start lesson
              </Button>
            </Link>
            <Link href={`/lessons/print/?id=${lesson.lessonId}`}>
              <Button fullWidth size="lg" variant="secondary">
                Print worksheet
              </Button>
            </Link>
            <p className="text-center font-mono text-[11px] leading-relaxed text-ink-3">
              Choose whether to include a separate answer key in the print view.
            </p>
            <Divider className="my-1" />
            {deleteError ? <Callout tone="error">{deleteError}</Callout> : null}
            <Button
              disabled={deleting}
              fullWidth
              onClick={() => void removeLesson()}
              variant="danger"
            >
              {deleting ? "Deleting…" : "Delete lesson"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
