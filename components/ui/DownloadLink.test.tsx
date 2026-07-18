import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DownloadLink } from "./DownloadLink";

describe("DownloadLink", () => {
  it("provides inline text as a named download", () => {
    render(
      <DownloadLink content="hello" fileName="hello.txt">
        Download
      </DownloadLink>,
    );
    const link = screen.getByRole("link", { name: "Download" });
    expect(link.getAttribute("download")).toBe("hello.txt");
    expect(link.getAttribute("href")).toContain("hello");
  });
});
