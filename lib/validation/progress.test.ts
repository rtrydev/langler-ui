import { describe, expect, it } from "vitest";
import { reviewGradeSchema } from "./progress";

describe("reviewGradeSchema", () => {
  it("accepts a complete self-grade", () => {
    expect(
      reviewGradeSchema.safeParse({
        language: "ja",
        kind: "vocab",
        itemId: "N4#1416220",
        grade: "good",
      }).success,
    ).toBe(true);
  });

  it("rejects unsupported grades", () => {
    expect(
      reviewGradeSchema.safeParse({
        language: "ja",
        kind: "vocab",
        itemId: "N4#1416220",
        grade: "perfect",
      }).success,
    ).toBe(false);
  });
});
