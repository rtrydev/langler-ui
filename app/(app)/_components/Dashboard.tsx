"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
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
        <Heading as="h1" size="lg">
          Your notebook
        </Heading>
        <p className="mt-4 font-mono text-sm text-ink-2" role="status">
          Checking today&apos;s study notes…
        </p>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div>
        <Heading as="h1" size="lg">
          Your notebook
        </Heading>
        <Callout className="mt-5" tone="error">
          {state.message}
        </Callout>
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
      <p className="text-xs font-medium text-ink-3">{longDate()}</p>
      <Heading as="h1" className="mt-0.5" size="lg">
        Your notebook
      </Heading>

      <Overline as="h2" className="mt-8 mb-3">
        Due today
      </Overline>
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {state.languages.map((progress) => {
          const language = languageOption(progress.language);
          if (!language) return null;
          return (
            <Card
              className="flex items-center justify-between gap-4 md:block"
              edge={language.tone}
              edgeSide="left"
              elevation="card"
              key={progress.language}
            >
              <div>
                <p className="text-base font-bold text-ink md:text-xl">
                  {language.nativeName}{" "}
                  <span className="text-xs font-normal text-ink-3 md:block md:mt-0.5">
                    {language.englishName}
                  </span>
                </p>
                {progress.dueToday > 0 ? (
                  <p className="mt-1 text-[13px] text-ink-2 md:my-3">
                    <strong className="text-ink md:text-3xl">{progress.dueToday}</strong>{" "}
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

      <Overline as="h2" className="mt-8 mb-3">
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
                <Card className="h-full transition-colors hover:border-accent-border">
                  <p className="text-[11px] font-semibold text-ink-3">
                    {language?.nativeName ?? lesson.language} ·{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(lesson.completedAt))}
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-ink">
                    {lesson.title}
                  </p>
                  <p className="mt-3 text-sm font-bold text-accent">
                    {lessonScore(lesson.score, lesson.maxScore)}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card dashed>
          <p className="text-sm font-semibold text-accent">Your first result will appear here.</p>
          <p className="mt-1 text-[13px] text-accent-strong">
            Open a lesson when you&apos;re ready to study.
          </p>
          <Link className="mt-4 inline-block" href="/lessons/">
            <Button size="sm" variant="accent">
              Browse lessons
            </Button>
          </Link>
        </Card>
      )}

      <Overline as="h2" className="mt-8 mb-3">
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
            <Card key={progress.language}>
              <p className="text-sm font-bold text-ink">
                <StatusDot className="mr-2" tone={language.tone} />
                {language.nativeName}
              </p>
              {estimate ? (
                <p className="mt-2 text-[13px] text-ink-2">
                  <strong className="text-ink">
                    {levelLabel(progress.language, estimate.level)}
                  </strong>{" "}
                  <span className="text-[11px] text-ink-3">
                    estimated · placement{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(estimate.updatedAt))}
                  </span>
                </p>
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
              <div className="mt-4 flex gap-6 border-t border-line-2 pt-3">
                <div>
                  <p className="text-base font-bold">{progress.lessonsCompleted}</p>
                  <p className="text-[10.5px] text-ink-3">lessons</p>
                </div>
                <div>
                  <p className="text-base font-bold">{progress.itemsTracked}</p>
                  <p className="text-[10.5px] text-ink-3">items</p>
                </div>
                <div>
                  <p className="text-base font-bold">{progress.currentReviewStreak}</p>
                  <p className="text-[10.5px] text-ink-3">review days</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
