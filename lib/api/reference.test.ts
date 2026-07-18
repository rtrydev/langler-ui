import { afterEach, describe, expect, it, vi } from "vitest";
import { listVocabulary } from "@/lib/api/reference";
import type { AuthSession } from "@/lib/auth/cognito";

vi.mock("client-only", () => ({}));

const session: AuthSession = {
  accessToken: "access-token",
  idToken: "id-token",
  refreshToken: "refresh-token",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("listVocabulary", () => {
  it("collects every reference page", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        items: [{ id: "N5#1", headword: "一", reading: "いち", gloss: ["one"], pos: ["num"], level: "N5" }],
        nextCursor: "next page",
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        items: [{ id: "N5#2", headword: "二", reading: "に", gloss: ["two"], pos: ["num"], level: "N5" }],
      })));
    vi.stubGlobal("fetch", request);

    const result = await listVocabulary(session, "ja", "N5");

    expect(result).toEqual({
      ok: true,
      data: [
        { id: "N5#1", headword: "一", reading: "いち", gloss: ["one"], pos: ["num"], level: "N5" },
        { id: "N5#2", headword: "二", reading: "に", gloss: ["two"], pos: ["num"], level: "N5" },
      ],
    });
    expect(request).toHaveBeenNthCalledWith(2, "https://api.example.com/reference/vocab?lang=ja&level=N5&limit=200&cursor=next+page", {
      headers: { Authorization: "Bearer access-token" },
    });
  });

  it("rejects a repeated pagination cursor", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ items: [], nextCursor: "same" })))));

    const result = await listVocabulary(session, "ja", "N5");

    expect(result).toEqual({ ok: false, message: "Reference data pagination is invalid." });
  });
});
