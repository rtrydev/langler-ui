"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="paper-grid grid min-h-screen place-items-center px-5">
      <Card elevation="raised" padding="none" className="w-full max-w-md">
        <EmptyState
          className="border-0 bg-transparent"
          title="Something went wrong"
          description="Your lessons are safe — try again."
        >
          <Button onClick={reset} variant="secondary">
            Try again
          </Button>
        </EmptyState>
      </Card>
    </main>
  );
}
