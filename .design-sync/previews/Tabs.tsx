import { Tabs } from "langler-ui";

export const LessonSections = () => (
  <div className="w-96">
    <Tabs
      activeValue="story"
      items={[
        { value: "story", label: "Story", href: "#story" },
        { value: "vocabulary", label: "Vocabulary", href: "#vocabulary" },
        { value: "grammar", label: "Grammar", href: "#grammar" },
        { value: "exercises", label: "Exercises", href: "#exercises" },
      ]}
    />
  </div>
);

export const HarnessGuides = () => (
  <div className="w-96">
    <Tabs
      activeValue="claude"
      items={[
        { value: "claude", label: "Claude Code", href: "#claude" },
        { value: "openapi", label: "OpenAPI", href: "#openapi" },
        { value: "mcp", label: "MCP", href: "#mcp" },
      ]}
    />
  </div>
);
