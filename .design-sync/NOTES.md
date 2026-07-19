# design-sync notes

- This is a Next.js **app repo**, not a packaged DS: no dist, no build entry. The converter runs in synth-entry mode over `srcDir: components/ui` (34 components; `cn` helper lives in `lib/cn.ts`, imported via the `@/*` tsconfig alias).
- Component CSS is Tailwind v4 utilities; there is no per-component stylesheet. The real compiled CSS comes from the app build: `npm run build` → `.next/static/chunks/*.css` (hashed names; the compile stage writes these even when the export stage fails). `.design-sync/collect-css.mjs` snapshots them to `.design-sync/.cache/css/` as `chunks/ds-globals.css` + `chunks/ds-fonts.css` + the referenced `media/*.woff2`, preserving the `chunks/../media` layout so relative font urls resolve. Never point cssEntry into `.next/` or `out/` directly — any build/dev run wipes or re-hashes those.
- collect-css appends to ds-globals.css: the six `--font-*` variables on `:root` (next/font puts them on hashed classes the previews never get) and the `local()`-only metric-adjusted fallback `@font-face` rules (the converter's font harvest keeps only `url()` faces).
- `npm run build`'s export step needs the `.env.local` documented in README.md (`NEXT_PUBLIC_MACHINE_API_URL` etc. — `/connect` throws without it). CSS chunks are complete before that failure, so on a machine without `.env.local`, run `npm run build` (let it fail at export), then `node .design-sync/collect-css.mjs`.
- `next/font` defines `--font-inter` etc. on hashed `__variable` classes applied to `<html>` by the app; previews never get those classes, so collect-css re-emits the variables on `:root` at the end of `ds-fonts.css`.
- Fonts: Inter, Noto Serif, Noto Sans JP, Noto Serif JP, Noto Sans Myanmar, IBM Plex Mono — all shipped as local woff2 subsets in `.next/static/media/` (~276 files), referenced by `ds-fonts.css`.
- Dark mode: `data-theme="dark"|"light"` on `<html>`, with `prefers-color-scheme` fallback. No provider component — primitives are context-free by design.
- The app ships no `.d.ts` tree, so without help the converter emits stub props (`[key: string]: unknown`). `.design-sync/emit-types.mjs` runs the repo's own `tsc` (`.design-sync/tsconfig.types.json`) into `.design-sync/.cache/types/` + writes an index.d.ts barrel; `package.json` `publishConfig.types` points there (inert for the app — the package is private/never published, but it's the converter's preferred types root). Keep the emit-types step in buildCmd or props degrade to stubs again.
- The converter needs `node_modules/langler-ui` to resolve (its package adapter reads the pkg from node_modules; npm won't self-install an app repo). A self symlink is the npm-link-style fix: `ln -sfn .. node_modules/langler-ui` — re-create after any `npm ci`.
- Playwright: chromium build 1223 is cached at `~/Library/Caches/ms-playwright` → install `playwright@1.60.0` into `.ds-sync/` (its browsers.json pins 1223). Latest playwright pins a different build and fails to launch.

## Preview authoring (wave learnings, Jul 2026)

- `.design-sync/previews/` is NOT in the app's Tailwind content scan, so only utilities the app itself emits exist in the collected CSS — `w-80`/`w-64`/`w-44` etc. silently no-op. Verified available glue: `w-36`, `w-72`, `w-96`, `w-full`, `max-w-sm/md/lg`, `min-h-32`. Grep `.design-sync/.cache/css/chunks/ds-globals.css` before using anything uncommon; constrain component width with a wrapper div, not className (see cn note below).
- `lib/cn.ts` is plain concat (no tailwind-merge); `.w-full` sorts after `.w-36` in the sheet, so a width class passed via className cannot override a component's base `w-full` (Input). The app's cloze-blank usage carries the same latent conflict.
- Stepper needs a no-op `onStepSelect` in static previews to render enabled styling. Switch/SegmentedControl/ChoiceChip: use `defaultChecked`/`defaultValue`. Divider and EmptyState must be composed on a surface (Card) or they're invisible/unframed. DrawingPad guide glyph is `clamp(4rem,18vw,8rem)` — pads need ≥`w-72` or the guide clips; its guide span hardcodes `font-jp-serif`.

## Known render warns

- Burmese complex-cluster shaping is broken in the capture chromium (medial-ra ြ renders detached, e.g. in "မြန်မာစာ") — previews use simple clusters ("ဗမာစာ", "က"). Capture-environment shaping limitation, not a component bug; Japanese shapes fine.
- Pre-authoring floor cards flagged 7 tiny components `[RENDER_BLANK]` (Badge, EmptyState, MeterBars, Progress, Ruby, StatusCircle, StatusDot) — superseded by authored previews.

## Component gaps flagged to the app team (not sync issues)

- OptionCard `disabled` has no visual style (only kills the pointer) — disabled looks identical to default.
- Input width can't be overridden via className (base `w-full` wins; cn has no tailwind-merge).

## Re-sync risks

- The CSS is a usage-derived snapshot of the app build: if the app stops using a utility a preview relies on, that preview silently loses styling on the next collect — re-eyeball contact sheets after big app CSS changes. This sync's snapshot was taken while uncommitted app work (Polish orthography feature) was in the tree.
- `publishConfig.types` in package.json and the `node_modules/langler-ui` self symlink are load-bearing for the converter; `npm ci` removes the symlink, and dropping the emit-types step degrades every `.d.ts` to prop stubs.
- The `npm run build` export failure (missing `.env.local`) is expected on machines without env config; CSS chunks are still complete (compile stage) — run collect-css + emit-types manually after.
