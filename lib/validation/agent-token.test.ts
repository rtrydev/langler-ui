import { describe, expect, it } from "vitest";
import { agentTokenInputSchema } from "./agent-token";

describe("agentTokenInputSchema", () => {
  it("accepts a labelled token with both machine scopes", () => {
    expect(
      agentTokenInputSchema.safeParse({
        label: "Claude Code",
        scopes: ["read-reference", "import-lessons"],
        expiryDays: 90,
      }).success,
    ).toBe(true);
  });

  it("rejects empty scopes and unsupported expiry values", () => {
    expect(
      agentTokenInputSchema.safeParse({
        label: "Agent",
        scopes: [],
        expiryDays: 7,
      }).success,
    ).toBe(false);
  });
});
