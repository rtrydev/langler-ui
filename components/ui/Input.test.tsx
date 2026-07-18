import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a plain bordered input by default", () => {
    render(<Input placeholder="Email" />);
    const el = screen.getByPlaceholderText("Email");
    expect(el.className).toContain("border-line");
    expect(el.getAttribute("aria-invalid")).toBeNull();
    expect(el.className).toContain("text-base");
    expect(el.className).toContain("sm:text-sm");
  });

  it("marks invalid fields for styling and assistive tech", () => {
    render(<Input placeholder="Email" invalid />);
    const el = screen.getByPlaceholderText("Email");
    expect(el.className).toContain("border-crimson");
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("forwards native props and change events", () => {
    const onChange = vi.fn();
    render(<Input defaultValue="a" onChange={onChange} />);
    const el = screen.getByDisplayValue("a");
    fireEvent.change(el, { target: { value: "ab" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue("ab")).toBe(el);
  });
});
