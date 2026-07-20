import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LessonExercise } from "@/lib/api/lessons";
import { WorksheetExercise } from "./WorksheetExercise";

function readingExercise(overrides: Partial<LessonExercise["payload"]> = {}): LessonExercise {
  return {
    exerciseId: "story-1",
    type: "reading",
    prompt: "Read the story and answer.",
    points: 6,
    payload: {
      genre: "short_story",
      title: "Title",
      passage: "Passage text.",
      questions: [{ question: "Q?", kind: "multiple_choice", options: ["a", "b"], answer: "a" }],
      ...overrides,
    },
  };
}

describe("WorksheetExercise", () => {
  it("renders a Japanese connected story with kanji stroke-order grids", () => {
    const exercise: LessonExercise = {
      exerciseId: "script-ja",
      type: "script_practice",
      points: 4,
      payload: { items: [{ glyph: "京", reading: "きょう", meaning: "capital" }] },
    };
    const { container } = render(
      <WorksheetExercise answers={false} exercise={exercise} index={0} language="ja" />,
    );
    expect(container.querySelector(".worksheet-glyph-group")).toBeTruthy();
    expect(screen.getByText(/stroke-order hint|trace the reference glyph/)).toBeTruthy();
  });

  it("renders a Burmese connected story with a vocabulary glossary of the new words", () => {
    const exercise = readingExercise({
      passage: "ကျောင်းကို သွားမယ်။",
      annotations: [{ surface: "ကျောင်း", reading: "kyaung:", gloss: "school" }],
    });
    const { container } = render(
      <WorksheetExercise answers={false} exercise={exercise} index={0} language="my" />,
    );
    expect(container.querySelector(".worksheet-passage ruby")).toBeNull();
    const glossary = container.querySelector(".worksheet-glossary");
    expect(glossary).toBeTruthy();
    expect(within(glossary as HTMLElement).getByText("ကျောင်း")).toBeTruthy();
    expect(within(glossary as HTMLElement).getByText("kyaung:")).toBeTruthy();
    expect(within(glossary as HTMLElement).getByText("school")).toBeTruthy();
  });

  it("renders a Burmese script-practice item in a plain practice grid (no stroke asset)", () => {
    const exercise: LessonExercise = {
      exerciseId: "script-my",
      type: "script_practice",
      points: 4,
      payload: { items: [{ glyph: "က", reading: "ka", meaning: "letter ka" }] },
    };
    const { container } = render(
      <WorksheetExercise answers={false} exercise={exercise} index={0} language="my" />,
    );
    expect(container.querySelector(".worksheet-stroke-hint")).toBeNull();
    expect(container.querySelector(".worksheet-model")).toBeTruthy();
  });

  it("renders a Polish connected story with a glossary and an orthography drill answer key", () => {
    const story = readingExercise({
      passage: "Pojechałam do Krakowa.",
      annotations: [{ surface: "pojechać", reading: "po-ye-hach", gloss: "to go (by vehicle)" }],
    });
    const { container } = render(<WorksheetExercise answers={false} exercise={story} index={0} language="pl" />);
    expect(screen.getByText("Pojechałam do Krakowa.")).toBeTruthy();
    expect(within(container.querySelector(".worksheet-glossary") as HTMLElement).getByText("to go (by vehicle)")).toBeTruthy();

    const orthography: LessonExercise = {
      exerciseId: "ort-1",
      type: "script_practice",
      points: 2,
      payload: {
        items: [{ kind: "choice", glyph: "Wybierz poprawną pisownię.", options: ["król", "krul"], answer: "król" }],
      },
    };
    render(<WorksheetExercise answers exercise={orthography} index={1} language="pl" />);
    expect(screen.getByText("król")).toBeTruthy();
  });

  it("falls back to an unsupported-type notice instead of silently rendering nothing", () => {
    const exercise = { exerciseId: "mystery", type: "flashcard", points: 1, payload: {} } as unknown as LessonExercise;
    render(<WorksheetExercise answers={false} exercise={exercise} index={0} language="ja" />);
    expect(screen.getByText("Unsupported exercise type: flashcard")).toBeTruthy();
  });
});
