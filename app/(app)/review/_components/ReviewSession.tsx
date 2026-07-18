"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Kbd } from "@/components/ui/Kbd";
import { StatusCircle } from "@/components/ui/StatusCircle";
import {
  getDueReviews,
  gradeReview,
} from "@/lib/api/progress";
import { languageOption } from "@/lib/lesson-catalog";
import { reviewQueue, type QueuedReviewItem } from "@/lib/review-queue";
import type { ReviewGradeInput } from "@/lib/validation/progress";

type ReviewState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; items: QueuedReviewItem[]; total: number };

const GRADES: Array<{
  grade: ReviewGradeInput["grade"];
  label: string;
  key: string;
  color: string;
}> = [
  { grade: "again", label: "Again", key: "1", color: "text-vermilion" },
  { grade: "hard", label: "Hard", key: "2", color: "text-warning" },
  { grade: "good", label: "Good", key: "3", color: "text-success" },
  { grade: "easy", label: "Easy", key: "4", color: "text-accent" },
];

function nextDueLabel(value: string): string {
  const due = new Date(`${value}T00:00:00`);
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (due.getTime() === tomorrow.getTime()) return "Tomorrow";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
  }).format(due);
}

export function ReviewSession() {
  const session = useSession();
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams.get("language") ?? undefined;
  const [state, setState] = useState<ReviewState>({ kind: "loading" });
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [reviewed, setReviewed] = useState(0);
  const [relearn, setRelearn] = useState(0);
  const [nextDue, setNextDue] = useState("");

  useEffect(() => {
    let active = true;
    getDueReviews(session, requestedLanguage).then((result) => {
      if (!active) return;
      if (!result.ok) {
        setState({ kind: "error", message: result.error.message });
        return;
      }
      const items = reviewQueue(result.data);
      setState({ kind: "ready", items, total: items.length });
    });
    return () => {
      active = false;
    };
  }, [requestedLanguage, session]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (state.kind !== "ready" || state.items.length === 0 || submitting) return;
      if (!revealed && event.code === "Space") {
        event.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed) {
        const grade = GRADES.find((option) => option.key === event.key)?.grade;
        if (grade) void submitGrade(grade);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  async function submitGrade(grade: ReviewGradeInput["grade"]) {
    if (state.kind !== "ready" || state.items.length === 0 || submitting) return;
    const item = state.items[0];
    setSubmitting(true);
    setMessage("");
    const result = await gradeReview(session, {
      language: item.language as ReviewGradeInput["language"],
      kind: item.kind,
      itemId: item.itemId,
      grade,
    });
    setSubmitting(false);
    if (!result.ok) {
      setMessage(result.error.message);
      return;
    }
    setReviewed((count) => count + 1);
    if (grade === "again") setRelearn((count) => count + 1);
    setNextDue((current) =>
      !current || result.data.dueDate < current ? result.data.dueDate : current,
    );
    setRevealed(false);
    setState({ ...state, items: state.items.slice(1) });
  }

  if (state.kind === "loading") {
    return (
      <p className="font-mono text-sm text-ink-2" role="status">
        Preparing today&apos;s review…
      </p>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mx-auto max-w-xl">
        <Callout tone="error">{state.message}</Callout>
      </div>
    );
  }

  const item = state.items[0];
  const language = item ? languageOption(item.language) : undefined;
  if (!item && reviewed === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          description="You're all caught up. Come back tomorrow — new items will be waiting."
          icon={<StatusCircle size="lg" tone="success">✓</StatusCircle>}
          title="Nothing due"
        >
          <Link href="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  if (!item) {
    return (
      <Card className="mx-auto max-w-md text-center" padding="lg">
        <StatusCircle className="mx-auto mb-4" size="lg" tone="success">✓</StatusCircle>
        <Heading as="h1" size="sm">
          Session complete
        </Heading>
        <p className="mt-1.5 text-[13px] text-ink-2">
          {reviewed} items reviewed · {reviewed - relearn} remembered
        </p>
        <div className="my-5 flex justify-center gap-8 border-y border-line-2 py-4">
          <div>
            <p className="text-xl font-bold">{relearn}</p>
            <p className="text-[11px] text-ink-3">to relearn</p>
          </div>
          <div>
            <p className="text-xl font-bold">{nextDue ? nextDueLabel(nextDue) : "—"}</p>
            <p className="text-[11px] text-ink-3">next due</p>
          </div>
        </div>
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="mx-auto flex min-h-[31rem] max-w-[620px] flex-col overflow-hidden" padding="none">
      <div className="flex h-[52px] items-center gap-4 border-b border-line px-5">
        <Link
          aria-label="Exit review"
          className="text-xl text-ink-2 hover:text-ink"
          href="/"
        >
          ×
        </Link>
        <span className="rounded-[5px] bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent">
          {language?.nativeName ?? item.language}
        </span>
        <span className="ml-auto text-xs text-ink-3">
          {state.items.length} left today
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-[11px] font-semibold tracking-wide text-ink-3 uppercase">
          {item.kind === "grammar" ? "Grammar" : "Recall"}
        </p>
        <p className="mt-4 font-jp-serif text-5xl leading-tight text-ink sm:text-6xl">
          {item.headword}
        </p>
        {!revealed ? (
          <div className="mt-8">
            <Button onClick={() => setRevealed(true)} size="lg">
              Reveal
            </Button>
            <p className="mt-3 text-[11px] text-ink-3"><Kbd>Space</Kbd> to reveal</p>
          </div>
        ) : (
          <div className="mt-5">
            {item.reading ? <p className="text-base text-ink-2">{item.reading}</p> : null}
            <p className="mt-2 text-xl font-semibold text-ink">{item.gloss}</p>
            {item.example ? (
              <div className="mt-5 text-base leading-relaxed text-ink-2">
                <p>{item.example}</p>
                {item.exampleMeaning ? (
                  <p className="mt-1 text-xs text-ink-3">{item.exampleMeaning}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
        {message ? (
          <Callout className="mt-5 w-full max-w-sm text-left" tone="error">
            {message}
          </Callout>
        ) : null}
      </div>

      <div className="grid min-h-[61px] grid-cols-4 border-t border-line">
        {revealed
          ? GRADES.map((option) => (
              <Button
                className="h-full w-full flex-col rounded-none border-r border-line-2 px-1 py-3 last:border-r-0"
                disabled={submitting}
                key={option.grade}
                onClick={() => void submitGrade(option.grade)}
                variant="ghost"
              >
                <span className={`block text-sm font-semibold ${option.color}`}>
                  {option.label}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-ink-3">
                  {option.key}
                </span>
              </Button>
            ))
          : null}
      </div>
    </Card>
  );
}
