import { describe, expect, it } from "vitest";
import { Script } from "node:vm";
import { harnessAssets } from "./harness";

describe("harnessAssets", () => {
  it("grounds the connected-reading workflow and configures the machine API", () => {
    const assets = harnessAssets("https://machine.example.com");
    const skill = assets.find((asset) => asset.fileName === "SKILL.md")?.content;
    const openapi = assets.find((asset) => asset.fileName.endsWith(".yaml"))?.content;
    expect(skill).toContain("Default `readingStage` to `connected`");
    expect(skill).toContain("stated readiness makes connected reading impractical");
    expect(skill).toContain("comprehension questions");
    expect(openapi).toContain("https://machine.example.com");
    expect(openapi).toContain("Idempotency-Key");
  });

  it("keeps every MCP tool description below two kilobytes", () => {
    const server = harnessAssets("https://machine.example.com").find(
      (asset) => asset.fileName === "langler-mcp.mjs",
    )?.content;
    const descriptions = server?.match(/description:'[^']+'/g) ?? [];
    expect(descriptions).toHaveLength(4);
    expect(descriptions.every((description) => description.length < 2048)).toBe(true);
    expect(() => new Script(server?.replace(/^#!.*\n/, "") ?? "")).not.toThrow();
  });
});
