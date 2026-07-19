export type NgramAsset = {
  format: "myword-ngram/v1";
  unigram_count: number;
  unigram_total: number;
  bigram_count: number;
  bigram_total: number;
  unigram: Record<string, number>;
  bigram: Record<string, Record<string, number>>;
};

export type NgramModel = {
  unigram: ReadonlyMap<string, number>;
  bigram: ReadonlyMap<string, ReadonlyMap<string, number>>;
};

type Candidate = { score: number; tokens: string[] };

const TOTAL = 102490;

export function parseNgramModel(value: unknown): NgramModel {
  if (!isRecord(value) || value.format !== "myword-ngram/v1" || !isRecord(value.unigram) || !isRecord(value.bigram)) {
    throw new Error("Burmese segmentation data has an unsupported format.");
  }
  const unigram = new Map<string, number>();
  for (const [word, count] of Object.entries(value.unigram)) {
    if (typeof count !== "number") throw new Error("Burmese unigram data is invalid.");
    unigram.set(word, count);
  }
  const bigram = new Map<string, Map<string, number>>();
  for (const [previous, rawFollowing] of Object.entries(value.bigram)) {
    if (!isRecord(rawFollowing)) throw new Error("Burmese bigram data is invalid.");
    const following = new Map<string, number>();
    for (const [word, count] of Object.entries(rawFollowing)) {
      if (typeof count !== "number") throw new Error("Burmese bigram data is invalid.");
      following.set(word, count);
    }
    bigram.set(previous, following);
  }
  return { unigram, bigram };
}

export function segmentBurmese(model: NgramModel, value: string): string[] {
  const text = value.replaceAll(" ", "").trim();
  if (!text) return [];
  const characters = Array.from(text);
  const cache = new Map<string, Candidate>();

  function visit(start: number, previous: string): Candidate {
    if (start >= characters.length) return { score: 0, tokens: [] };
    const key = `${previous}\u0000${start}`;
    const cached = cache.get(key);
    if (cached) return cached;
    let best: Candidate | undefined;
    const limit = Math.min(characters.length - start, 20);
    for (let length = 1; length <= limit; length += 1) {
      const word = characters.slice(start, start + length).join("");
      const remainder = visit(start + length, word);
      const candidate = {
        score: Math.log10(probability(model, previous, word)) + remainder.score,
        tokens: [word, ...remainder.tokens],
      };
      if (!best || compare(candidate, best) > 0) best = candidate;
    }
    cache.set(key, best!);
    return best!;
  }

  return visit(0, "<S>").tokens;
}

export function refineSegments(tokens: string[], surfaces: string[]): string[] {
  const known = [...new Set(surfaces.filter(Boolean))].sort((left, right) => Array.from(right).length - Array.from(left).length);
  return tokens.flatMap((token) => {
    if (known.includes(token)) return [token];
    const pieces: string[] = [];
    let position = 0;
    while (position < token.length) {
      const match = known.find((surface) => token.startsWith(surface, position));
      if (match) {
        pieces.push(match);
        position += match.length;
        continue;
      }
      const character = Array.from(token.slice(position))[0];
      const last = pieces.at(-1);
      if (last && !known.includes(last)) pieces[pieces.length - 1] = last + character;
      else pieces.push(character);
      position += character.length;
    }
    return pieces;
  });
}

function probability(model: NgramModel, previous: string, current: string): number {
  const pair = model.bigram.get(previous)?.get(current);
  const previousCount = model.unigram.get(previous);
  if (pair !== undefined && previousCount) return pair / previousCount;
  const count = model.unigram.get(current);
  return count === undefined ? 10 / (TOTAL * 10 ** Array.from(current).length) : count / TOTAL;
}

function compare(left: Candidate, right: Candidate): number {
  if (left.score !== right.score) return left.score - right.score;
  const length = Math.min(left.tokens.length, right.tokens.length);
  for (let index = 0; index < length; index += 1) {
    const result = left.tokens[index].localeCompare(right.tokens[index]);
    if (result !== 0) return result;
  }
  return left.tokens.length - right.tokens.length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
