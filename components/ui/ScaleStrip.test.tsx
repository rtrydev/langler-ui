import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleStrip } from "./ScaleStrip";

describe("ScaleStrip", () => {
  it("renders one segment per item with active and struck styling", () => {
    const { container } = render(
      <ScaleStrip
        items={[
          { label: "A1", struck: true },
          { label: "A2", active: true },
          { label: "B1" },
        ]}
      />,
    );
    const segments = Array.from(
      container.firstElementChild?.children ?? [],
    ) as HTMLElement[];
    expect(segments).toHaveLength(3);
    expect(segments[0].className).toContain("line-through");
    expect(segments[1].className).toContain("border-accent");
    expect(segments[1].className).not.toContain("line-through");
    expect(segments[2].className).toContain("border-line");
  });
});
