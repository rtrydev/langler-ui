import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusCircle } from "./StatusCircle";

describe("StatusCircle", () => {
  it("renders the glyph in a tone-colored bubble", () => {
    render(<StatusCircle tone="success">✓</StatusCircle>);
    const el = screen.getByText("✓");
    expect(el.className).toContain("bg-success-soft");
    expect(el.className).toContain("text-success");
  });

  it("scales with the size prop", () => {
    render(
      <StatusCircle tone="error" size="lg">
        ✕
      </StatusCircle>,
    );
    expect(screen.getByText("✕").className).toContain("size-11");
  });
});
