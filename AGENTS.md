<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Maintainers: the block above is generated and refreshed by `next dev` (Next.js 16.3+). Do not hand-edit it; your changes will be overwritten on the next dev run. -->

# Langler UI

Next.js App Router frontend for the Langler app. This repo is UI only: it renders the app and calls the Langler API over HTTP. It owns no database, no migrations, and no business rules that the API also enforces.

## Commands

- Install: `npm ci`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint/typecheck: `npm run lint` — must pass before every commit
- Test: `npm test`
- Single test: `npm test -- path/to/file.test.ts`

Do not run `next lint`. It was removed in Next.js 16 and `next build` no longer lints; `npm run lint` runs ESLint and `tsc --noEmit` directly.

## Layout

- `app/` — routes only. A folder here is a URL segment unless it is a route group `(name)` or private `_name`.
- `app/(app)/` — authenticated product surface
- `app/(marketing)/` — public pages
- `app/api/` — route handlers; use only for webhooks and non-React consumers, not for the app's own data fetching
- `components/ui/` — presentational primitives, no data fetching, no app-specific logic
- `components/` — composed, app-aware components
- `lib/` — framework-agnostic helpers: formatting, validation schemas, pure logic
- `lib/api/` — the only place that talks to the Langler API. Typed client functions, one per endpoint.
- `proxy.ts` — request interception at the network boundary (see below)

Colocate a component with its route under `app/.../_components/` when it is used by exactly one route. Promote to `components/` on the second consumer, not in anticipation of one.

## Building UI

Reuse before you build. Read `components/ui/` first and compose what is already there. Do not write a bespoke element because an existing primitive is a near-fit — adjust it via props, or extend the primitive so it covers both cases.

When something genuinely new is needed, build it in two steps:

1. Add a generic, feature-agnostic primitive to `components/ui/`. It takes props, emits callbacks, and knows nothing about Langler — no lesson vocabulary, no API types, no copy strings, no data fetching.
2. Use that primitive contextually where the feature lives, passing in the domain-specific labels, data, and handlers.

Never skip step 1 by inlining a one-off element into a feature file. If a primitive feels too specific to generalise, that is the signal to say so and ask, rather than to write it locally.

Before adding a primitive, check whether the design already has a name for it. Prefer widening an existing component's API over introducing a near-duplicate: two components that differ only by padding or an icon should be one component with a prop.

## Server and client boundary

- Push `use client` as far down the tree as possible. A page should not be a client component because one button inside it is. Primitives in `components/ui/` should be server-compatible unless they genuinely need interactivity.
- Never fetch data in a Client Component. Fetch on the server and pass the result as props, or stream it in through `<Suspense>`.
- Import `server-only` at the top of any module that touches secrets, and `client-only` in modules that touch `window`. A leaked API key is a build failure we want, not a review catch.
- Only `NEXT_PUBLIC_`-prefixed env vars may be referenced in client code. Everything else is server-side.

## Data and mutations

- All reads go through a typed function in `lib/api/`. Components never call `fetch` directly and never hardcode a URL.
- All writes go through Server Actions. Do not add a route handler in `app/api/` to serve the app's own forms.
- Every Server Action validates its input with a Zod schema from `lib/validation/` before doing anything else. Arguments arrive from the network and are untrusted regardless of what the calling form does.
- After a mutation, invalidate the affected `cacheTag` rather than revalidating a path.
- Errors from the API surface as typed results, not thrown strings. Let `error.tsx` handle the unexpected; handle the expected inline.

## Conventions

- TypeScript strict. No `any` without a `// why:` comment on the line above.
- Comments are exceptional — roughly 99% of comments should not exist, so write none unless a specific case explicitly requires one: a non-obvious constraint the code cannot express (the `// why:` above is one such case). Never narrate what the code does, where it came from, or why a change is correct. Docstrings and JSDoc are banned outright — names and types carry the API; prose about components belongs in `components/ui/README.md`, not the source.
- No hacks or workarounds. Build the clean, well-formed solution that will last; if the clean path is blocked, stop and explain the blocker instead of patching around it.
- The React Compiler handles memoisation. Do not add `useMemo`, `useCallback`, or `React.memo`. If a render is genuinely slow, say so and we will measure before optimising.
- No new runtime dependencies without asking first. Dev dependencies are fine.
- Components: named exports, one component per file, `PascalCase.tsx`. Everything else `kebab-case.ts`.
- Async server components are the norm — `export default async function Page()` is not a smell.
- Every route segment that fetches gets a `loading.tsx`. Every route group gets an `error.tsx`.
- Accessibility is not optional: semantic elements, labelled controls, visible focus. Prefer a real `<button>` over a `<div onClick>`.

## Testing

- Unit tests sit next to the code as `*.test.ts`.
- Test the functions in `lib/`, not the framework. Do not write tests that assert Next.js renders a page.
- Server Actions are tested directly as functions with mocked `lib/api/` clients.
- Add a test when fixing a bug; the test should fail against the unfixed code.

## Workflow

- Branch from `main`. Conventional commit messages. Never push directly to `main`.
- Run `npm run lint` and `npm test` before proposing a commit.
- Keep diffs scoped to the request. If you notice unrelated breakage, mention it rather than fixing it in the same change.
- When a change touches routing, caching, or the proxy, state in the summary what you verified by hand — these are the areas where the build stays green while behaviour breaks.
