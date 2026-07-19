import "client-only";

import {
  clearSessionCookies,
  readSessionCookies,
  writeSessionCookies,
} from "./session-cookies";

export type AuthSession = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
};

export type PasswordChallenge = {
  email: string;
  session: string;
};

export type SignInResult =
  | { kind: "authenticated"; session: AuthSession }
  | { kind: "new-password-required"; challenge: PasswordChallenge };

type CognitoAuthenticationResult = {
  AccessToken?: string;
  IdToken?: string;
  RefreshToken?: string;
};

type CognitoResponse = {
  AuthenticationResult?: CognitoAuthenticationResult;
  ChallengeName?: string;
  Session?: string;
};

type TokenClaims = {
  exp?: number;
};

let currentSession: AuthSession | null = null;

function configuration() {
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

  if (!region || !clientId) {
    throw new Error("Langler authentication is not configured.");
  }

  return {
    clientId,
    endpoint: `https://cognito-idp.${region}.amazonaws.com/`,
  };
}

async function cognitoRequest(
  operation:
    | "InitiateAuth"
    | "RespondToAuthChallenge"
    | "ForgotPassword"
    | "ConfirmForgotPassword"
    | "GetTokensFromRefreshToken",
  body: Record<string, unknown>,
) {
  const { endpoint } = configuration();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": `AWSCognitoIdentityProviderService.${operation}`,
    },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as CognitoResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message ?? "Cognito rejected the request.");
  }

  return payload;
}

function authSession(
  result: CognitoAuthenticationResult | undefined,
  existingRefreshToken = "",
): AuthSession {
  if (!result?.AccessToken || !result.IdToken) {
    throw new Error("Cognito returned an incomplete authentication result.");
  }

  return {
    accessToken: result.AccessToken,
    idToken: result.IdToken,
    refreshToken: result.RefreshToken ?? existingRefreshToken,
  };
}

function saveSession(session: AuthSession) {
  currentSession = session;
  writeSessionCookies(session);
}

function tokenExpiresSoon(token: string) {
  try {
    const encodedClaims = token
      .split(".")[1]
      .replaceAll("-", "+")
      .replaceAll("_", "/");
    const paddedClaims = encodedClaims.padEnd(
      Math.ceil(encodedClaims.length / 4) * 4,
      "=",
    );
    const claims = JSON.parse(atob(paddedClaims)) as TokenClaims;
    return !claims.exp || claims.exp * 1000 <= Date.now() + 60_000;
  } catch {
    return true;
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  const { clientId } = configuration();
  const payload = await cognitoRequest("InitiateAuth", {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  if (payload.ChallengeName === "NEW_PASSWORD_REQUIRED" && payload.Session) {
    return {
      kind: "new-password-required",
      challenge: { email, session: payload.Session },
    };
  }

  const session = authSession(payload.AuthenticationResult);
  saveSession(session);
  return { kind: "authenticated", session };
}

export async function completeNewPassword(
  challenge: PasswordChallenge,
  newPassword: string,
) {
  const { clientId } = configuration();
  const payload = await cognitoRequest("RespondToAuthChallenge", {
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    ClientId: clientId,
    Session: challenge.session,
    ChallengeResponses: {
      USERNAME: challenge.email,
      NEW_PASSWORD: newPassword,
    },
  });
  const session = authSession(payload.AuthenticationResult);
  saveSession(session);
  return session;
}

export async function requestPasswordReset(email: string) {
  const { clientId } = configuration();
  await cognitoRequest("ForgotPassword", {
    ClientId: clientId,
    Username: email,
  });
}

export async function confirmPasswordReset(
  email: string,
  code: string,
  password: string,
) {
  const { clientId } = configuration();
  await cognitoRequest("ConfirmForgotPassword", {
    ClientId: clientId,
    Username: email,
    ConfirmationCode: code,
    Password: password,
  });
}

export async function restoreSession() {
  const session = currentSession ?? readSessionCookies();
  if (!session) {
    return null;
  }

  try {
    if (!tokenExpiresSoon(session.accessToken)) {
      currentSession = session;
      return session;
    }
    if (!session.refreshToken) {
      clearSession();
      return null;
    }

    const { clientId } = configuration();
    const payload = await cognitoRequest("GetTokensFromRefreshToken", {
      ClientId: clientId,
      RefreshToken: session.refreshToken,
    });
    const refreshed = authSession(
      payload.AuthenticationResult,
      session.refreshToken,
    );
    saveSession(refreshed);
    return refreshed;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  currentSession = null;
  clearSessionCookies();
}
