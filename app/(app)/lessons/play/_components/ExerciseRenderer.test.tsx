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

  it("plays a multiple choice exercise through check and complete", () => {
    const onComplete = vi.fn();
    const exercise: LessonExercise = {
      exerciseId: "mc-1",
      type: "multiple_choice",
      points: 4,
      payload: {
        questions: [
          { question: "What does 行く mean?", options: ["to go", "to eat"], answer: "to go" },
        ],
      },
    };
    render(<ExerciseRenderer exercise={exercise} language="ja" level="N5" onComplete={onComplete} />);

    expect((screen.getByRole("button", { name: "Check" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByText("to go"));
    fireEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("1 of 1 questions correct.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ exerciseId: "mc-1", grading: "auto", score: 4, correct: 1, total: 1 }),
    );
  });

  it("fills cloze blanks from a word bank by tapping", () => {
    const onComplete = vi.fn();
    const exercise: LessonExercise = {
      exerciseId: "cloze-bank",
      type: "cloze",
      points: 2,
      payload: {
        text: "私は{{1}}へ{{2}}。",
        blanks: [
          { index: 1, answer: "京都" },
          { index: 2, answer: "行きました" },
        ],
        wordBank: ["京都", "行きました", "食べました"],
      },
    };
    render(<ExerciseRenderer exercise={exercise} language="ja" level="N5" onComplete={onComplete} />);

    expect(screen.queryByRole("textbox")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "京都" }));
    fireEvent.click(screen.getByRole("button", { name: "行きました" }));
    fireEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("2 of 2 blanks correct.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ exerciseId: "cloze-bank", score: 2, correct: 2, total: 2 }),
    );
  });
});
