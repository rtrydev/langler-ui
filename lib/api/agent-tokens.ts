import "client-only";

import { authorizedFetch } from "@/lib/api/authorized-fetch";

import type { AuthSession } from "@/lib/auth/cognito";
import {
  agentTokenInputSchema,
  type AgentTokenInput,
} from "@/lib/validation/agent-token";

export type AgentToken = {
  id: string;
  label: string;
  scopes: Array<"read-reference" | "import-lessons">;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
  lastUsed?: string;
  suffix: string;
  status: "active" | "expired" | "revoked";
};

export type AgentTokenError = {
  kind: "configuration" | "validation" | "network" | "response";
  message: string;
  status?: number;
};

export type AgentTokenListResult =
  | { ok: true; data: AgentToken[] }
  | { ok: false; error: AgentTokenError };

export type AgentTokenCreateResult =
  | { ok: true; data: { token: AgentToken; secret: string } }
  | { ok: false; error: AgentTokenError };

export type AgentTokenRevokeResult =
  | { ok: true }
  | { ok: false; error: AgentTokenError };

const missingConfig: AgentTokenError = {
  kind: "configuration",
  message: "Langler API is not configured.",
};

async function responseError(response: Response): Promise<AgentTokenError> {
  let message = `The Langler API returned ${response.status}.`;
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error) {
      message = body.error;
    }
  } catch {}
  return { kind: "response", message, status: response.status };
}

export async function listAgentTokens(
  session: AuthSession,
): Promise<AgentTokenListResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await authorizedFetch(session, `${apiUrl}/agent-tokens`);
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    const body = (await response.json()) as { items: AgentToken[] };
    return { ok: true, data: body.items };
  } catch {
    return {
      ok: false,
      error: { kind: "network", message: "The Langler API is unavailable." },
    };
  }
}

export async function createAgentToken(
  session: AuthSession,
  input: AgentTokenInput,
): Promise<AgentTokenCreateResult> {
  const parsed = agentTokenInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        kind: "validation",
        message: parsed.error.issues[0]?.message ?? "Check the token details.",
      },
    };
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  const expiresAt = new Date(
    Date.now() + parsed.data.expiryDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  try {
    const response = await authorizedFetch(session, `${apiUrl}/agent-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: parsed.data.label,
        scopes: parsed.data.scopes,
        expiresAt,
      }),
    });
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    return {
      ok: true,
      data: (await response.json()) as { token: AgentToken; secret: string },
    };
  } catch {
    return {
      ok: false,
      error: { kind: "network", message: "The Langler API is unavailable." },
    };
  }
}

export async function revokeAgentToken(
  session: AuthSession,
  id: string,
): Promise<AgentTokenRevokeResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await authorizedFetch(session, 
      `${apiUrl}/agent-tokens/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    );
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: { kind: "network", message: "The Langler API is unavailable." },
    };
  }
}
