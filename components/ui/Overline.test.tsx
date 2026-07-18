import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Overline } from "./Overline";

describe("Overline", () => {
  it("renders an uppercase section label", () => {
    render(<Overline>Due today</Overline>);
    const el = screen.getByText("Due today");
    expect(el.tagName).toBe("DIV");
    expect(el.className).toContain("uppercase");
    expect(el.className).toContain("text-ink-3");
  });

  it("can render as a semantic heading", () => {
    render(<Overline as="h3">Exercises</Overline>);
    expect(screen.getByRole("heading", { level: 3, name: "Exercises" }))
      .toBeTruthy();
  });
});
