import { describe, expect, it } from "vitest";
import {
  gradeCloze,
  gradeMatching,
  gradeOrdering,
  gradeReading,
  matchesAnswer,
} from "@/lib/lesson-grading";
import type { LessonExercise } from "@/lib/api/lessons";

describe("lesson grading", () => {
  it("normalizes full-width and alternate cloze answers", () => {
    const exercise: LessonExercise = {
      exerciseId: "cloze-1",
      type: "cloze",
      points: 8,
      payload: {
        blanks: [{ index: 1, answer: "行きました", alternates: ["いきました"] }],
      },
    };
    expect(gradeCloze(exercise, { 1: " いきました " }).score).toBe(8);
    expect(matchesAnswer("ＡＢＣ", ["abc"])).toBe(true);
  });

  it("awards proportional ordering and matching points", () => {
    const ordering: LessonExercise = {
      exerciseId: "order-1",
      type: "ordering",
      points: 6,
      payload: { items: ["私", "は", "学生"] },
    };
    expect(gradeOrdering(ordering, ["私", "学生", "は"]).score).toBe(2);

    const matching: LessonExercise = {
      exerciseId: "match-1",
      type: "matching",
      points: 4,
      payload: { pairs: [{ left: "水", right: "water" }, { left: "火", right: "fire" }] },
    };
    expect(gradeMatching(matching, { 水: "water", 火: "heat" }).score).toBe(2);
  });

  it("excludes reading questions without a reference answer", () => {
    const reading: LessonExercise = {
      exerciseId: "reading-1",
      type: "reading",
      points: 8,
      payload: {
        questions: [
          { question: "Where?", kind: "short_answer", answer: "Kyoto" },
          { question: "Why?", kind: "short_answer", answer: "   " },
        ],
      },
    };

    expect(gradeReading(reading, { 0: "Kyoto", 1: "For fun" })).toEqual(expect.objectContaining({ correct: 1, total: 1, score: 8 }));
  });
});
