import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LessonExercise } from "@/lib/api/lessons";
import { ExerciseRenderer } from "./ExerciseRenderer";

vi.mock("client-only", () => ({}));

function translation(exerciseId: string, source: string): LessonExercise {
  return {
    exerciseId,
    type: "translation",
    points: 4,
    payload: { source },
  };
}

describe("ExerciseRenderer", () => {
  it("resets local state when the exercise changes", () => {
    const onComplete = vi.fn();
    const { rerender } = render(
      <ExerciseRenderer exercise={translation("first", "Hello")} language="ja" level="N5" onComplete={onComplete} />,
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "こんにちは" } });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("こんにちは");

    rerender(
      <ExerciseRenderer exercise={translation("second", "Goodbye")} language="ja" level="N5" onComplete={onComplete} />,
    );

    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("");
  });
});
