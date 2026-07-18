import { describe, expect, it } from "vitest";
import { checkPastedLesson } from "@/lib/validation/lesson";

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
