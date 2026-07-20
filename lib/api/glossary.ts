import "client-only";

import type { AuthSession } from "@/lib/auth/cognito";

export type GlossaryApiError = {
  kind: "configuration" | "network" | "response";
  message: string;
  status?: number;
};

export type GlossaryWord = {
  itemId: string;
  headword: string;
  reading?: string;
  gloss: string[];
  level?: string;
  lessonCount: number;
  addedAt: string;
};

export type GlossaryLanguage = {
  language: string;
  words: GlossaryWord[];
};

export type GlossaryResult =
  | { ok: true; data: GlossaryLanguage[] }
  | { ok: false; error: GlossaryApiError };

const missingConfig: GlossaryApiError = {
  kind: "configuration",
  message: "Langler API is not configured.",
};

const unavailable: GlossaryApiError = {
  kind: "network",
  message: "The Langler API is unavailable.",
};

async function responseError(response: Response): Promise<GlossaryApiError> {
  let message = `The Langler API returned ${response.status}.`;
  const body = (await response
    .json()
    .catch(() => null)) as { error?: string } | null;
  if (body?.error) {
    message = body.error;
  }
  return { kind: "response", message, status: response.status };
}

export async function getGlossary(
  session: AuthSession,
  language?: string,
): Promise<GlossaryResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  const query = new URLSearchParams();
  if (language) query.set("language", language);
  const suffix = query.size > 0 ? `?${query}` : "";
  try {
    const response = await fetch(`${apiUrl}/glossary${suffix}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    const body = (await response.json()) as { languages: GlossaryLanguage[] };
    return { ok: true, data: body.languages };
  } catch {
    return { ok: false, error: unavailable };
  }
}
