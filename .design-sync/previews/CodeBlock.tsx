import { CodeBlock, CopyButton } from "langler-ui";

export const Basic = () => (
  <div className="w-96">
    <CodeBlock>{`mkdir -p .claude/skills/langler
mv ~/Downloads/SKILL.md .claude/skills/langler/SKILL.md
export LANGLER_TOKEN="lang_sk_…"`}</CodeBlock>
  </div>
);

export const WithHeaderActions = () => (
  <div className="w-96">
    <CodeBlock
      actions={
        <CopyButton size="sm" text="Create a beginner Japanese lesson" variant="accent">
          Copy prompt
        </CopyButton>
      }
      title="lesson-prompt.md"
    >{`Create a beginner Japanese lesson about ordering
food at a ramen shop. Introduce 8 vocabulary items,
then a short dialogue, then cloze exercises.`}</CodeBlock>
  </div>
);

export const Scrollable = () => (
  <div className="w-96">
    <CodeBlock preClassName="max-h-28" title="langler-mcp.mjs">{`LANGLER_TOKEN="lang_sk_…"
# Import langler-openapi.yaml in your OpenAPI-aware agent
# Configure LANGLER_TOKEN as its Bearer credential
mv ~/Downloads/langler-mcp.mjs /absolute/path/to/langler-mcp.mjs
# Update that absolute path in mcp.json
# Merge mcp.json into your agent's MCP configuration`}</CodeBlock>
  </div>
);
