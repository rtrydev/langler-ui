import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders type=button by default so forms are not submitted by accident", () => {
    render(<Button>Go</Button>);
    expect(
      screen.getByRole("button", { name: "Go" }).getAttribute("type"),
    ).toBe("button");
  });

  it("respects an explicit type", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("defaults to the primary variant", () => {
    render(<Button>P</Button>);
    expect(screen.getByRole("button").className).toContain("bg-accent");
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="secondary" size="lg">
        S
      </Button>,
    );
    const el = screen.getByRole("button");
    expect(el.className).toContain("border-line");
    expect(el.className).toContain("px-[22px]");
  });

  it("supports link-styled actions without inventing an anchor destination", () => {
    render(<Button variant="link">Forgot password?</Button>);
    expect(screen.getByRole("button").className).toContain("text-accent");
    expect(screen.getByRole("button").className).toContain("bg-transparent");
  });

  it("stretches to full width when fullWidth is set", () => {
    render(<Button fullWidth>W</Button>);
    expect(screen.getByRole("button").className).toContain("w-full");
  });

  it("appends the custom className last so it can override", () => {
    render(<Button className="custom-x">C</Button>);
    expect(screen.getByRole("button").className.endsWith("custom-x")).toBe(
      true,
    );
  });

  it("fires onClick, but not when disabled", () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>K</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        K
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
