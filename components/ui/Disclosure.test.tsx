import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Disclosure } from "./Disclosure";

describe("Disclosure", () => {
  it("keeps its content collapsed by default", () => {
    render(
      <Disclosure summary="Show 15 more">
        <p>Hidden content</p>
      </Disclosure>,
    );
    expect(screen.getByRole("group")).not.toHaveProperty("open", true);
  });

  it("renders open when asked", () => {
    render(
      <Disclosure open summary="Show 15 more">
        <p>Hidden content</p>
      </Disclosure>,
    );
    expect(screen.getByText("Hidden content")).toBeTruthy();
    expect(screen.getByRole("group")).toHaveProperty("open", true);
  });

  it("hides the native marker so the summary reads as a control", () => {
    render(<Disclosure summary="More">content</Disclosure>);
    const summary = screen.getByText("More");
    expect(summary.className).toContain("[&::-webkit-details-marker]:hidden");
    expect(summary.className).toContain("list-none");
  });
});
