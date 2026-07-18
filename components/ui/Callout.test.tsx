import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Callout } from "./Callout";

describe("Callout", () => {
  it("defaults to the info tone with its icon", () => {
    render(<Callout>9 items were scheduled for review.</Callout>);
    const el = screen.getByText("9 items were scheduled for review.")
      .parentElement as HTMLElement;
    expect(el.className).toContain("bg-accent-soft");
    expect(el.textContent).toContain("ℹ");
  });

  it("uses tone-specific styling and default icons", () => {
    render(<Callout tone="warning">Temporary password.</Callout>);
    const el = screen.getByText("Temporary password.")
      .parentElement as HTMLElement;
    expect(el.className).toContain("bg-warning-soft");
    expect(el.textContent).toContain("⚠");
  });

  it("only announces errors as alerts", () => {
    const { rerender } = render(<Callout tone="error">Wrong tense.</Callout>);
    expect(screen.getByRole("alert")).toBeTruthy();
    rerender(<Callout tone="success">Imported.</Callout>);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("allows overriding the icon", () => {
    render(
      <Callout tone="info" icon="✷">
        Custom
      </Callout>,
    );
    const el = screen.getByText("Custom").parentElement as HTMLElement;
    expect(el.textContent).toContain("✷");
    expect(el.textContent).not.toContain("ℹ");
  });
});
