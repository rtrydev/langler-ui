import { describe, expect, it } from "vitest";
import {
  assessmentAnswersSchema,
  assessmentStartSchema,
} from "./assessment";

describe("assessmentStartSchema", () => {
  it("accepts supported languages", () => {
    expect(assessmentStartSchema.safeParse({ language: "ja" }).success).toBe(
      true,
    );
    expect(assessmentStartSchema.safeParse({ language: "pl" }).success).toBe(
      true,
    );
  });

  it("rejects unknown languages", () => {
    expect(assessmentStartSchema.safeParse({ language: "xx" }).success).toBe(
      false,
    );
  });
});

describe("assessmentAnswersSchema", () => {
  it("accepts a full stage submission", () => {
    expect(
      assessmentAnswersSchema.safeParse({
        stageIndex: 0,
        answers: [0, 1, 2, 3, 0, 1, 2, 3],
      }).success,
    ).toBe(true);
  });

  it("rejects empty, negative, and fractional answers", () => {
    expect(
      assessmentAnswersSchema.safeParse({ stageIndex: 0, answers: [] }).success,
    ).toBe(false);
    expect(
      assessmentAnswersSchema.safeParse({ stageIndex: -1, answers: [0] })
        .success,
    ).toBe(false);
    expect(
      assessmentAnswersSchema.safeParse({ stageIndex: 0, answers: [-1] })
        .success,
    ).toBe(false);
    expect(
      assessmentAnswersSchema.safeParse({ stageIndex: 0, answers: [0.5] })
        .success,
    ).toBe(false);
  });
});
