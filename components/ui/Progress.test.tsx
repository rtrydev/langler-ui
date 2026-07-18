import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("exposes the value through progressbar semantics", () => {
    render(<Progress value={60} />);
    const el = screen.getByRole("progressbar");
    expect(el.getAttribute("aria-valuenow")).toBe("60");
    expect(el.getAttribute("aria-valuemax")).toBe("100");
  });

  it("sets the fill width from the value", () => {
    render(<Progress value={25} />);
    const fill = screen.getByRole("progressbar")
      .firstElementChild as HTMLElement;
    expect(fill.style.width).toBe("25%");
  });

  it("clamps out-of-range values", () => {
    const { rerender } = render(<Progress value={150} />);
    expect(
      screen.getByRole("progressbar").getAttribute("aria-valuenow"),
    ).toBe("100");
    rerender(<Progress value={-5} />);
    expect(
      screen.getByRole("progressbar").getAttribute("aria-valuenow"),
    ).toBe("0");
  });
});
