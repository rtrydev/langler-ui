import { afterEach, describe, expect, it, vi } from "vitest";
import type { AuthSession } from "@/lib/auth/cognito";
import { getGlossary } from "./glossary";

const session: AuthSession = {
  accessToken: "access-token",
  idToken: "id-token",
  refreshToken: "refresh-token",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("glossary API", () => {
  it("loads the authenticated glossary", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const languages = [
      {
        language: "ja",
        words: [
          {
            itemId: "N4#1416220",
            headword: "週末",
            reading: "しゅうまつ",
            gloss: ["weekend"],
            level: "N4",
            lessonCount: 2,
            addedAt: "2026-07-01T12:00:00Z",
          },
        ],
      },
    ];
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ languages }), { status: 200 }),
    );
    vi.stubGlobal("fetch", request);

    await expect(getGlossary(session)).resolves.toEqual({
      ok: true,
      data: languages,
    });
    expect(request).toHaveBeenCalledWith("https://api.example.com/glossary", {
      headers: { Authorization: "Bearer access-token" },
    });
  });

  it("filters the glossary by language", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ languages: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", request);

    await getGlossary(session, "ja");
    expect(request).toHaveBeenCalledWith(
      "https://api.example.com/glossary?language=ja",
      { headers: { Authorization: "Bearer access-token" } },
    );
  });

  it("surfaces API error messages", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "missing authenticated user" }), {
        status: 401,
      }),
    );
    vi.stubGlobal("fetch", request);

    await expect(getGlossary(session)).resolves.toEqual({
      ok: false,
      error: {
        kind: "response",
        message: "missing authenticated user",
        status: 401,
      },
    });
  });
});
