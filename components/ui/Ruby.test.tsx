import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Ruby } from "./Ruby";

describe("Ruby", () => {
  it("annotates the base text with its reading", () => {
    const { container } = render(<Ruby reading="としょかん">図書館</Ruby>);
    const ruby = container.querySelector("ruby");
    expect(ruby?.textContent).toContain("図書館");
    expect(ruby?.querySelector("rt")?.textContent).toBe("としょかん");
  });
});
