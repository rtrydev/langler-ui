import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("renders a native select with its options", () => {
    render(
      <Select defaultValue="all" aria-label="Language">
        <option value="all">All languages</option>
        <option value="jp">Japanese</option>
      </Select>,
    );
    const el = screen.getByRole("combobox", {
      name: "Language",
    }) as HTMLSelectElement;
    expect(el.value).toBe("all");
    expect(screen.getByRole("option", { name: "Japanese" })).toBeTruthy();
  });

  it("hides the decorative chevron from assistive tech", () => {
    const { container } = render(
      <Select aria-label="x">
        <option>1</option>
      </Select>,
    );
    const chevron = container.querySelector("span[aria-hidden]");
    expect(chevron?.textContent).toBe("▾");
  });

  it("splits className between wrapper and select", () => {
    const { container } = render(
      <Select className="wrapper-x" selectClassName="select-x" aria-label="x">
        <option>1</option>
      </Select>,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "wrapper-x",
    );
    expect(screen.getByRole("combobox").className).toContain("select-x");
  });
});
