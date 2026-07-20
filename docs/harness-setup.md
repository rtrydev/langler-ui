# Agent harness setup guide

How a Langler user connects their own AI agent so it can query reference
data and import lessons directly — no copy-paste. This is a standalone
reference for the workflow the in-app `/connect/` page walks through
interactively; `HarnessPanel.tsx` and `lib/harness.ts` are the source of
truth if this drifts from the running app.

## 1. Create a scoped token

In Settings (`/settings/`), create an agent token with the scopes the agent
needs:

- `read-reference` — query vocabulary, grammar, and script reference data.
- `import-lessons` — import a composed lesson into your library.

Most setups want both. The token secret (`lang_sk_…`) is shown exactly once
at creation — copy it immediately, since Langler stores only its hash and
cannot show it again. Set an expiry appropriate to how long you expect to
use this particular agent; a lost or unneeded token is revoked from the same
Settings page and stops working on its very next call (the machine
authorizer is uncached).

## 2. Download the harness

The `/connect/` page generates three downloadable assets, all built from the
live reference/lesson API contract so they can never drift from what the
API actually accepts:

- **`SKILL.md`** — plain-markdown instructions teaching an agent the full
  workflow: ask the learner for language/level/topic/readiness, query
  reference data, compose a schema-version-1.0 lesson grounded in the
  retrieved material, and import it. States the story-first contract
  explicitly (a `connected` lesson must open with a `reading` exercise whose
  `payload.genre` is `short_story`) and the closed-form-exercise quality bar
  (prefer `multiple_choice`, `matching`, `ordering`, and `cloze` with a
  `wordBank`; reserve `short_answer`/self-assessed types for what genuinely
  cannot be closed-form).
- **`langler-openapi.yaml`** — an OpenAPI 3.1 spec covering the machine API's
  four endpoints (`GET /reference/vocab`, `GET /reference/grammar`,
  `GET /reference/scripts`, `POST /lessons/import`) and the full lesson/
  exercise payload schemas. Any OpenAPI-aware agent framework can import
  this directly.
- **`langler-mcp.mjs`** — an optional, dependency-free MCP stdio server
  wrapping the same four endpoints, plus a matching `mcp.json` config. It
  performs no model invocation itself; it is a thin API wrapper.

## 3. Wire the token into the agent

Keep `LANGLER_TOKEN` in the agent's own process environment — never commit it
to a shared file or repo.

**Claude Code (skill):**

```sh
mkdir -p .claude/skills/langler
mv ~/Downloads/SKILL.md .claude/skills/langler/SKILL.md
export LANGLER_TOKEN="lang_sk_…"
```

Install the skill in your project or personal skills directory, set the
token in the agent's environment, then ask Claude Code to create and import
a Langler lesson.

**Any OpenAPI-aware agent:**

```sh
LANGLER_TOKEN="lang_sk_…"
# Import langler-openapi.yaml in your OpenAPI-aware agent
# Configure LANGLER_TOKEN as its Bearer security credential
```

Keep `SKILL.md` alongside the agent's instructions even in this path — the
OpenAPI spec is the contract, but `SKILL.md` carries the composition quality
bar (story-first, closed-form exercises, reference-id grounding) that the
schema alone doesn't express.

**MCP:**

```sh
mv ~/Downloads/langler-mcp.mjs /absolute/path/to/langler-mcp.mjs
# Update that absolute path in mcp.json
# Merge mcp.json into your agent's MCP configuration
```

Set `LANGLER_TOKEN` in the MCP server process's environment, not in a shared
config file.

## 4. Ask for a lesson

With the token and harness in place, ask the agent for a lesson (language,
level, topic, and any constraints). The agent should: query reference data
for that language/level, compose one schema-version-1.0 lesson using only
retrieved reference ids, and `POST /lessons/import` it with a unique
`Idempotency-Key`. A `201` means the lesson was created; a `200` with
`"created": false` means the same idempotency key was reused and Langler
returned the original lesson rather than creating a duplicate. The imported
lesson appears in your library (`/lessons/`) exactly like a copy-pasted one.

## Troubleshooting

- **A call is rejected outright**: the token may be expired, revoked, or
  missing the scope the route requires — `read-reference` for the three
  `GET` routes, `import-lessons` for `POST /lessons/import`. Create a fresh
  token with the right scope rather than trying to widen an existing one.
- **Import returns `400` with `issues`**: the lesson failed validation. Paste
  the `issues` array (each has a JSON `path` and a `message`) back to the
  agent and ask it to correct every cited path, then retry. This is
  expected friction, not a bug — it's the same validation the copy-paste
  path uses.
- **Retrying an import produces a `409`**: the same `Idempotency-Key` was
  reused with a *different* body. Use a new idempotency key once the
  intended lesson content has actually changed; reuse the same key only
  when retrying the exact same request.
- **Rate limited**: the machine API enforces a per-token limit (60
  requests/minute) independent of any client-side pacing the agent does.
  Back off and retry rather than hammering the endpoint.
