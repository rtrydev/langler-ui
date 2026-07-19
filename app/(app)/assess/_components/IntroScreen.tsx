"use client";

import { LanguagePicker } from "@/components/LanguagePicker";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import type { LanguageCode } from "@/lib/lesson-catalog";

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
      <Heading as="h1" size="lg">
        Find your level
      </Heading>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
        A short placement test that adapts round by round. Most sessions take
        5–10 minutes; it ends early once it finds your edge.
      </p>

      <div className="mt-6">
        <LanguagePicker
          onSelect={(option) => onLanguageChange(option.code)}
          value={language}
        />
      </div>

      <Card className="mt-6" elevation="card">
        <p className="text-[13.5px] font-semibold">What to expect</p>
        <ul className="mt-2 grid gap-1.5 text-[13px] leading-relaxed text-ink-2">
          <li>· Multiple-choice vocabulary, grammar, and reading questions.</li>
          <li>· Each round steps up a level; the test stops when a round gets hard.</li>
          <li>· No timer, no penalty for guessing — skip nothing, just answer.</li>
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
