import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MeterBars } from "./MeterBars";

describe("MeterBars", () => {
  it("renders max bars (default 4) and fills value of them", () => {
    render(<MeterBars value={3} />);
    const el = screen.getByRole("meter");
    const bars = Array.from(el.children) as HTMLElement[];
    expect(bars).toHaveLength(4);
    expect(bars.filter((b) => b.className.includes("bg-accent"))).toHaveLength(
      3,
    );
  });

  it("supports a custom max and exposes meter semantics", () => {
    render(<MeterBars value={1} max={6} />);
    const el = screen.getByRole("meter");
    expect(el.children).toHaveLength(6);
    expect(el.getAttribute("aria-valuenow")).toBe("1");
    expect(el.getAttribute("aria-valuemax")).toBe("6");
  });
});
