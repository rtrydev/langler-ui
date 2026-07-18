import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthBrand } from "./AuthBrand";

describe("AuthBrand", () => {
  it("renders the designer brand lockup", () => {
    render(<AuthBrand />);

    expect(screen.getByText("語").className).toContain("bg-accent");
    expect(screen.getByText("Langler").className).toContain("font-bold");
    expect(
      screen.getByText("Your languages. Your AI. One notebook."),
    ).toBeTruthy();
  });
});
