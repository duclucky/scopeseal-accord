import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "./App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("ScopeSeal product experience", () => {
  it("keeps the complete product navigation available from a deep route", () => {
    renderAt("/agreements/AGR-001/negotiate");

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(navigation).toHaveTextContent("Home");
    expect(navigation).toHaveTextContent("New agreement");
    expect(navigation).toHaveTextContent("Activity");
    expect(navigation).toHaveTextContent("Account");
    expect(navigation).toHaveTextContent("Help");
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
  });

  it("uses the approved decorative logo without duplicating the brand name", () => {
    renderAt("/");

    const brand = screen.getByRole("link", { name: "ScopeSeal Accord home" });
    const logo = brand.querySelector("img");
    expect(logo).toHaveAttribute("src", "/scopeseal-logo.svg");
    expect(logo).toHaveAttribute("alt", "");
    expect(logo).toHaveAttribute("width", "32");
    expect(logo).toHaveAttribute("height", "32");
  });

  it("explains the trust job and offers a real next destination", () => {
    renderAt("/");

    expect(screen.getByText(/Neither sponsor nor contractor decides alone/i)).toBeVisible();
    expect(screen.getByRole("link", { name: "Create a 2 GEN agreement" })).toHaveAttribute(
      "href",
      "/agreements/new",
    );
    expect(screen.getByText(/No agreement data is shown until canonical state is available/i)).toBeVisible();
  });

  it("presents a bounded sponsor form with an honest disconnected action", () => {
    renderAt("/agreements/new");

    expect(screen.getByLabelText("Contractor wallet address")).toBeRequired();
    expect(screen.getByLabelText("Original TED publication number")).toBeRequired();
    expect(screen.getByLabelText("Original notice UUID")).toBeRequired();
    expect(screen.getByLabelText("Original notice version")).toBeRequired();
    expect(screen.getByLabelText("Buyer identifier")).toBeRequired();
    expect(screen.getByLabelText("Procedure identifier")).toBeRequired();
    expect(screen.getByLabelText("Contract reference")).toBeRequired();
    expect(screen.getByLabelText("Locked semantic allowance")).toBeRequired();
    expect(screen.getByText("2 GEN")).toBeVisible();
    expect(screen.getByRole("button", { name: "Connect wallet to create" })).toBeEnabled();
  });

  it("does not present fixture agreement data as canonical", () => {
    renderAt("/agreements/AGR-001");

    expect(screen.getByText(/Canonical agreement state is not connected/i)).toBeVisible();
    expect(screen.queryByRole("link", { name: "Open TED" })).not.toBeInTheDocument();
  });

  it("provides honest empty states for negotiation, activity, and account", () => {
    const negotiation = renderAt("/agreements/AGR-001/negotiate");
    expect(screen.getByText(/No canonical negotiation is loaded/i)).toBeVisible();
    negotiation.unmount();

    const activity = renderAt("/activity");
    expect(screen.getByText(/Connect a wallet to load your canonical activity/i)).toBeVisible();
    activity.unmount();

    renderAt("/account");
    expect(screen.getByText(/No wallet connected/i)).toBeVisible();
    expect(screen.getByRole("button", { name: "Open wallet picker" })).toBeEnabled();
  });

  it("states the evidence and legal limits on the help page", () => {
    renderAt("/help");

    expect(screen.getByRole("heading", { name: "Official evidence only" })).toBeVisible();
    expect(screen.getByText(/does not decide legal compliance or physical performance/i)).toBeVisible();
    expect(screen.getByText(/UNVERIFIABLE/i)).toBeVisible();
  });
});
