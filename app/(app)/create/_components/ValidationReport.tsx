"use client";

import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import type { LessonIssue } from "@/lib/api/lessons";

export function ValidationReport({ issues }: { issues: LessonIssue[] }) {
  const copyText = [
    "The lesson JSON you generated failed validation. Fix these issues and reply with the corrected, complete JSON only:",
    ...issues.map((issue) => `- ${issue.path}: ${issue.message}`),
  ].join("\n");

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="grid size-6 place-items-center rounded-full bg-vermilion-soft text-sm text-vermilion"
        >
          ✕
        </span>
        <p className="text-base font-bold">
          Validation failed — {issues.length}{" "}
          {issues.length === 1 ? "issue" : "issues"}
        </p>
      </div>
      <Card elevation="card" padding="none">
        <ul>
          {issues.map((issue, index) => (
            <li
              className="border-l-[3px] border-l-vermilion px-4 py-3.5 not-last:border-b not-last:border-b-line-2"
              key={`${issue.path}-${index}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[11px] font-bold tracking-wide text-vermilion">
                  ERROR
                </span>
                <span className="font-mono text-[11px] text-ink-3">
                  {issue.path}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed">
                {issue.message}
              </p>
            </li>
          ))}
        </ul>
      </Card>
      <div className="flex justify-end">
        <CopyButton copiedLabel="Copied for your AI" text={copyText} variant="danger">
          Copy errors for your AI
        </CopyButton>
      </div>
    </div>
  );
}
