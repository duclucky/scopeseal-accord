import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WalletControls } from "./WalletControls";
import { WalletProvider } from "./WalletProvider";
import type { DetectedWallet, Eip1193Provider } from "./types";

function wallet(id: string, name: string, address: string) {
  const provider: Eip1193Provider = {
    request: vi.fn().mockImplementation(({ method }) => {
      if (method === "eth_requestAccounts") return Promise.resolve([address]);
      return Promise.resolve(null);
    }),
  };
  return { id, name, provider, source: "eip6963" as const } satisfies DetectedWallet;
}

describe("WalletProvider", () => {
  it("shows every detected wallet and requests accounts only from the explicit selection", async () => {
    const user = userEvent.setup();
    const first = wallet("first", "First Wallet", "0x1111111111111111111111111111111111111111");
    const second = wallet("second", "Second Wallet", "0x2222222222222222222222222222222222222222");

    render(
      <WalletProvider discover={async () => [first, second]}>
        <WalletControls />
      </WalletProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Connect a wallet" }));
    const dialog = await screen.findByRole("dialog", { name: "Choose a wallet" });
    expect(dialog).toBeVisible();
    expect(dialog.parentElement?.parentElement).toBe(document.body);
    expect(screen.getByRole("button", { name: "First Wallet" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Second Wallet" })).toBeVisible();
    expect(first.provider.request).not.toHaveBeenCalled();
    expect(second.provider.request).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Second Wallet" }));
    expect(second.provider.request).toHaveBeenCalledWith({ method: "eth_requestAccounts" });
    expect(first.provider.request).not.toHaveBeenCalled();
    expect(await screen.findByRole("button", { name: /0x2222/i })).toBeVisible();
  });

  it("disconnects from the clickable account menu and returns writes to a disabled state", async () => {
    const user = userEvent.setup();
    const selected = wallet("selected", "Selected Wallet", "0x3333333333333333333333333333333333333333");

    render(
      <WalletProvider discover={async () => [selected]}>
        <WalletControls />
      </WalletProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Connect a wallet" }));
    await user.click(await screen.findByRole("button", { name: "Selected Wallet" }));
    await user.click(await screen.findByRole("button", { name: /0x3333/i }));
    await user.click(screen.getByRole("button", { name: "Disconnect wallet" }));

    expect(screen.getByRole("button", { name: "Connect a wallet" })).toBeVisible();
    expect(screen.queryByText(/0x3333/i)).not.toBeInTheDocument();
  });
});
