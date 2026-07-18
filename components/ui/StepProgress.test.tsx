import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepProgress } from "./StepProgress";

describe("StepProgress", () => {
  it("renders one segment per step and fills the completed ones", () => {
    render(<StepProgress total={4} completed={2} />);
    const el = screen.getByRole("progressbar");
    const segments = Array.from(el.children) as HTMLElement[];
    expect(segments).toHaveLength(4);
    expect(
      segments.filter((s) => s.className.includes("bg-accent")),
    ).toHaveLength(2);
    expect(el.getAttribute("aria-valuenow")).toBe("2");
    expect(el.getAttribute("aria-valuemax")).toBe("4");
  });
});
