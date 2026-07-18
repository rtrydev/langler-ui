import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlyphTile } from "./GlyphTile";

describe("GlyphTile", () => {
  it("renders a plain square cell by default", () => {
    render(<GlyphTile>水</GlyphTile>);
    const el = screen.getByText("水");
    expect(el.className).toContain("aspect-square");
    expect(el.className).toContain("border-line");
    expect(el.className).not.toContain("glyph-guides");
  });

  it("adds copybook guides, dashed border and ghost ink for tracing cells", () => {
    render(
      <GlyphTile guides dashed ghost>
        水
      </GlyphTile>,
    );
    const el = screen.getByText("水");
    expect(el.className).toContain("glyph-guides");
    expect(el.className).toContain("border-dashed");
    expect(el.className).toContain("text-line");
  });

  it("highlights the selected tile", () => {
    render(<GlyphTile selected>水</GlyphTile>);
    const el = screen.getByText("水");
    expect(el.className).toContain("border-accent");
    expect(el.className).toContain("bg-accent-soft");
  });

  it("shows a stroke-order index in the corner", () => {
    render(<GlyphTile index={3}>水</GlyphTile>);
    expect(screen.getByText("3").className).toContain("text-accent");
  });
});
