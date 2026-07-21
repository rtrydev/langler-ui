"use client";

import { Callout } from "@/components/ui/Callout";
import { CopyButton } from "@/components/ui/CopyButton";
import type { LessonIssue } from "@/lib/api/lessons";

export function ValidationReport({ issues }: { issues: LessonIssue[] }) {
  const copyText = [
    "The lesson JSON you generated failed validation. Fix these issues and reply with the corrected, complete JSON only:",
    ...issues.map((issue) => `- ${issue.path}: ${issue.message}`),
  ].join("\n");

  return (
    <Callout tone="error">
      <p className="text-base font-bold text-vermilion-strong">
        Validation failed — {issues.length}{" "}
        {issues.length === 1 ? "issue" : "issues"}
      </p>
      <ul className="mt-3 grid gap-2 break-words font-mono text-xs leading-relaxed">
        {issues.map((issue, index) => (
          <li
            className="min-w-0 border-l-[3px] border-l-vermilion pl-3"
            key={`${issue.path}-${index}`}
          >
            <span className="font-bold tracking-wide text-vermilion">ERROR</span>{" "}
            <span className="break-all text-ink-3">{issue.path}</span>
            <span className="mt-1 block text-ink-2">{issue.message}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end">
        <CopyButton
          copiedLabel="Copied for your AI"
          text={copyText}
          variant="secondary"
        >
          Copy errors for your AI
        </CopyButton>
      </div>
    </Callout>
  );
}
