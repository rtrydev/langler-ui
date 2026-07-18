"use client";

import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { CopyButton } from "@/components/ui/CopyButton";
import { Heading } from "@/components/ui/Heading";

export function TokenReveal({
  secret,
  onDismiss,
}: {
  secret: string;
  onDismiss: () => void;
}) {
  return (
    <section
      aria-labelledby="token-created-title"
      className="rounded-xl border border-line bg-surface p-5 shadow-floating sm:p-7"
    >
      <Heading as="h2" id="token-created-title" size="sm">
        Token created
      </Heading>
      <p className="mt-1 text-[13px] text-ink-2">
        Copy it now — Langler doesn&apos;t store the secret.
      </p>
      <div className="mt-5 flex flex-col gap-3 rounded-[9px] border border-line bg-paper p-3 sm:flex-row sm:items-center">
        <code className="min-w-0 flex-1 break-all font-mono text-[13px] text-ink">
          {secret}
        </code>
        <CopyButton text={secret}>Copy</CopyButton>
      </div>
      <Callout className="mt-3" tone="warning">
        You won&apos;t see this token again. Store it somewhere safe.
      </Callout>
      <Button className="mt-5" fullWidth onClick={onDismiss} variant="contrast">
        I&apos;ve saved it
      </Button>
    </section>
  );
}
