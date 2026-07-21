"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { useSession } from "@/components/SessionContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Overline } from "@/components/ui/Overline";
import { listAssessments, type AssessmentSummary } from "@/lib/api/assessments";
import { languageOption, levelLabel } from "@/lib/lesson-catalog";

type HistoryState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; items: AssessmentSummary[] };

function shortDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function AssessmentHistory() {
  const session = useSession();
  const [state, setState] = useState<HistoryState>({ kind: "loading" });

  useEffect(() => {
    let active = true;
    listAssessments(session).then((result) => {
      if (!active) return;
      setState(
        result.ok
          ? { kind: "ready", items: result.data }
          : { kind: "error", message: result.error.message },
      );
    });
    return () => {
      active = false;
    };
  }, [session]);

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <Overline as="h2">Placement tests</Overline>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
            Level estimates seed your lesson defaults. They are approximate
            guidance, not certifications.
          </p>
        </div>
        <Link href="/assess/">
          <Button size="sm" variant="secondary">
            Take a test
          </Button>
        </Link>
      </div>

      {state.kind === "loading" ? (
        <LoadingState>Loading your placement history…</LoadingState>
      ) : null}

      {state.kind === "error" ? (
        <Callout tone="error">{state.message}</Callout>
      ) : null}

      {state.kind === "ready" && state.items.length === 0 ? (
        <EmptyState
          description={'Take one to stop guessing what "intermediate" means.'}
          title="No placement tests yet"
        />
      ) : null}

      {state.kind === "ready" && state.items.length > 0 ? (
        <div className="grid gap-2.5">
          {state.items.map((item) => {
            const language = languageOption(item.language);
            return (
              <Card
                className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2"
                key={item.assessmentId}
              >
                <div className="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-sm font-semibold text-ink">
                    {language?.englishName ?? item.language}
                  </p>
                  {item.status === "completed" && item.estimatedLevel ? (
                    <>
                      <p className="font-mono text-sm text-ink-2">
                        ≈{" "}
                        <strong className="text-ink">
                          {levelLabel(item.language, item.estimatedLevel)}
                        </strong>
                      </p>
                      {item.confidence ? (
                        <Badge tone="accent">{item.confidence} confidence</Badge>
                      ) : null}
                    </>
                  ) : (
                    <Badge tone="warning">In progress</Badge>
                  )}
                </div>
                <div className="flex min-h-8 items-center justify-between gap-3 sm:ml-auto sm:justify-start">
                  <p className="font-mono text-xs text-ink-3">
                    {shortDate(item.completedAt ?? item.startedAt)}
                  </p>
                  {item.status === "in_progress" ? (
                    <Link
                      href={`/assess/?id=${encodeURIComponent(item.assessmentId)}`}
                    >
                      <Button size="sm" variant="secondary">
                        Resume
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
