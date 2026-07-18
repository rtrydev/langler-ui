import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CopyButton } from "@/components/ui/CopyButton";

describe("CopyButton", () => {
  it("copies the text and shows the copied label", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(
      <CopyButton copiedLabel="Copied!" text="hello world">
        Copy prompt
      </CopyButton>,
    );

    const button = screen.getByRole("button", { name: "Copy prompt" });
    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith("hello world");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copied!" })).toBeDefined();
    });

    vi.unstubAllGlobals();
  });

  it("keeps the default label when the clipboard is unavailable", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<CopyButton text="hello">Copy</CopyButton>);
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(screen.getByRole("button", { name: "Copy" })).toBeDefined();

    vi.unstubAllGlobals();
  });
});
