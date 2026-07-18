import { afterEach, describe, expect, it, vi } from "vitest";
import type { AuthSession } from "@/lib/auth/cognito";
import { getDueReviews, getProgressSummary, gradeReview } from "./progress";

const session: AuthSession = {
  accessToken: "access-token",
  idToken: "id-token",
  refreshToken: "refresh-token",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("progress API", () => {
  it("loads the authenticated progress summary", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ languages: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", request);

    await expect(getProgressSummary(session)).resolves.toEqual({
      ok: true,
      data: [],
    });
    expect(request).toHaveBeenCalledWith("https://api.example.com/progress", {
      headers: { Authorization: "Bearer access-token" },
    });
  });

  it("filters the due queue by language", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ languages: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", request);

    await getDueReviews(session, "ja");
    expect(request).toHaveBeenCalledWith(
      "https://api.example.com/reviews/due?language=ja",
      { headers: { Authorization: "Bearer access-token" } },
    );
  });

  it("submits a validated self-grade", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const item = {
      itemId: "N4#1416220",
      kind: "vocab",
      headword: "週末",
      gloss: "weekend",
      easeFactor: 2.5,
      intervalDays: 1,
      dueDate: "2026-07-20",
    };
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(item), { status: 200 }),
    );
    vi.stubGlobal("fetch", request);

    await expect(
      gradeReview(session, {
        language: "ja",
        kind: "vocab",
        itemId: item.itemId,
        grade: "good",
      }),
    ).resolves.toEqual({ ok: true, data: item });
    expect(JSON.parse(String(request.mock.calls[0]?.[1]?.body))).toEqual({
      language: "ja",
      kind: "vocab",
      itemId: item.itemId,
      grade: "good",
    });
  });
});
