"use client";

import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-5">
      <div className="w-full">
        <Callout className="mb-4" tone="error">
          Something went wrong. Your lessons are safe — try again.
        </Callout>
        <Button onClick={reset} variant="secondary">
          Try again
        </Button>
      </div>
    </main>
  );
}
