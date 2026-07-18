import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textarea with the default border", () => {
    render(<Textarea placeholder="Paste JSON" />);
    const el = screen.getByPlaceholderText("Paste JSON");
    expect(el.tagName).toBe("TEXTAREA");
    expect(el.className).toContain("border-line");
  });

  it("marks invalid state", () => {
    render(<Textarea placeholder="Paste JSON" invalid />);
    const el = screen.getByPlaceholderText("Paste JSON");
    expect(el.className).toContain("border-crimson");
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });
});
