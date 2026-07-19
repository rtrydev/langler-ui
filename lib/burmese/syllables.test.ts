import { describe, expect, it } from "vitest";
import { segmentBurmeseSyllables } from "@/lib/burmese/syllables";

describe("segmentBurmeseSyllables", () => {
  it("keeps medials, vowels, and final consonants attached", () => {
    expect(segmentBurmeseSyllables("ကျောင်းသား")).toEqual(["ကျောင်း", "သား"]);
  });

  it("keeps virama stacks together", () => {
    expect(segmentBurmeseSyllables("အက္ခရာ")).toEqual(["အ", "က္ခ", "ရာ"]);
  });
});
