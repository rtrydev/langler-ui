"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  importLesson,
  type ImportedLesson,
  type LessonIssue,
} from "@/lib/api/lessons";
import { checkPastedLesson } from "@/lib/validation/lesson";
import { ValidationReport } from "./ValidationReport";

type ImportState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "invalid"; issues: LessonIssue[] }
  | { status: "failed"; message: string }
  | { status: "imported"; lesson: ImportedLesson };

export function ImportStep({ onBack }: { onBack: () => void }) {
  const session = useSession();
  const [pasted, setPasted] = useState("");
  const [state, setState] = useState<ImportState>({ status: "idle" });

  async function validateAndImport() {
    const checked = checkPastedLesson(pasted);
    if (!checked.ok) {
      setState({ status: "invalid", issues: checked.issues });
      return;
    }
    setState({ status: "submitting" });
    const result = await importLesson(session, checked.document);
    if (result.ok) {
      setState({ status: "imported", lesson: result.data });
    } else if (result.issues) {
      setState({ status: "invalid", issues: result.issues });
    } else {
      setState({ status: "failed", message: result.error.message });
    }
  }

  if (state.status === "imported") {
    const { lesson } = state;
    return (
      <Card className="text-center" elevation="card" padding="lg">
        <span
          aria-hidden
          className="mx-auto mb-3.5 grid size-11 place-items-center rounded-full bg-success-soft text-xl text-success"
        >
          ✓
        </span>
        <p className="mb-1.5 text-lg font-bold">
          {lesson.created ? "Lesson imported" : "Lesson already in your library"}
        </p>
        <p className="text-[13.5px] font-semibold text-ink-2">{lesson.title}</p>
        <p className="mt-1 text-[12.5px] text-ink-3">
          {lesson.exerciseCount}{" "}
          {lesson.exerciseCount === 1 ? "exercise" : "exercises"} ·{" "}
          {lesson.totalPoints} points
          {lesson.vocabRefCount > 0
            ? ` · ${lesson.vocabRefCount} vocab items`
            : ""}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Button
            onClick={() => {
              setPasted("");
              setState({ status: "idle" });
            }}
            variant="secondary"
          >
            Import another
          </Button>
          <Link href={`/lessons/detail/?id=${lesson.lessonId}`}>
            <Button>Open lesson</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {state.status === "invalid" ? (
        <>
          <ValidationReport issues={state.issues} />
          <p className="text-[13px] leading-relaxed text-ink-2">
            Paste the errors back to your AI, then paste its corrected JSON
            below and validate again.
          </p>
        </>
      ) : (
        <p className="text-sm text-ink-2">Paste the JSON your AI produced.</p>
      )}

      {state.status === "failed" ? (
        <Callout tone="error">{state.message}</Callout>
      ) : null}

      <div>
        <Label className="sr-only" htmlFor="lesson-json">
          Lesson JSON
        </Label>
        <Textarea
          className="min-h-60 font-mono text-xs leading-relaxed"
          id="lesson-json"
          invalid={state.status === "invalid"}
          onChange={(event) => setPasted(event.target.value)}
          placeholder={'{"schemaVersion": "1.0", "lessonId": "…", …}'}
          value={pasted}
        />
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="secondary">
          ← Back
        </Button>
        <Button
          disabled={state.status === "submitting" || pasted.trim() === ""}
          onClick={() => void validateAndImport()}
        >
          {state.status === "submitting" ? "Validating…" : "Validate & import"}
        </Button>
      </div>
    </div>
  );
}
