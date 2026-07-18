import { z } from "zod";

export const reviewGradeSchema = z.object({
  language: z.enum(["ja", "my", "pl"]),
  kind: z.enum(["vocab", "grammar"]),
  itemId: z.string().trim().min(1).max(80),
  grade: z.enum(["again", "hard", "good", "easy"]),
});

export type ReviewGradeInput = z.infer<typeof reviewGradeSchema>;
