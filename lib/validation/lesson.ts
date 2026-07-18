import { z } from "zod";

export const promptParamsSchema = z.object({
  language: z.enum(["ja", "my", "pl"]),
  level: z.string().min(1, "Pick a level."),
  topic: z.string().trim().max(120, "Keep the topic under 120 characters."),
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
