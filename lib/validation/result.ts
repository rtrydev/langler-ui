import { z } from "zod";

export const lessonResultSchema = z.object({
  attemptId: z.uuid(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime(),
  score: z.number().int().nonnegative(),
  maxScore: z.number().int().nonnegative(),
  autoScore: z.number().int().nonnegative(),
  autoMax: z.number().int().nonnegative(),
  selfScore: z.number().int().nonnegative(),
  selfMax: z.number().int().nonnegative(),
  exercises: z.array(z.object({
    exerciseId: z.string().min(1),
    type: z.string().min(1),
    grading: z.enum(["auto", "self"]),
    score: z.number().int().nonnegative(),
    maxScore: z.number().int().nonnegative(),
    correct: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  })).min(1),
});
