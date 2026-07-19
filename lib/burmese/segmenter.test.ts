import { describe, expect, it } from "vitest";
import { parseNgramModel, refineSegments, segmentBurmese } from "@/lib/burmese/segmenter";

describe("Burmese segmentation", () => {
  it("uses the corrected bigram lookup", () => {
    const model = parseNgramModel({
      format: "myword-ngram/v1",
      unigram: { မြန်မာ: 100, စာ: 90, မြန်မာစာ: 2 },
      bigram: { မြန်မာ: { စာ: 80 } },
    });
    expect(segmentBurmese(model, "မြန်မာစာ")).toEqual(["မြန်မာ", "စာ"]);
  });

  it("refines a segment around known dictionary surfaces", () => {
    expect(refineSegments(["ကျောင်းသွား"], ["ကျောင်း", "သွား"])).toEqual(["ကျောင်း", "သွား"]);
  });

  it("rejects malformed assets", () => {
    expect(() => parseNgramModel({ format: "wrong" })).toThrow(/unsupported format/);
  });
});
