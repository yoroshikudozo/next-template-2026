import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the getting started heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /to get started/i }),
    ).toBeInTheDocument();
  });

  it("links to the Next.js learning center", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /learning/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("nextjs.org/learn"));
  });
});
