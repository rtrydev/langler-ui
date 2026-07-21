import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OptionCard } from "./OptionCard";

describe("OptionCard", () => {
  it("is a button with aria-pressed reflecting selection", () => {
    const { rerender } = render(<OptionCard>抹茶</OptionCard>);
    const el = screen.getByRole("button", { name: "抹茶" });
    expect(el.getAttribute("type")).toBe("button");
    expect(el.getAttribute("aria-pressed")).toBe("false");
    rerender(<OptionCard selected>抹茶</OptionCard>);
    expect(el.getAttribute("aria-pressed")).toBe("true");
  });

  it("highlights the selected card with the accent border", () => {
    render(<OptionCard selected>抹茶</OptionCard>);
    const el = screen.getByRole("button");
    expect(el.className).toContain("border-accent");
    expect(el.className).toContain("var(--accent)");
  });

  it("renders unselected with a hairline border", () => {
    render(<OptionCard>コーヒー</OptionCard>);
    expect(screen.getByRole("button").className).toContain("border-line");
  });
});
