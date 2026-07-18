import { describe, expect, it } from "vitest";
import { studyDate } from "./study-date";

describe("studyDate", () => {
  it("formats the browser-local calendar date", () => {
    expect(studyDate(new Date(2026, 6, 9, 23, 30))).toBe("2026-07-09");
  });
});
