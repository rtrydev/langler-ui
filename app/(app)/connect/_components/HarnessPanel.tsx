"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { DownloadLink } from "@/components/ui/DownloadLink";
import { Tabs } from "@/components/ui/Tabs";
import type { HarnessAsset } from "@/lib/harness";

const guides = {
  claude: {
    command: `mkdir -p .claude/skills/langler
mv ~/Downloads/SKILL.md .claude/skills/langler/SKILL.md
export LANGLER_TOKEN="lang_sk_…"`,
    text: "Install the skill in your project or personal skills directory, set the token in the agent environment, then ask Claude Code to create and import a Langler lesson.",
  },
  openapi: {
    command: `LANGLER_TOKEN="lang_sk_…"
# Import langler-openapi.yaml in your OpenAPI-aware agent
# Configure LANGLER_TOKEN as its Bearer credential`,
    text: "Import the OpenAPI 3.1 file and configure the generated Bearer security field with your token. Keep SKILL.md alongside the agent's instructions for the composition quality bar.",
  },
  mcp: {
    command: `mv ~/Downloads/langler-mcp.mjs /absolute/path/to/langler-mcp.mjs
# Update that absolute path in mcp.json
# Merge mcp.json into your agent's MCP configuration`,
    text: "The optional dependency-free MCP server wraps the same four endpoints. Keep LANGLER_TOKEN in the MCP process environment rather than writing the secret into a shared file.",
  },
};

export function HarnessPanel({ assets }: { assets: HarnessAsset[] }) {
  const [framework, setFramework] = useState<keyof typeof guides>("claude");
  const guide = guides[framework];
  return (
    <div>
      <Tabs
        activeValue={framework}
        items={[
          { value: "claude", label: "Claude Code" },
          { value: "openapi", label: "OpenAPI" },
          { value: "mcp", label: "MCP" },
        ]}
        onSelect={(value) => setFramework(value as keyof typeof guides)}
      />
      <p className="my-4 text-[13px] leading-relaxed text-ink-2">{guide.text}</p>
      <CodeBlock>{guide.command}</CodeBlock>
      <div className="mt-4 flex flex-wrap gap-2">
        {assets.map((asset) => (
          <DownloadLink
            content={asset.content}
            fileName={asset.fileName}
            key={asset.fileName}
            mediaType={asset.mediaType}
          >
            ↓ {asset.label}
          </DownloadLink>
        ))}
      </div>
    </div>
  );
}
