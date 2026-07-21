import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pill } from "./Pill";

describe("Pill", () => {
  it("exposes selection state via aria-pressed", () => {
    const { rerender } = render(<Pill>Polski</Pill>);
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "false",
    );
    rerender(<Pill selected>Polski</Pill>);
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("renders unselected as a bordered surface chip", () => {
    render(<Pill>All</Pill>);
    const el = screen.getByRole("button");
    expect(el.className).toContain("border-line");
    expect(el.className).toContain("bg-surface");
  });

  it("fills with the tone color when selected", () => {
    render(
      <Pill selected tone="crimson">
        Polski
      </Pill>,
    );
    const el = screen.getByRole("button");
    expect(el.className).toContain("bg-crimson-soft");
    expect(el.className).toContain("text-crimson");
  });
});
