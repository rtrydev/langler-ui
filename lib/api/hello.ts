import "client-only";

import type { AuthSession } from "@/lib/auth/cognito";

export type HelloResponse = {
  message: string;
  service: string;
  stage: string;
};

export async function getHello(
  session: AuthSession,
): Promise<HelloResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("Langler API is not configured.");
  }

  const response = await fetch(`${apiUrl}/hello`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`The Langler API returned ${response.status}.`);
  }

  return (await response.json()) as HelloResponse;
}
