import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./Kbd";

describe("Kbd", () => {
  it("renders a kbd element in mono type", () => {
    render(<Kbd>⏎ Enter to check</Kbd>);
    const el = screen.getByText("⏎ Enter to check");
    expect(el.tagName).toBe("KBD");
    expect(el.className).toContain("font-mono");
  });
});
