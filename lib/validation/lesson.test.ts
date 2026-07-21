import { describe, expect, it } from "vitest";
import {
  checkPastedLesson,
  promptParamsSchema,
} from "@/lib/validation/lesson";

const validDocument = JSON.stringify({
  schemaVersion: "1.0",
  lessonId: "3e2d5f6a-9d0b-4c1e-8a7f-2b6c9d3e1f00",
  language: "ja",
  level: "N4",
  title: "Weekend plans in Kyoto",
  readingStage: "connected",
  exercises: [{ exerciseId: "ex-1", type: "cloze", payload: {} }],
});

describe("checkPastedLesson", () => {
  it("accepts a valid lesson document", () => {
    const result = checkPastedLesson(validDocument);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.document.lessonId).toBe(
        "3e2d5f6a-9d0b-4c1e-8a7f-2b6c9d3e1f00",
      );
    }
  });

  it("strips markdown code fences before parsing", () => {
    const result = checkPastedLesson("```json\n" + validDocument + "\n```");
    expect(result.ok).toBe(true);
  });

  it("accepts JSON written with typographic quotes", () => {
    let count = 0;
    const curly = validDocument.replace(/"/g, () =>
      count++ % 2 === 0 ? "\u201c" : "\u201d",
    );
    const result = checkPastedLesson(curly);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.document.lessonId).toBe(
        "3e2d5f6a-9d0b-4c1e-8a7f-2b6c9d3e1f00",
      );
    }
  });

  it("accepts JSON containing non-breaking spaces between tokens", () => {
    const spaced = validDocument.replace(/":/g, '":\u00a0');
    expect(checkPastedLesson(spaced).ok).toBe(true);
  });

  it("accepts curly-quote JSON with unescaped quotes nested in values", () => {
    const o = "\u201c";
    const c = "\u201d";
    const q = (value: string) => o + value + c;
    const dialogue = `\u100a\u102e\u1000 ${o}\u1018\u101a\u103a\u101e\u1030\u101c\u1032${c} \u101c\u102d\u102f\u1037 \u1019\u1031\u1038\u1010\u101a\u103a\u104b`;
    const pasted =
      `{${q("schemaVersion")}:${q("1.0")},` +
      `${q("lessonId")}:${q("3e2d5f6a-9d0b-4c1e-8a7f-2b6c9d3e1f00")},` +
      `${q("language")}:${q("my")},${q("level")}:${q("A1")},` +
      `${q("title")}:${q("\u1019\u102d\u101e\u102c\u1038\u1005\u102f")},${q("readingStage")}:${q("connected")},` +
      `${q("exercises")}:[{${q("exerciseId")}:${q("ex-1")},${q("type")}:${q("reading")},` +
      `${q("payload")}:{${q("passage")}:${q(dialogue)},` +
      `${q("question")}:${c}${o}\u1000\u103c\u102e\u1038\u1010\u101a\u103a${c} \u1006\u102d\u102f\u1010\u102c \u1018\u102c\u101c\u1032\u104b${c},` +
      `${q("gloss")}:${q("one\u2019s")}}}]}`;
    const result = checkPastedLesson(pasted);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const exercises = result.document.exercises as Array<{
        payload: Record<string, string>;
      }>;
      expect(exercises[0].payload.passage).toBe(dialogue);
      expect(exercises[0].payload.question).toBe(
        `${o}\u1000\u103c\u102e\u1038\u1010\u101a\u103a${c} \u1006\u102d\u102f\u1010\u102c \u1018\u102c\u101c\u1032\u104b`,
      );
      expect(exercises[0].payload.gloss).toBe("one\u2019s");
    }
  });

  it("reports invalid JSON with a helpful message", () => {
    const result = checkPastedLesson('{"broken":');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0].path).toBe("$");
      expect(result.issues[0].message).toContain("not valid JSON");
    }
  });

  it("reports missing required top-level fields", () => {
    const result = checkPastedLesson('{"schemaVersion": "1.0"}');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const paths = result.issues.map((issue) => issue.path);
      expect(paths).toContain("lessonId");
      expect(paths).toContain("exercises");
    }
  });

  it("rejects an empty paste", () => {
    const result = checkPastedLesson("   ");
    expect(result.ok).toBe(false);
  });
});

describe("promptParamsSchema", () => {
  const base = {
    language: "ja",
    level: "N5",
    topic: "Food & drink",
    exerciseTypes: ["cloze"],
    readingStage: "connected",
    length: "standard",
    includeReference: true,
  };

  it("accepts a request without a topic slug", () => {
    expect(promptParamsSchema.safeParse(base).success).toBe(true);
  });

  it("accepts a valid topic slug", () => {
    const result = promptParamsSchema.safeParse({
      ...base,
      topicSlug: "food-drink",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.topicSlug).toBe("food-drink");
    }
  });

  it("rejects a malformed topic slug", () => {
    expect(
      promptParamsSchema.safeParse({ ...base, topicSlug: "Food & Drink" })
        .success,
    ).toBe(false);
  });
});
