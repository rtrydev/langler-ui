# Langler UI — how to build with this design system

**No provider or wrapper is needed.** Every component renders standalone. Theme: light by default; set `data-theme="dark"` on a root element (or rely on `prefers-color-scheme`) to flip the whole palette — components adapt via CSS variables, never re-render.

**Styling idiom: Tailwind v4 utility classes over the system's tokens.** Components take `className` for layout glue. Style your own layout with these token-backed utilities (never raw hex, never `text-gray-*`):

| Family | Utilities |
|---|---|
| Surfaces | `bg-paper` (page), `bg-surface` (cards), `bg-tint` (subtle fill) |
| Text | `text-ink`, `text-ink-2` (secondary), `text-ink-3` (tertiary) |
| Borders | `border-line`, `border-line-2` (hairline) |
| Action | `bg-accent`, `text-accent`, `text-on-accent`, `bg-accent-soft`, `border-accent-border`, `text-accent-strong`, `hover:bg-accent-hover` |
| Language tones | `vermilion` (Japanese), `gold` (Burmese), `crimson` (Polish) — each with `-soft` bg and (vermilion) `-border`/`-strong`; e.g. `bg-vermilion-soft text-vermilion` |
| Status | `success`/`warning` + `-soft`/`-border` (+ `warning-strong`); errors reuse `vermilion` |
| Fonts | `font-sans` (Inter, default), `font-serif` (Noto Serif), `font-jp`/`font-jp-serif` (Japanese), `font-myanmar` (Burmese), `font-mono` (IBM Plex Mono) |
| Shadows | `shadow-card`, `shadow-raised`, `shadow-floating`, `shadow-window` |
| Extras | `glyph-guides` (crosshair guides inside a `GlyphTile`), `worksheet-*` classes for printable A4 worksheets |

**The utility set is precompiled.** The stylesheet ships exactly the Tailwind classes the Langler app uses — there is no Tailwind compiler at design time, so an unshipped class silently does nothing. Common layout/spacing/typography utilities (`flex`, `grid`, `gap-2/3/4/6/8`, `p-4/5/8`, `px-*`, `mt-*`, `w-full`, `max-w-md`, `text-xs/sm/base/lg`, `rounded-lg/xl/full`, `items-center`, `justify-between`, `truncate`, …) are all present, but before leaning on an uncommon one (e.g. `p-6` and most `md:`/`sm:` responsive variants are NOT shipped), grep the stylesheet. Prefer inline `style={{}}` over an unverified class for one-off values.

**Where the truth lives:** read `styles.css` (imports the full token set and compiled component CSS) before inventing styles; each component's API is its `<Name>.d.ts`, usage in `<Name>.prompt.md`.

**Idiomatic composition** (library components for controls, token utilities for glue):

```tsx
<div className="min-h-screen bg-paper p-8">
  <section className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-line bg-surface p-5 shadow-card">
    <Overline>Japanese · Lesson 4</Overline>
    <Heading as="h2" size="lg">Ordering food</Heading>
    <p className="text-sm leading-relaxed text-ink-2">
      Learn the phrases Mira uses at the Kyoto ramen counter.
    </p>
    <div className="flex items-center gap-3">
      <Badge tone="vermilion">Japanese</Badge>
      <Progress value={62} className="flex-1" />
    </div>
    <Button fullWidth>Continue lesson</Button>
  </section>
</div>
```

Accessibility is part of the system: real `<button>`/`<label>` semantics, visible focus rings — keep them (the primitives already do).
