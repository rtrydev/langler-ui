import { DownloadLink } from "langler-ui";

export const Basic = () => (
  <DownloadLink content="# Langler skill" fileName="SKILL.md" mediaType="text/markdown">
    ↓ SKILL.md
  </DownloadLink>
);

export const HarnessAssets = () => (
  <div className="flex flex-wrap gap-2">
    <DownloadLink content="# Langler skill" fileName="SKILL.md" mediaType="text/markdown">
      ↓ SKILL.md
    </DownloadLink>
    <DownloadLink
      content="openapi: 3.1.0"
      fileName="langler-openapi.yaml"
      mediaType="application/yaml"
    >
      ↓ langler-openapi.yaml
    </DownloadLink>
    <DownloadLink
      content="#!/usr/bin/env node"
      fileName="langler-mcp.mjs"
      mediaType="text/javascript"
    >
      ↓ langler-mcp.mjs
    </DownloadLink>
  </div>
);
