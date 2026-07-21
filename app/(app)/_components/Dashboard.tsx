"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { PageHeader } from "@/components/PageHeader";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Overline } from "@/components/ui/Overline";
import { StatusDot } from "@/components/ui/StatusDot";
import { getProfileLevels, type ProfileLevel } from "@/lib/api/assessments";
import {
  getProgressSummary,
  type LanguageProgress,
} from "@/lib/api/progress";
import { languageOption, levelLabel } from "@/lib/lesson-catalog";

type DashboardState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; languages: LanguageProgress[] };

function longDate(): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

function lessonScore(score: number, maximum: number): string {
  if (maximum === 0) return "Recorded";
  return `${Math.round((score / maximum) * 100)}%`;
}

export function Dashboard() {
  const session = useSession();
  const [state, setState] = useState<DashboardState>({ kind: "loading" });
  const [levels, setLevels] = useState<ProfileLevel[]>([]);

  useEffect(() => {
    let active = true;
    getProgressSummary(session).then((result) => {
      if (!active) return;
      setState(
        result.ok
          ? { kind: "ready", languages: result.data }
          : { kind: "error", message: result.error.message },
      );
    });
    getProfileLevels(session).then((result) => {
      if (active && result.ok) setLevels(result.data);
    });
    return () => {
      active = false;
    };
  }, [session]);

  if (state.kind === "loading") {
    return (
      <div>
        <PageHeader kicker={longDate()} title="Your notebook" />
        <LoadingState>Checking today&apos;s study notes…</LoadingState>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div>
        <PageHeader kicker={longDate()} title="Your notebook" />
        <Callout tone="error">{state.message}</Callout>
      </div>
    );
  }

  const recent = state.languages
    .flatMap((language) =>
      language.recentLessons.map((lesson) => ({ ...lesson, language: language.language })),
    )
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 3);

  return (
    <div>
      <PageHeader kicker={longDate()} title="Your notebook" />

      <Overline as="h2" className="mb-3">
        Due today
      </Overline>
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {state.languages.map((progress) => {
          const language = languageOption(progress.language);
          if (!language) return null;
          return (
            <Card
              className="flex items-center justify-between gap-4 md:block"
              elevation="card"
              key={progress.language}
            >
              <div>
                <p className="font-display text-base font-semibold text-ink md:text-xl">
                  {language.nativeName}{" "}
                  <span className="font-sans text-xs font-normal text-ink-3 md:mt-0.5 md:block">
                    {language.englishName}
                  </span>
                </p>
                {progress.dueToday > 0 ? (
                  <p className="mt-1 text-[13px] text-ink-2 md:my-3">
                    <strong className="font-display font-semibold text-ink md:text-3xl">
                      {progress.dueToday}
                    </strong>{" "}
                    items due
                  </p>
                ) : (
                  <p className="mt-1 text-[13px] text-ink-2 md:my-5">
                    All caught up <span className="text-success">✓</span>
                  </p>
                )}
              </div>
              {progress.dueToday > 0 ? (
                <Link href={`/review/?language=${progress.language}`}>
                  <Button className="md:w-full" size="sm">
                    Review
                  </Button>
                </Link>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Overline as="h2" className="mt-10 mb-3">
        Recent lessons
      </Overline>
      {recent.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {recent.map((lesson) => {
            const language = languageOption(lesson.language);
            return (
              <Link
                href={`/lessons/detail/?id=${encodeURIComponent(lesson.lessonId)}`}
                key={`${lesson.lessonId}-${lesson.completedAt}`}
              >
                <Card className="h-full transition-all duration-150 hover:-translate-y-px hover:border-accent-border hover:shadow-raised">
                  <p className="font-mono text-[11px] tracking-[0.04em] text-ink-3 uppercase">
                    {language?.nativeName ?? lesson.language} ·{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(lesson.completedAt))}
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-ink">
                    {lesson.title}
                  </p>
                  <p className="mt-3 font-display text-lg font-semibold text-accent">
                    {lessonScore(lesson.score, lesson.maxScore)}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          description="Open a lesson when you're ready to study."
          title="Your first result will appear here"
        >
          <Link href="/lessons/">
            <Button size="sm" variant="accent">
              Browse lessons
            </Button>
          </Link>
        </EmptyState>
      )}

      <Overline as="h2" className="mt-10 mb-3">
        Per-language snapshot
      </Overline>
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {state.languages.map((progress) => {
          const language = languageOption(progress.language);
          if (!language) return null;
          const estimate = levels.find(
            (level) => level.language === progress.language,
          );
          return (
            <Card className="flex h-full flex-col" key={progress.language}>
              <p className="flex items-center text-sm font-semibold text-ink">
                <StatusDot className="mr-2" tone={language.tone} />
                {language.nativeName}
              </p>
              {estimate ? (
                <div className="mt-2">
                  <span className="font-display text-2xl font-semibold text-ink">
                    ≈ {levelLabel(progress.language, estimate.level)}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-ink-3">
                    estimated · placement{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(estimate.updatedAt))}
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-[13px] text-ink-2">
                  No estimate yet ·{" "}
                  <Link
                    className="font-semibold text-accent hover:text-accent-hover"
                    href="/assess/"
                  >
                    Take placement test
                  </Link>
                </p>
              )}
              <div className="mt-auto flex gap-6 border-t border-line pt-3">
                <div>
                  <p className="font-display text-lg font-semibold">
                    {progress.lessonsCompleted}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase">
                    lessons
                  </p>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">
                    {progress.itemsTracked}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase">
                    items
                  </p>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">
                    {progress.currentReviewStreak}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase">
                    review days
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
