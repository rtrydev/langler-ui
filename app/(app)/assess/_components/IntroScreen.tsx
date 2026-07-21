"use client";

import { LanguagePicker } from "@/components/LanguagePicker";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { StatusCircle } from "@/components/ui/StatusCircle";
import type { LanguageCode } from "@/lib/lesson-catalog";

const EXPECTATIONS = [
  "Multiple-choice vocabulary, grammar, and reading questions.",
  "Each round steps up a level; the test stops when a round gets hard.",
  "No timer, no penalty for guessing — skip nothing, just answer.",
];

type IntroScreenProps = {
  language: LanguageCode;
  message: string;
  onLanguageChange: (code: LanguageCode) => void;
  onStart: () => void;
};

export function IntroScreen({
  language,
  message,
  onLanguageChange,
  onStart,
}: IntroScreenProps) {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        kicker="Placement"
        title="Find your level"
        description="A short placement test that adapts round by round. Most sessions take 5–10 minutes; it ends early once it finds your edge."
      />

      <LanguagePicker
        onSelect={(option) => onLanguageChange(option.code)}
        value={language}
      />

      <Card className="mt-6" elevation="card">
        <p className="text-[13.5px] font-semibold">What to expect</p>
        <ul className="mt-3 grid gap-2.5">
          {EXPECTATIONS.map((text, index) => (
            <li
              className="flex items-start gap-3 text-[13px] leading-relaxed text-ink-2"
              key={text}
            >
              <StatusCircle
                className="mt-px font-mono text-[11px] font-[560]"
                tone="accent"
              >
                {index + 1}
              </StatusCircle>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Callout className="mt-4" tone="info">
        The result is approximate guidance, not a certification. It pre-fills
        your lesson level, and you can always override it.
      </Callout>

      {message ? (
        <Callout className="mt-4" tone="error">
          {message}
        </Callout>
      ) : null}

      <div className="mt-6">
        <Button onClick={onStart} size="lg">
          Start the placement test
        </Button>
      </div>
    </div>
  );
}
