import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders a horizontal rule", () => {
    render(<Divider />);
    const el = screen.getByRole("separator");
    expect(el.tagName).toBe("HR");
    expect(el.className).toContain("bg-line");
  });
});
