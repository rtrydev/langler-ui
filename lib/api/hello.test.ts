import { afterEach, describe, expect, it, vi } from "vitest";
import { getHello } from "./hello";

describe("getHello", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends the Cognito token to the typed endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        message: "Hello from Langler",
        service: "langler-backend",
        stage: "prod",
      })),
    );
    vi.stubGlobal("fetch", request);

    await expect(getHello({
      accessToken: "access-token",
      idToken: "id-token",
      refreshToken: "refresh-token",
    })).resolves.toEqual({
      message: "Hello from Langler",
      service: "langler-backend",
      stage: "prod",
    });
    expect(request).toHaveBeenCalledWith("https://api.example.com/hello", {
      headers: { Authorization: "Bearer access-token" },
    });
  });
});
