import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title, description and actions", () => {
    render(
      <EmptyState
        title="Your notebook is empty"
        description="There are two ways to bring a lesson in."
      >
        <button type="button">Create your first lesson</button>
      </EmptyState>,
    );
    expect(screen.getByText("Your notebook is empty")).toBeTruthy();
    expect(
      screen.getByText("There are two ways to bring a lesson in."),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Create your first lesson" }),
    ).toBeTruthy();
  });

  it("shows the icon tile only when an icon is given", () => {
    const { container, rerender } = render(<EmptyState title="Nothing due" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.firstElementChild?.textContent).toBe("Nothing due");
    rerender(<EmptyState title="Nothing due" icon="白" />);
    expect(root.firstElementChild?.textContent).toBe("白");
  });
});
