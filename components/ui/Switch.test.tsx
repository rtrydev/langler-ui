import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("is a native checkbox exposed as a switch", () => {
    render(<Switch defaultChecked>Include answer key</Switch>);
    const el = screen.getByRole("switch") as HTMLInputElement;
    expect(el.checked).toBe(true);
    expect(screen.getByText("Include answer key")).toBeTruthy();
  });

  it("toggles when the label text is clicked", () => {
    render(<Switch>Show strokes</Switch>);
    const el = screen.getByRole("switch") as HTMLInputElement;
    expect(el.checked).toBe(false);
    fireEvent.click(screen.getByText("Show strokes"));
    expect(el.checked).toBe(true);
  });

  it("passes disabled through to the native input", () => {
    render(<Switch disabled>Off</Switch>);
    const el = screen.getByRole("switch") as HTMLInputElement;
    expect(el.disabled).toBe(true);
  });
});
