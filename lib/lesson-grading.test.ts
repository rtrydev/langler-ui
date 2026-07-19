import { describe, expect, it } from "vitest";
import {
  gradeCloze,
  gradeMatching,
  gradeMultipleChoice,
  gradeOrdering,
  gradeOrthography,
  gradeReading,
  matchesAnswer,
  seededShuffle,
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

  it("accepts short-answer alternates in reading questions", () => {
    const reading: LessonExercise = {
      exerciseId: "reading-2",
      type: "reading",
      points: 4,
      payload: {
        questions: [
          {
            question: "Who?",
            kind: "short_answer",
            answer: "友達と行きました。",
            alternates: ["友達", "友達と"],
          },
        ],
      },
    };
    expect(gradeReading(reading, { 0: "友達" }).score).toBe(4);
    expect(gradeReading(reading, { 0: "先生" }).score).toBe(0);
  });

  it("grades multiple choice against the exact answer option", () => {
    const exercise: LessonExercise = {
      exerciseId: "mc-1",
      type: "multiple_choice",
      points: 6,
      payload: {
        questions: [
          { question: "q1", options: ["went", "ate", "ran"], answer: "went" },
          { question: "q2", options: ["water", "fire"], answer: "fire" },
          { question: "q3", options: ["a", "b"], answer: "b" },
        ],
      },
    };
    expect(gradeMultipleChoice(exercise, { 0: "went", 1: "fire", 2: "a" })).toEqual(
      expect.objectContaining({ grading: "auto", correct: 2, total: 3, score: 4 }),
    );
  });

  it("grades Polish orthography choices and typed answers", () => {
    const exercise: LessonExercise = {
      exerciseId: "ort-1",
      type: "script_practice",
      points: 6,
      payload: {
        items: [
          { kind: "choice", glyph: "Monarch", options: ["król", "krul"], answer: "król" },
          { kind: "dictation", glyph: "Sea", answer: "morze" },
          { kind: "dictation", glyph: "Tea", answer: "herbata" },
        ],
      },
    };

    expect(gradeOrthography(exercise, { 0: "król", 1: " MORZE ", 2: "cherbata" })).toEqual(
      expect.objectContaining({ grading: "auto", correct: 2, total: 3, score: 4 }),
    );
  });

  it("shuffles deterministically without leaking the source order", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    const first = seededShuffle(items, "ex-1");
    expect(seededShuffle(items, "ex-1")).toEqual(first);
    expect([...first].sort()).toEqual([...items].sort());
    expect(first).not.toEqual(items);
    expect(seededShuffle(["x", "y"], "pair")).not.toEqual(["x", "y"]);
    expect(items).toEqual(["a", "b", "c", "d", "e", "f"]);
  });
});
