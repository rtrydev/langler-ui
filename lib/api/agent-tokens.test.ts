import { afterEach, describe, expect, it, vi } from "vitest";
import type { AuthSession } from "@/lib/auth/cognito";
import {
  createAgentToken,
  listAgentTokens,
  revokeAgentToken,
} from "./agent-tokens";

const session: AuthSession = {
  accessToken: "access-token",
  idToken: "id-token",
  refreshToken: "refresh-token",
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("agent token API", () => {
  it("lists tokens with the Cognito access token", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(listAgentTokens(session)).resolves.toEqual({ ok: true, data: [] });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/agent-tokens",
      { headers: { Authorization: "Bearer access-token" } },
    );
  });

  it("creates a validated expiring token", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-07-18T12:00:00Z").valueOf());
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ token: { id: "token-1" }, secret: "lang_sk_secret" }), { status: 201 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const result = await createAgentToken(session, {
      label: "Claude Code",
      scopes: ["read-reference", "import-lessons"],
      expiryDays: 30,
    });
    expect(result.ok).toBe(true);
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(request.headers).toEqual({
      Authorization: "Bearer access-token",
      "Content-Type": "application/json",
    });
    expect(JSON.parse(String(request.body))).toEqual({
      label: "Claude Code",
      scopes: ["read-reference", "import-lessons"],
      expiresAt: "2026-08-17T12:00:00.000Z",
    });
  });

  it("revokes only the selected token", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(revokeAgentToken(session, "token/1")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/agent-tokens/token%2F1",
      { method: "DELETE", headers: { Authorization: "Bearer access-token" } },
    );
  });
});
