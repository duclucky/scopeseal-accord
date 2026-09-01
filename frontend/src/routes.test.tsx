import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "./App";

const routes = [
  ["/", "Amendments without unilateral judgment"],
  ["/agreements/new", "Create an amendment agreement"],
  ["/agreements/AGR-001", "Agreement AGR-001"],
  ["/agreements/AGR-001/negotiate", "Resolve a material amendment"],
  ["/activity", "Your agreement activity"],
  ["/account", "Wallet and credits"],
  ["/help", "How ScopeSeal works"],
] as const;

describe("product routes", () => {
  it.each(routes)("renders %s as a real product destination", (path, heading) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  });
});
