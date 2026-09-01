import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import globalCss from "./styles/global.css?raw";

describe("frontend accessibility contract", () => {
  it("keeps decorative navigation icons out of the accessibility tree", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/help"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    const decorativeIcons = container.querySelectorAll("nav svg");
    expect(decorativeIcons.length).toBeGreaterThan(0);
    decorativeIcons.forEach((icon) => expect(icon).toHaveAttribute("aria-hidden", "true"));
  });

  it("defines visible focus, touch targets, responsive wrapping and reduced motion", () => {
    expect(globalCss).toContain(":focus-visible");
    expect(globalCss).toMatch(/min-height:\s*44px/);
    expect(globalCss).toContain("overflow-wrap: anywhere");
    expect(globalCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globalCss).toContain("@media (max-width: 767px)");
  });
});
