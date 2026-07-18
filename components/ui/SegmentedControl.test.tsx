import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { value: "always", label: "Always" },
  { value: "hover", label: "Hover" },
  { value: "off", label: "Off" },
];

describe("SegmentedControl", () => {
  it("renders one radio per option under the given name", () => {
    render(<SegmentedControl name="furigana" options={options} />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios).toHaveLength(3);
    expect(radios.every((r) => r.name === "furigana")).toBe(true);
  });

  it("checks the defaultValue option", () => {
    render(
      <SegmentedControl
        name="furigana"
        options={options}
        defaultValue="hover"
      />,
    );
    expect(
      (screen.getByRole("radio", { name: "Hover" }) as HTMLInputElement)
        .checked,
    ).toBe(true);
  });

  it("reports selections through onValueChange", () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        name="furigana"
        options={options}
        defaultValue="always"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByText("Off"));
    expect(onValueChange).toHaveBeenCalledWith("off");
  });

  it("follows the controlled value prop", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        name="theme"
        options={options}
        value="always"
        onValueChange={onValueChange}
      />,
    );
    const always = screen.getByRole("radio", {
      name: "Always",
    }) as HTMLInputElement;
    expect(always.checked).toBe(true);
    rerender(
      <SegmentedControl
        name="theme"
        options={options}
        value="off"
        onValueChange={onValueChange}
      />,
    );
    expect(always.checked).toBe(false);
    expect(
      (screen.getByRole("radio", { name: "Off" }) as HTMLInputElement).checked,
    ).toBe(true);
  });
});
