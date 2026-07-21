"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { SessionChrome } from "@/components/SessionChrome";
import { useSession } from "@/components/SessionContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Kbd } from "@/components/ui/Kbd";
import { Overline } from "@/components/ui/Overline";
import { StatusCircle } from "@/components/ui/StatusCircle";
import { cn } from "@/lib/cn";
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
  tone: string;
}> = [
  {
    grade: "again",
    label: "Again",
    key: "1",
    tone: "border-vermilion-border bg-vermilion-soft text-vermilion hover:bg-vermilion-soft",
  },
  {
    grade: "hard",
    label: "Hard",
    key: "2",
    tone: "border-warning-border bg-warning-soft text-warning-strong",
  },
  {
    grade: "good",
    label: "Good",
    key: "3",
    tone: "border-accent-border bg-accent-soft text-accent-strong",
  },
  {
    grade: "easy",
    label: "Easy",
    key: "4",
    tone: "border-success-border bg-success-soft text-success",
  },
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
    return <LoadingState>Preparing today&apos;s review…</LoadingState>;
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
      <Card className="mx-auto max-w-md text-center" elevation="raised" padding="lg">
        <StatusCircle className="mx-auto mb-4" size="lg" tone="success">✓</StatusCircle>
        <Heading as="h1" size="sm">
          Session complete
        </Heading>
        <p className="mt-1.5 text-[13px] text-ink-2">
          {reviewed} items reviewed · {reviewed - relearn} remembered
        </p>
        <div className="my-5 grid grid-cols-2 gap-3">
          <div className="rounded-md border border-line bg-tint p-3">
            <p className="font-display text-2xl font-semibold">{relearn}</p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">
              to relearn
            </p>
          </div>
          <div className="rounded-md border border-line bg-tint p-3">
            <p className="font-display text-2xl font-semibold">
              {nextDue ? nextDueLabel(nextDue) : "—"}
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">
              next due
            </p>
          </div>
        </div>
        <Link href="/">
          <Button fullWidth size="lg">Back to home</Button>
        </Link>
      </Card>
    );
  }

  return (
    <SessionChrome
      exitHref="/"
      exitLabel="Exit review"
      badge={
        <Badge tone={language?.tone}>{language?.nativeName ?? item.language}</Badge>
      }
      counter={`${state.items.length} left today`}
      bodyClassName="items-center justify-center py-10 text-center"
      footer={
        revealed ? (
          <div className="grid grid-cols-4 gap-2">
            {GRADES.map((option) => (
              <button
                type="button"
                className={cn(
                  "flex touch-manipulation flex-col items-center gap-1.5 rounded-md border px-1 py-3 text-sm font-[540] transition-all duration-150 hover:-translate-y-px disabled:opacity-50",
                  option.tone,
                )}
                disabled={submitting}
                key={option.grade}
                onClick={() => void submitGrade(option.grade)}
              >
                {option.label}
                <Kbd>{option.key}</Kbd>
              </button>
            ))}
          </div>
        ) : undefined
      }
    >
      <Overline className="mb-4 self-center">
        {item.kind === "grammar" ? "Grammar" : "Recall"}
      </Overline>
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="font-jp-serif text-5xl leading-tight text-ink sm:text-6xl">
          {item.headword}
        </p>
        {!revealed ? (
          <div className="mt-8">
            <Button onClick={() => setRevealed(true)} size="lg">
              Reveal
            </Button>
            <p className="mt-3 text-[11px] text-ink-3">
              <Kbd>Space</Kbd> to reveal
            </p>
          </div>
        ) : (
          <div className="mt-5">
            {item.reading ? (
              <p className="font-mono text-base text-ink-3">{item.reading}</p>
            ) : null}
            <p className="mt-2 text-xl font-semibold text-ink">{item.gloss}</p>
            {item.example ? (
              <div className="mt-5 rounded-md border border-line bg-surface-2 px-4 py-3 text-base leading-relaxed text-ink-2">
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
    </SessionChrome>
  );
}
