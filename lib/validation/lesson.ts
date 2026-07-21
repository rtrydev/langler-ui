import { z } from "zod";

export const promptParamsSchema = z.object({
  language: z.enum(["ja", "my", "pl"]),
  level: z.string().min(1, "Pick a level."),
  topic: z.string().trim().max(120, "Keep the topic under 120 characters."),
  topicSlug: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]{0,63}$/, "Pick a suggested topic again.")
    .optional(),
  exerciseTypes: z
    .array(z.string().min(1))
    .min(1, "Pick at least one exercise type."),
  readingStage: z.enum(["connected", "foundational"]),
  length: z.enum(["short", "standard", "long"]),
  includeReference: z.boolean(),
});

export type PromptParams = z.infer<typeof promptParamsSchema>;

export const lessonDocumentSchema = z.looseObject({
  schemaVersion: z.string({ error: 'The JSON is missing "schemaVersion".' }),
  lessonId: z.string({ error: 'The JSON is missing "lessonId".' }),
  language: z.string({ error: 'The JSON is missing "language".' }),
  level: z.string({ error: 'The JSON is missing "level".' }),
  title: z.string({ error: 'The JSON is missing "title".' }),
  readingStage: z.string({ error: 'The JSON is missing "readingStage".' }),
  exercises: z.array(z.looseObject({}), {
    error: 'The JSON is missing the "exercises" array.',
  }),
});

export type PasteCheck =
  | { ok: true; document: Record<string, unknown> }
  | { ok: false; issues: Array<{ path: string; message: string }> };

export function checkPastedLesson(raw: string): PasteCheck {
  const trimmed = stripCodeFences(raw.trim());
  if (trimmed === "") {
    return {
      ok: false,
      issues: [{ path: "$", message: "Paste the JSON your AI produced." }],
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (cause) {
    try {
      parsed = JSON.parse(repairTypographicJson(trimmed));
    } catch {
      const detail = cause instanceof Error ? cause.message : "unknown error";
      return {
        ok: false,
        issues: [
          {
            path: "$",
            message: `This is not valid JSON (${detail}). Ask your AI to return only the JSON object.`,
          },
        ],
      };
    }
  }

  const result = lessonDocumentSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      issues: result.error.issues.map((issue) => ({
        path: issue.path.length > 0 ? issue.path.join(".") : "$",
        message: issue.message,
      })),
    };
  }
  return { ok: true, document: result.data };
}

function stripCodeFences(raw: string): string {
  const fenced = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1] : raw;
}

// Some AI apps (notably the ChatGPT mobile app) render JSON with typographic
// quotes and non-breaking spaces that JSON.parse rejects, including unescaped
// curly quotes nested inside string values (story dialogue). Only tried after
// a straight parse fails, so well-formed JSON is never rewritten. A quote is
// treated as a string delimiter only where JSON structure allows one: any
// quote opens a string outside one, and a quote inside a string closes it
// only when the next non-whitespace character is ':', ',', '}', ']', or the
// end of input. All other typographic quotes remain string content, which
// JSON.parse accepts.
const typographicQuotes = new Set(['"', "\u201c", "\u201d", "\u201e", "\u201f", "\u2033"]);

function repairTypographicJson(raw: string): string {
  let out = "";
  let inString = false;
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (!inString) {
      if (typographicQuotes.has(char)) {
        inString = true;
        out += '"';
      } else {
        out += char === "\u00a0" ? " " : char;
      }
      continue;
    }
    if (char === "\\") {
      const next = raw[i + 1] ?? "";
      out += typographicQuotes.has(next) ? '\\"' : char + next;
      i++;
      continue;
    }
    if (typographicQuotes.has(char)) {
      if (closesString(raw, i + 1)) {
        inString = false;
        out += '"';
      } else {
        out += char === '"' ? '\\"' : char;
      }
      continue;
    }
    out += char;
  }
  return out;
}

function closesString(raw: string, from: number): boolean {
  for (let i = from; i < raw.length; i++) {
    const char = raw[i];
    if (char === " " || char === "\t" || char === "\n" || char === "\r" || char === "\u00a0") {
      continue;
    }
    return char === ":" || char === "," || char === "}" || char === "]";
  }
  return true;
}
