import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

const buttonItems = [
  { value: "vocab", label: "Vocabulary" },
  { value: "grammar", label: "Grammar" },
];

describe("Tabs", () => {
  it("renders buttons and reports selection via onSelect", () => {
    const onSelect = vi.fn();
    render(
      <Tabs items={buttonItems} activeValue="vocab" onSelect={onSelect} />,
    );
    const active = screen.getByRole("button", { name: "Vocabulary" });
    expect(active.getAttribute("aria-pressed")).toBe("true");
    expect(active.className).toContain("text-ink");
    fireEvent.click(screen.getByRole("button", { name: "Grammar" }));
    expect(onSelect).toHaveBeenCalledWith("grammar");
  });

  it("renders links with aria-current when items carry hrefs", () => {
    render(
      <Tabs
        items={[
          { value: "a", label: "A", href: "/a" },
          { value: "b", label: "B", href: "/b" },
        ]}
        activeValue="b"
      />,
    );
    const link = screen.getByRole("link", { name: "B" });
    expect(link.getAttribute("href")).toBe("/b");
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(
      screen.getByRole("link", { name: "A" }).getAttribute("aria-current"),
    ).toBeNull();
  });
});
