import { afterEach, describe, expect, it, vi } from "vitest";
import { currentAccessToken, refreshSession } from "@/lib/auth/cognito";
import { authorizedFetch } from "./authorized-fetch";

vi.mock("@/lib/auth/cognito", () => ({
  currentAccessToken: vi.fn(() => null),
  refreshSession: vi.fn(),
}));

const session = {
  accessToken: "stale-token",
  idToken: "id-token",
  refreshToken: "refresh-token",
};

describe("authorizedFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("sends the bearer token and passes non-401 responses through", async () => {
    const request = vi.fn().mockResolvedValue(new Response("ok"));
    vi.stubGlobal("fetch", request);

    const response = await authorizedFetch(session, "https://api.example.com/x");

    expect(await response.text()).toBe("ok");
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith("https://api.example.com/x", {
      headers: { Authorization: "Bearer stale-token" },
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("renews the session on 401 and retries once with the fresh token", async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response("ok"));
    vi.stubGlobal("fetch", request);
    vi.mocked(refreshSession).mockResolvedValue({
      ...session,
      accessToken: "fresh-token",
    });

    const response = await authorizedFetch(session, "https://api.example.com/x", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    expect(response.status).toBe(200);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenLastCalledWith("https://api.example.com/x", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fresh-token",
      },
      body: "{}",
    });
  });

  it("returns the original 401 when renewal is not possible", async () => {
    const request = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", request);
    vi.mocked(refreshSession).mockResolvedValue(null);

    const response = await authorizedFetch(session, "https://api.example.com/x");

    expect(response.status).toBe(401);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("prefers the freshest stored token over the captured session", async () => {
    const request = vi.fn().mockResolvedValue(new Response("ok"));
    vi.stubGlobal("fetch", request);
    vi.mocked(currentAccessToken).mockReturnValue("live-token");

    await authorizedFetch(session, "https://api.example.com/x");

    expect(request).toHaveBeenCalledWith("https://api.example.com/x", {
      headers: { Authorization: "Bearer live-token" },
    });
  });
});
