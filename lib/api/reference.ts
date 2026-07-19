import "client-only";

import type { AuthSession } from "@/lib/auth/cognito";

export type VocabEntry = {
  id: string;
  headword: string;
  reading: string;
  gloss: string[];
  pos: string[];
  level: string;
  levelApproximate?: boolean;
  freqBand?: number;
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

type ReferencePage<T> = {
  items: T[];
  nextCursor?: string;
};

async function referencePage<T>(
  session: AuthSession,
  path: string,
  params: URLSearchParams,
): Promise<{ ok: true; data: ReferencePage<T> } | { ok: false; message: string }> {
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
    const body = (await response.json()) as ReferencePage<T>;
    return { ok: true, data: body };
  } catch {
    return { ok: false, message: "Reference data is unavailable." };
  }
}

async function referenceCollection<T>(
  session: AuthSession,
  path: string,
  params: URLSearchParams,
): Promise<ReferenceResult<T>> {
  const items: T[] = [];
  const cursors = new Set<string>();
  let cursor = "";
  do {
    const pageParams = new URLSearchParams(params);
    if (cursor) pageParams.set("cursor", cursor);
    const result = await referencePage<T>(session, path, pageParams);
    if (!result.ok) return result;
    items.push(...result.data.items);
    cursor = result.data.nextCursor ?? "";
    if (cursor && cursors.has(cursor)) {
      return { ok: false, message: "Reference data pagination is invalid." };
    }
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return { ok: true, data: items };
}

export function listVocabulary(
  session: AuthSession,
  language: string,
  level: string,
): Promise<ReferenceResult<VocabEntry>> {
  return referenceCollection(session, "/reference/vocab", new URLSearchParams({
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
  return referenceCollection(session, "/reference/scripts", new URLSearchParams({
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
