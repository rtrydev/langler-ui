import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders a surface panel with default padding and shadow", () => {
    render(<Card>Body</Card>);
    const el = screen.getByText("Body");
    expect(el.className).toContain("bg-surface");
    expect(el.className).toContain("shadow-card");
    expect(el.className).toContain("p-5");
  });

  it("supports padding none and other elevations", () => {
    render(
      <Card padding="none" elevation="floating">
        Body
      </Card>,
    );
    const el = screen.getByText("Body");
    expect(el.className).not.toContain("p-5");
    expect(el.className).toContain("shadow-floating");
  });

  it("draws a colored edge on the requested side", () => {
    const { rerender } = render(<Card edge="vermilion">Body</Card>);
    expect(screen.getByText("Body").className).toContain(
      "border-t-vermilion",
    );
    rerender(
      <Card edge="gold" edgeSide="left">
        Body
      </Card>,
    );
    expect(screen.getByText("Body").className).toContain("border-l-gold");
  });

  it("switches to the accent-tinted dashed style", () => {
    render(<Card dashed>CTA</Card>);
    const el = screen.getByText("CTA");
    expect(el.className).toContain("border-dashed");
    expect(el.className).toContain("bg-accent-soft");
    expect(el.className).not.toContain("bg-surface");
  });
});
