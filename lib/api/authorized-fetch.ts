import "client-only";

import {
  type AuthSession,
  currentAccessToken,
  refreshSession,
} from "@/lib/auth/cognito";

// Bearer-authenticated fetch with automatic session renewal: a 401 triggers
// one refresh-token exchange (shared across concurrent requests) and a single
// retry with the fresh access token. If renewal is impossible or fails, the
// original 401 response is returned so callers surface their usual error.
// Prefers the module-level current session over the (possibly stale) session
// captured by the calling component.
export async function authorizedFetch(
  session: AuthSession,
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const send = (token: string) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
      },
    });

  const response = await send(currentAccessToken() ?? session.accessToken);
  if (response.status !== 401) {
    return response;
  }

  const renewed = await refreshSession();
  if (!renewed) {
    return response;
  }
  return send(renewed.accessToken);
}
