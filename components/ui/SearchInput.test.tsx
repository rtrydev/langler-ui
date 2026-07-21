import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("renders a search input with a leading icon inset", () => {
    render(<SearchInput placeholder="Search tags…" />);
    const el = screen.getByRole("searchbox");
    expect(el.getAttribute("placeholder")).toBe("Search tags…");
    expect(el.className).toContain("pl-[38px]");
  });

  it("splits className between wrapper and input", () => {
    const { container } = render(
      <SearchInput className="wrapper-x" inputClassName="input-x" />,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "wrapper-x",
    );
    expect(screen.getByRole("searchbox").className).toContain("input-x");
  });
});
