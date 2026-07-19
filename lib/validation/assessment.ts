import { z } from "zod";

export const assessmentStartSchema = z.object({
  language: z.enum(["ja", "my", "pl"]),
});

export type AssessmentStartInput = z.infer<typeof assessmentStartSchema>;

export const assessmentAnswersSchema = z.object({
  stageIndex: z.int().min(0),
  answers: z.array(z.int().min(0).max(7)).min(1).max(20),
});

export type AssessmentAnswersInput = z.infer<typeof assessmentAnswersSchema>;
