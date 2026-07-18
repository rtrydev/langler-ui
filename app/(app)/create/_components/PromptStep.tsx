"use client";

import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CopyButton } from "@/components/ui/CopyButton";
import { Switch } from "@/components/ui/Switch";
import type { PromptState } from "./CreateLessonWizard";

type PromptStepProps = {
  prompt: PromptState;
  includeReference: boolean;
  onToggleReference: (include: boolean) => void;
  onRetry: () => void;
  onBack: () => void;
  onNext: () => void;
};

export function PromptStep({
  prompt,
  includeReference,
  onToggleReference,
  onRetry,
  onBack,
  onNext,
}: PromptStepProps) {
  return (
    <div className="grid gap-4">
      <p className="text-sm leading-relaxed text-ink-2">
        Paste this into any AI chat and ask it for the lesson JSON. When it
        replies, copy the JSON and move to <b>Import</b>.
      </p>

      {prompt.status === "loading" ? (
        <p className="font-mono text-sm text-ink-2" role="status">
          Building your prompt…
        </p>
      ) : null}

      {prompt.status === "error" ? (
        <div className="grid gap-3">
          <Callout tone="error">{prompt.message}</Callout>
          <div>
            <Button onClick={onRetry} variant="secondary">
              Try again
            </Button>
          </div>
        </div>
      ) : null}

      {prompt.status === "ready" ? (
        <CodeBlock
          actions={
            <CopyButton size="sm" text={prompt.text} variant="accent">
              Copy prompt
            </CopyButton>
          }
          preClassName="max-h-72"
          title="generated-prompt.md"
        >
          {prompt.text}
        </CodeBlock>
      ) : null}

      <Switch
        checked={includeReference}
        onChange={(event) => onToggleReference(event.target.checked)}
      >
        Include a slice of reference data (vocabulary and grammar you can
        ground the lesson in)
      </Switch>

      <div className="mt-2 flex justify-between">
        <Button onClick={onBack} variant="secondary">
          ← Back
        </Button>
        <Button disabled={prompt.status !== "ready"} onClick={onNext}>
          I have the JSON →
        </Button>
      </div>
    </div>
  );
}
