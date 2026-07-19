"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Overline } from "@/components/ui/Overline";
import { listAssessments, type AssessmentSummary } from "@/lib/api/assessments";
import { languageOption, levelLabel } from "@/lib/lesson-catalog";

type HistoryState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; items: AssessmentSummary[]; guidance: string };

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
          ? { kind: "ready", items: result.data, guidance: result.guidance }
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
        <p className="font-mono text-sm text-ink-2" role="status">
          Loading your placement history…
        </p>
      ) : null}

      {state.kind === "error" ? (
        <Callout tone="error">{state.message}</Callout>
      ) : null}

      {state.kind === "ready" && state.items.length === 0 ? (
        <Card dashed>
          <p className="text-sm font-semibold text-accent">
            No placement tests yet.
          </p>
          <p className="mt-1 text-[13px] text-accent-strong">
            Take one to stop guessing what &quot;intermediate&quot; means.
          </p>
        </Card>
      ) : null}

      {state.kind === "ready" && state.items.length > 0 ? (
        <div className="grid gap-2.5">
          {state.items.map((item) => {
            const language = languageOption(item.language);
            return (
              <Card
                className="flex flex-wrap items-center gap-x-4 gap-y-2"
                key={item.assessmentId}
              >
                <p className="text-sm font-semibold text-ink">
                  {language?.englishName ?? item.language}
                </p>
                {item.status === "completed" && item.estimatedLevel ? (
                  <>
                    <p className="text-sm text-ink-2">
                      ≈{" "}
                      <strong className="text-ink">
                        {levelLabel(item.language, item.estimatedLevel)}
                      </strong>
                    </p>
                    {item.confidence ? (
                      <Badge tone="muted">{item.confidence} confidence</Badge>
                    ) : null}
                  </>
                ) : (
                  <Badge tone="warning">In progress</Badge>
                )}
                <p className="ml-auto text-xs text-ink-3">
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
              </Card>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
