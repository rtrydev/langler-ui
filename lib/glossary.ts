export type Annotation = { surface: string; reading?: string; gloss?: string };
export type GlossaryEntry = { surface: string; reading?: string; gloss: string };

/**
 * The vocabulary glossary for a reading passage: the lesson's target-word
 * annotations, deduped by surface and limited to entries that carry a gloss
 * (a reading-only entry has no meaning to teach). Order is preserved.
 */
export function glossaryEntries(annotations: Annotation[] = []): GlossaryEntry[] {
  const seen = new Set<string>();
  const entries: GlossaryEntry[] = [];
  for (const item of annotations) {
    if (!item.surface || !item.gloss || seen.has(item.surface)) continue;
    seen.add(item.surface);
    entries.push({ surface: item.surface, reading: item.reading, gloss: item.gloss });
  }
  return entries;
}
