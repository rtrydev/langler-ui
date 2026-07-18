import { z } from "zod";

export const agentTokenInputSchema = z.object({
  label: z.string().trim().min(1, "Enter a label.").max(80),
  scopes: z
    .array(z.enum(["read-reference", "import-lessons"]))
    .min(1, "Choose at least one scope."),
  expiryDays: z.union([z.literal(30), z.literal(90), z.literal(365)]),
});

export type AgentTokenInput = z.infer<typeof agentTokenInputSchema>;
