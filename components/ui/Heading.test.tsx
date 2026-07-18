import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders an h2 at the md size by default", () => {
    render(<Heading>Lessons</Heading>);
    const el = screen.getByRole("heading", { level: 2, name: "Lessons" });
    expect(el.className).toContain("text-[22px]");
  });

  it("renders the requested tag and size", () => {
    render(
      <Heading as="h1" size="xl">
        Good evening
      </Heading>,
    );
    const el = screen.getByRole("heading", { level: 1 });
    expect(el.className).toContain("text-[27px]");
  });
});
