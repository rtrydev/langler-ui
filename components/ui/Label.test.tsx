import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./Label";

describe("Label", () => {
  it("renders a label element associated via htmlFor", () => {
    render(<Label htmlFor="email">Email</Label>);
    const el = screen.getByText("Email");
    expect(el.tagName).toBe("LABEL");
    expect(el.getAttribute("for")).toBe("email");
  });
});
