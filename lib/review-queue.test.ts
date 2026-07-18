import { describe, expect, it } from "vitest";
import { reviewQueue } from "./review-queue";

describe("reviewQueue", () => {
  it("keeps due items from every language", () => {
    const item = {
      itemId: "N4#1416220",
      kind: "vocab" as const,
      headword: "週末",
      gloss: "weekend",
      easeFactor: 2.5,
      intervalDays: 1,
      dueDate: "2026-07-20",
    };
    expect(
      reviewQueue([
        { language: "ja", items: [item] },
        { language: "pl", items: [{ ...item, itemId: "A1#weekend" }] },
      ]).map(({ language, itemId }) => ({ language, itemId })),
    ).toEqual([
      { language: "ja", itemId: "N4#1416220" },
      { language: "pl", itemId: "A1#weekend" },
    ]);
  });
});
