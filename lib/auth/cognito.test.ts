import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearSession,
  completeNewPassword,
  confirmPasswordReset,
  requestPasswordReset,
  restoreSession,
  signIn,
} from "./cognito";

describe("Cognito authentication", () => {
  afterEach(() => {
    clearSession();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns the first-login password challenge", async () => {
    vi.stubEnv("NEXT_PUBLIC_AWS_REGION", "eu-central-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client-id");
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        Session: "challenge-session",
      })),
    );
    vi.stubGlobal("fetch", request);

    await expect(signIn("learner@example.com", "temporary")).resolves.toEqual({
      kind: "new-password-required",
      challenge: {
        email: "learner@example.com",
        session: "challenge-session",
      },
    });
    expect(request).toHaveBeenCalledWith(
      "https://cognito-idp.eu-central-1.amazonaws.com/",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("keeps tokens in memory after completing the password challenge", async () => {
    vi.stubEnv("NEXT_PUBLIC_AWS_REGION", "eu-central-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client-id");
    const claims = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    const accessToken = `header.${claims}.signature`;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        AuthenticationResult: {
          AccessToken: accessToken,
          IdToken: "id-token",
          RefreshToken: "refresh-token",
        },
      })),
    ));

    await expect(completeNewPassword({
      email: "learner@example.com",
      session: "challenge-session",
    }, "Permanent-password-1!")).resolves.toEqual({
      accessToken,
      idToken: "id-token",
      refreshToken: "refresh-token",
    });
    await expect(restoreSession()).resolves.toEqual({
      accessToken,
      idToken: "id-token",
      refreshToken: "refresh-token",
    });
  });

  it("restores an unexpired in-memory access token without a network request", async () => {
    const claims = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
    const session = {
      accessToken: `header.${claims}.signature`,
      idToken: "id-token",
      refreshToken: "refresh-token",
    };
    vi.stubEnv("NEXT_PUBLIC_AWS_REGION", "eu-central-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client-id");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ AuthenticationResult: {
        AccessToken: session.accessToken,
        IdToken: session.idToken,
        RefreshToken: session.refreshToken,
      } })),
    ));
    await signIn("learner@example.com", "password");
    const request = vi.fn();
    vi.stubGlobal("fetch", request);

    await expect(restoreSession()).resolves.toEqual(session);
    expect(request).not.toHaveBeenCalled();
  });

  it("rotates an expired in-memory refresh token", async () => {
    vi.stubEnv("NEXT_PUBLIC_AWS_REGION", "eu-central-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client-id");
    const request = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        AuthenticationResult: {
          AccessToken: "expired-access-token",
          IdToken: "id-token",
          RefreshToken: "refresh-token",
        },
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        AuthenticationResult: {
          AccessToken: "rotated-access-token",
          IdToken: "rotated-id-token",
          RefreshToken: "rotated-refresh-token",
        },
      })));
    vi.stubGlobal("fetch", request);

    await signIn("learner@example.com", "password");

    await expect(restoreSession()).resolves.toEqual({
      accessToken: "rotated-access-token",
      idToken: "rotated-id-token",
      refreshToken: "rotated-refresh-token",
    });
    expect(request).toHaveBeenNthCalledWith(
      2,
      "https://cognito-idp.eu-central-1.amazonaws.com/",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Amz-Target":
            "AWSCognitoIdentityProviderService.GetTokensFromRefreshToken",
        }),
      }),
    );
  });

  it("restores the session from cookies after a reload", async () => {
    vi.stubEnv("NEXT_PUBLIC_AWS_REGION", "eu-central-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client-id");
    const claims = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
    const session = {
      accessToken: `header.${claims}.signature`,
      idToken: "id-token",
      refreshToken: "refresh-token",
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ AuthenticationResult: {
        AccessToken: session.accessToken,
        IdToken: session.idToken,
        RefreshToken: session.refreshToken,
      } })),
    ));
    await signIn("learner@example.com", "password");

    vi.resetModules();
    const reloaded = await import("./cognito");
    const request = vi.fn();
    vi.stubGlobal("fetch", request);

    await expect(reloaded.restoreSession()).resolves.toEqual(session);
    expect(request).not.toHaveBeenCalled();
  });

  it("refreshes from the cookie refresh token when the access token expired", async () => {
    vi.stubEnv("NEXT_PUBLIC_AWS_REGION", "eu-central-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client-id");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ AuthenticationResult: {
        AccessToken: "expired-access-token",
        IdToken: "id-token",
        RefreshToken: "refresh-token",
      } })),
    ));
    await signIn("learner@example.com", "password");

    vi.resetModules();
    const reloaded = await import("./cognito");
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ AuthenticationResult: {
        AccessToken: "rotated-access-token",
        IdToken: "rotated-id-token",
        RefreshToken: "rotated-refresh-token",
      } })),
    );
    vi.stubGlobal("fetch", request);

    await expect(reloaded.restoreSession()).resolves.toEqual({
      accessToken: "rotated-access-token",
      idToken: "rotated-id-token",
      refreshToken: "rotated-refresh-token",
    });
    expect(request).toHaveBeenCalledWith(
      "https://cognito-idp.eu-central-1.amazonaws.com/",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Amz-Target":
            "AWSCognitoIdentityProviderService.GetTokensFromRefreshToken",
        }),
      }),
    );
    expect(document.cookie).toContain("langler_refresh=rotated-refresh-token");
  });

  it("does not restore a session after signing out", async () => {
    vi.stubEnv("NEXT_PUBLIC_AWS_REGION", "eu-central-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client-id");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ AuthenticationResult: {
        AccessToken: "access-token",
        IdToken: "id-token",
        RefreshToken: "refresh-token",
      } })),
    ));
    await signIn("learner@example.com", "password");
    clearSession();

    vi.resetModules();
    const reloaded = await import("./cognito");
    const request = vi.fn();
    vi.stubGlobal("fetch", request);

    await expect(reloaded.restoreSession()).resolves.toBeNull();
    expect(request).not.toHaveBeenCalled();
  });

  it("requests and confirms a password reset through Cognito", async () => {
    vi.stubEnv("NEXT_PUBLIC_AWS_REGION", "eu-central-1");
    vi.stubEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", "client-id");
    const request = vi
      .fn()
      .mockImplementation(async () => new Response(JSON.stringify({})));
    vi.stubGlobal("fetch", request);

    await requestPasswordReset("learner@example.com");
    await confirmPasswordReset(
      "learner@example.com",
      "123456",
      "Permanent-password-1!",
    );

    expect(request).toHaveBeenNthCalledWith(
      1,
      "https://cognito-idp.eu-central-1.amazonaws.com/",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Amz-Target": "AWSCognitoIdentityProviderService.ForgotPassword",
        }),
      }),
    );
    expect(request).toHaveBeenNthCalledWith(
      2,
      "https://cognito-idp.eu-central-1.amazonaws.com/",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Amz-Target":
            "AWSCognitoIdentityProviderService.ConfirmForgotPassword",
        }),
      }),
    );
  });
});
