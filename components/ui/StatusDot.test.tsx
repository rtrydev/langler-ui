import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusDot } from "./StatusDot";

describe("StatusDot", () => {
  it("renders a decorative dot hidden from assistive tech", () => {
    const { container } = render(<StatusDot tone="success" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.className).toContain("bg-success");
  });

  it("defaults to the neutral tone", () => {
    const { container } = render(<StatusDot />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-ink-3",
    );
  });
});
