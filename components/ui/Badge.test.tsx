import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("defaults to the neutral tone", () => {
    render(<Badge>New</Badge>);
    const el = screen.getByText("New");
    expect(el.className).toContain("bg-tint");
    expect(el.className).toContain("text-ink-2");
  });

  it("maps tones to their soft background + colored text", () => {
    render(<Badge tone="vermilion">日本語 · N4</Badge>);
    const el = screen.getByText("日本語 · N4");
    expect(el.className).toContain("bg-vermilion-soft");
    expect(el.className).toContain("text-vermilion");
  });

  it("merges a custom className", () => {
    render(
      <Badge tone="success" className="custom-x">
        Done
      </Badge>,
    );
    expect(screen.getByText("Done").className).toContain("custom-x");
  });
});
