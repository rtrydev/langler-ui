import "client-only";

import type { AuthSession } from "@/lib/auth/cognito";

export type VocabEntry = {
  id: string;
  headword: string;
  reading: string;
  gloss: string[];
  pos: string[];
  level: string;
};

export type ScriptGlyph = {
  glyph: string;
  name: string;
  meanings?: string[];
  readings: Record<string, string[]>;
  strokeCount?: number;
  strokeDataRef?: string;
};

export type ReferenceResult<T> =
  | { ok: true; data: T[] }
  | { ok: false; message: string };

async function referencePage<T>(
  session: AuthSession,
  path: string,
  params: URLSearchParams,
): Promise<ReferenceResult<T>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, message: "Langler API is not configured." };
  }
  try {
    const response = await fetch(`${apiUrl}${path}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (!response.ok) {
      return { ok: false, message: `Reference data returned ${response.status}.` };
    }
    const body = (await response.json()) as { items: T[] };
    return { ok: true, data: body.items };
  } catch {
    return { ok: false, message: "Reference data is unavailable." };
  }
}

export function listVocabulary(
  session: AuthSession,
  language: string,
  level: string,
): Promise<ReferenceResult<VocabEntry>> {
  return referencePage(session, "/reference/vocab", new URLSearchParams({
    lang: language,
    level,
    limit: "200",
  }));
}

export function listScriptGlyphs(
  session: AuthSession,
  language: string,
  level: string,
): Promise<ReferenceResult<ScriptGlyph>> {
  return referencePage(session, "/reference/scripts", new URLSearchParams({
    lang: language,
    type: "kanji",
    level,
    limit: "200",
  }));
}

export function strokeAssetUrl(reference: string): string | undefined {
  const base = process.env.NEXT_PUBLIC_REFERENCE_ASSETS_URL;
  return base ? `${base.replace(/\/$/, "")}/${reference}` : undefined;
}

export function kanjiVGReference(glyph: string): string | undefined {
  const codePoint = glyph.codePointAt(0);
  return codePoint === undefined
    ? undefined
    : `kanjivg/${codePoint.toString(16).padStart(5, "0")}.svg`;
}
