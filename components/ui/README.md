# components/ui — design-system primitives

Presentational primitives from the Langler design system (claude.ai/design →
`Langler.dc.html`). Everything here is feature-agnostic: props in, callbacks
out, no data fetching, no app vocabulary. All components are
server-compatible — none carry `use client`; interactive ones are either
CSS-only over native inputs (Switch, SegmentedControl, ChoiceChip) or accept
optional callbacks that only client consumers pass.

Tokens live in `app/globals.css` (Tailwind v4 `@theme`): colors
(`paper`, `surface`, `ink`/`ink-2`/`ink-3`, `line`/`line-2`, `tint`,
`accent*`, `vermilion*`, `gold*`, `crimson*`, `success*`, `warning*`),
fonts (`font-sans`, `font-serif`, `font-jp`, `font-jp-serif`,
`font-myanmar`, `font-mono`) and shadows (`shadow-card`, `shadow-raised`,
`shadow-floating`, `shadow-window`). Dark mode ("ink on slate") flips
automatically via `prefers-color-scheme`, or force it with
`data-theme="dark" | "light"` on `<html>`. The tone names `vermilion`,
`gold`, `crimson` are the palette's own names — mapping languages to tones
happens in app code, not here.

| Component | Purpose |
| --- | --- |
| `Button` | primary / secondary / accent / ghost / danger / contrast; sm–lg |
| `Badge` | small rounded label; tones incl. language + status colors |
| `Pill` | rounded-full filter chip with `selected` state |
| `Card` | surface panel; elevation, padding, colored `edge`, `dashed` CTA |
| `OptionCard` | selectable bordered card (answer options, wizard tiles) |
| `Input` / `Textarea` | text fields with `invalid` state |
| `Label` / `FieldMessage` | field label and helper/error text |
| `SearchInput` | input with leading search icon |
| `Select` | styled native select with chevron |
| `Switch` | CSS-only toggle over a native checkbox |
| `SegmentedControl` | joined radio group (Always / Hover / Off) |
| `ChoiceChip` | boxed radio/checkbox chip (levels, exercise types) |
| `Progress` | percentage bar |
| `StepProgress` | one segment per step (player header) |
| `ScaleStrip` | labelled scale segments with `active` / `struck` states |
| `MeterBars` | small discrete meter (frequency) |
| `Callout` | info / success / warning / error message panel |
| `Tabs` | underline tab row; renders links or buttons |
| `Heading` / `Overline` | tracking-tight titles; uppercase section labels |
| `Divider` | hairline rule |
| `StatusDot` / `StatusCircle` | colored dot; round glyph bubble (✓ ✕ ◐) |
| `EmptyState` | icon tile + title + description + actions |
| `Stepper` | numbered wizard steps with connectors |
| `CodeBlock` | dark code/prompt panel with header + actions |
| `Kbd` | monospace keyboard hint |
| `Ruby` | furigana/romanization annotation |
| `GlyphTile` | square script cell; guides, ghost, tracing, stroke index |
| `DrawingPad` | pointer/touch canvas with optional tracing guide |

Reuse before you build: widen one of these via props rather than adding a
near-duplicate, and keep anything Langler-specific (labels, data, handlers)
in the consuming feature.
