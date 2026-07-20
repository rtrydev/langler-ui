import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SessionProvider } from "@/components/SessionContext";
import type { AuthSession } from "@/lib/auth/cognito";
import type { LessonExercise } from "@/lib/api/lessons";
import { ReadingExercise } from "./ReadingExercise";

vi.mock("client-only", () => ({}));
vi.mock("@/lib/api/reference", () => ({ listVocabulary: vi.fn().mockResolvedValue({ ok: true, data: [] }) }));

const session = { idToken: "id", accessToken: "access" } as unknown as AuthSession;

function renderReading(exercise: LessonExercise, language: string, level: string) {
  const onComplete = vi.fn();
  render(
    <SessionProvider session={session}>
      <ReadingExercise exercise={exercise} language={language} level={level} onComplete={onComplete} />
    </SessionProvider>,
  );
  return onComplete;
}

describe("ReadingExercise", () => {
  it("renders Japanese furigana annotations and grades a connected story", () => {
    const exercise: LessonExercise = {
      exerciseId: "story-ja",
      type: "reading",
      points: 6,
      payload: {
        genre: "short_story",
        title: "京都の週末",
        passage: "京都へ行きました。",
        annotations: [{ surface: "京都", reading: "きょうと", gloss: "Kyoto" }],
        questions: [
          { question: "どこへ行きましたか。", kind: "multiple_choice", options: ["京都", "東京"], answer: "京都" },
        ],
      },
    };
    const onComplete = renderReading(exercise, "ja", "N5");

    expect(screen.getByText("きょうと")).toBeTruthy();
    fireEvent.click(screen.getByRole("switch", { name: "Furigana" }));
    const questionsJa = screen.getByLabelText("Comprehension questions");
    fireEvent.click(within(questionsJa).getByText("京都"));
    fireEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("1 of 1 gradable answers correct.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ correct: 1, total: 1 }));
  });

  it("renders Burmese romanization annotations and grades a connected story", () => {
    const exercise: LessonExercise = {
      exerciseId: "story-my",
      type: "reading",
      points: 6,
      payload: {
        genre: "short_story",
        title: "ကျောင်းသွားတဲ့နေ့",
        passage: "ကျောင်းကို သွားမယ်။",
        annotations: [{ surface: "ကျောင်း", reading: "kyaung:", gloss: "school" }],
        questions: [
          { question: "ဘယ်ကို သွားမလဲ။", kind: "multiple_choice", options: ["ကျောင်း", "အိမ်"], answer: "ကျောင်း" },
        ],
      },
    };
    const onComplete = renderReading(exercise, "my", "A1");

    expect(screen.getByRole("switch", { name: "Romanization" })).toBeTruthy();
    const questionsMy = screen.getByLabelText("Comprehension questions");
    fireEvent.click(within(questionsMy).getByText("ကျောင်း"));
    fireEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("1 of 1 gradable answers correct.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ correct: 1, total: 1 }));
  });

  it("renders a Polish connected story with plain paragraphs and grades comprehension", () => {
    const exercise: LessonExercise = {
      exerciseId: "story-pl",
      type: "reading",
      points: 6,
      payload: {
        genre: "short_story",
        title: "Weekend w Krakowie",
        passage: "Pojechałam do Krakowa.",
        questions: [
          { question: "Dokąd pojechała autorka?", kind: "multiple_choice", options: ["do Krakowa", "do Warszawy"], answer: "do Krakowa" },
        ],
      },
    };
    const onComplete = renderReading(exercise, "pl", "A2");

    expect(screen.getByText("Pojechałam do Krakowa.")).toBeTruthy();
    fireEvent.click(screen.getByText("do Krakowa"));
    fireEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("1 of 1 gradable answers correct.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ correct: 1, total: 1 }));
  });
});
