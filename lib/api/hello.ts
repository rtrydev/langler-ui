import "client-only";

import { authorizedFetch } from "@/lib/api/authorized-fetch";

import type { AuthSession } from "@/lib/auth/cognito";

export type HelloResponse = {
  message: string;
  service: string;
  stage: string;
};

export type HelloResult =
  | { ok: true; data: HelloResponse }
  | {
      ok: false;
      error: {
        kind: "configuration" | "network" | "response";
        message: string;
        status?: number;
      };
    };

export async function getHello(
  session: AuthSession,
): Promise<HelloResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return {
      ok: false,
      error: {
        kind: "configuration",
        message: "Langler API is not configured.",
      },
    };
  }

  try {
    const response = await authorizedFetch(session, `${apiUrl}/hello`);

    if (!response.ok) {
      return {
        ok: false,
        error: {
          kind: "response",
          message: `The Langler API returned ${response.status}.`,
          status: response.status,
        },
      };
    }

    return { ok: true, data: (await response.json()) as HelloResponse };
  } catch {
    return {
      ok: false,
      error: {
        kind: "network",
        message: "The Langler API is unavailable.",
      },
    };
  }
}
