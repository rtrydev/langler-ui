import { afterEach, describe, expect, it, vi } from "vitest";
import type { AuthSession } from "@/lib/auth/cognito";
import {
  getAssessment,
  getProfileLevels,
  listAssessments,
  startAssessment,
  submitAssessmentAnswers,
  type AssessmentView,
} from "./assessments";

const session: AuthSession = {
  accessToken: "access-token",
  idToken: "id-token",
  refreshToken: "refresh-token",
};

const view: AssessmentView = {
  assessmentId: "a-1",
  language: "ja",
  status: "in_progress",
  guidance: "Estimates are approximate guidance.",
  startedAt: "2026-07-19T10:00:00Z",
  stage: {
    index: 0,
    band: "N5",
    bandCount: 5,
    items: [
      { kind: "vocab", prompt: "犬", options: ["dog", "cat", "bird", "fish"] },
    ],
  },
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("assessments API", () => {
  it("starts a placement test for a supported language", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(view), { status: 201 }));
    vi.stubGlobal("fetch", request);

    await expect(startAssessment(session, { language: "ja" })).resolves.toEqual(
      { ok: true, data: view },
    );
    expect(request).toHaveBeenCalledWith("https://api.example.com/assessments", {
      method: "POST",
      headers: {
        Authorization: "Bearer access-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language: "ja" }),
    });
  });

  it("rejects an unsupported language before calling the API", async () => {
    const request = vi.fn();
    vi.stubGlobal("fetch", request);

    const result = await startAssessment(session, {
      language: "xx" as "ja",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("validation");
    }
    expect(request).not.toHaveBeenCalled();
  });

  it("submits validated stage answers", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(view), { status: 200 }));
    vi.stubGlobal("fetch", request);

    await expect(
      submitAssessmentAnswers(session, "a-1", {
        stageIndex: 0,
        answers: [0, 3, 1],
      }),
    ).resolves.toEqual({ ok: true, data: view });
    expect(request).toHaveBeenCalledWith(
      "https://api.example.com/assessments/a-1/answers",
      expect.objectContaining({ method: "POST" }),
    );
    expect(JSON.parse(String(request.mock.calls[0]?.[1]?.body))).toEqual({
      stageIndex: 0,
      answers: [0, 3, 1],
    });
  });

  it("rejects an empty answer list before calling the API", async () => {
    const request = vi.fn();
    vi.stubGlobal("fetch", request);

    const result = await submitAssessmentAnswers(session, "a-1", {
      stageIndex: 0,
      answers: [],
    });
    expect(result.ok).toBe(false);
    expect(request).not.toHaveBeenCalled();
  });

  it("loads a stored assessment", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(view), { status: 200 }));
    vi.stubGlobal("fetch", request);

    await expect(getAssessment(session, "a-1")).resolves.toEqual({
      ok: true,
      data: view,
    });
    expect(request).toHaveBeenCalledWith(
      "https://api.example.com/assessments/a-1",
      { headers: { Authorization: "Bearer access-token" } },
    );
  });

  it("lists assessment history with guidance framing", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ items: [], guidance: "Approximate guidance." }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", request);

    await expect(listAssessments(session)).resolves.toEqual({
      ok: true,
      data: [],
      guidance: "Approximate guidance.",
    });
  });

  it("loads profile level defaults", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const levels = [
      {
        language: "ja",
        level: "N3",
        assessmentId: "a-1",
        updatedAt: "2026-07-19T10:12:00Z",
      },
    ];
    const request = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ levels }), { status: 200 }),
      );
    vi.stubGlobal("fetch", request);

    await expect(getProfileLevels(session)).resolves.toEqual({
      ok: true,
      data: levels,
    });
    expect(request).toHaveBeenCalledWith(
      "https://api.example.com/profile/levels",
      { headers: { Authorization: "Bearer access-token" } },
    );
  });

  it("surfaces API error messages", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ error: "placement tests are not available for this language yet" }),
        { status: 400 },
      ),
    );
    vi.stubGlobal("fetch", request);

    const result = await startAssessment(session, { language: "pl" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({
        kind: "response",
        message: "placement tests are not available for this language yet",
        status: 400,
      });
    }
  });
});
