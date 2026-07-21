import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthBrand } from "./AuthBrand";

describe("AuthBrand", () => {
  it("renders the designer brand lockup", () => {
    const { container } = render(<AuthBrand />);

    expect(container.querySelector("img")?.getAttribute("src")).toContain(
      "langler-mark.png",
    );
    expect(screen.getByText("Langler").className).toContain("font-display");
    expect(
      screen.getByText("Your languages. Your AI. One notebook."),
    ).toBeTruthy();
  });
});
