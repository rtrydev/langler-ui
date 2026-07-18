import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deleteLesson,
  generateLessonPrompt,
  importLesson,
  listLessons,
} from "@/lib/api/lessons";
import type { AuthSession } from "@/lib/auth/cognito";

const session: AuthSession = {
  accessToken: "access-token",
  idToken: "id-token",
  refreshToken: "refresh-token",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("generateLessonPrompt", () => {
  it("posts the parameters with the Cognito token", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ prompt: "do it" })));
    vi.stubGlobal("fetch", request);

    const result = await generateLessonPrompt(session, {
      language: "ja",
      level: "N4",
      topic: "Travel",
      exerciseTypes: ["cloze"],
      readingStage: "connected",
      length: "standard",
      includeReference: true,
    });

    expect(result).toEqual({ ok: true, prompt: "do it" });
    expect(request).toHaveBeenCalledWith(
      "https://api.example.com/lessons/prompt",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      }),
    );
  });

  it("returns a configuration error without an API URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    const result = await generateLessonPrompt(session, {
      language: "ja",
      level: "N4",
      topic: "",
      exerciseTypes: ["cloze"],
      readingStage: "connected",
      length: "standard",
      includeReference: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("configuration");
    }
  });
});

describe("importLesson", () => {
  it("surfaces validation issues from a 400 response", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "lesson validation failed",
          issues: [
            { path: "exercises[0].type", message: "unknown exercise type" },
          ],
        }),
        { status: 400 },
      ),
    );
    vi.stubGlobal("fetch", request);

    const result = await importLesson(session, { schemaVersion: "1.0" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.status).toBe(400);
      expect(result.issues).toEqual([
        { path: "exercises[0].type", message: "unknown exercise type" },
      ]);
    }
  });

  it("returns the import summary on success", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const summary = {
      lessonId: "3e2d5f6a-9d0b-4c1e-8a7f-2b6c9d3e1f00",
      title: "Weekend plans in Kyoto",
      language: "ja",
      level: "N4",
      readingStage: "connected",
      exerciseCount: 2,
      totalPoints: 20,
      vocabRefCount: 3,
      createdAt: "2026-07-18T12:00:00Z",
      created: true,
    };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(summary), { status: 201 }),
        ),
    );

    const result = await importLesson(session, { schemaVersion: "1.0" });
    expect(result).toEqual({ ok: true, data: summary });
  });

  it("maps a network failure to a typed error", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await importLesson(session, {});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("network");
    }
  });
});

describe("listLessons", () => {
  it("fetches the library with the Cognito token", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ items: [] })));
    vi.stubGlobal("fetch", request);

    const result = await listLessons(session);
    expect(result).toEqual({ ok: true, data: { items: [] } });
    expect(request).toHaveBeenCalledWith("https://api.example.com/lessons", {
      headers: { Authorization: "Bearer access-token" },
    });
  });
});

describe("deleteLesson", () => {
  it("issues a DELETE for the lesson id", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", request);

    const result = await deleteLesson(session, "abc");
    expect(result).toEqual({ ok: true });
    expect(request).toHaveBeenCalledWith(
      "https://api.example.com/lessons/abc",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
