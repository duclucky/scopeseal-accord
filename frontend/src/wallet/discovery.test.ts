import { describe, expect, it, vi } from "vitest";
import { discoverWallets } from "./discovery";
import type { Eip1193Provider, WalletDiscoveryTarget } from "./types";

function provider(): Eip1193Provider {
  return { request: vi.fn() };
}

describe("wallet discovery", () => {
  it("collects EIP-6963 announcements and injected fallbacks without duplicates", async () => {
    const target = new EventTarget() as WalletDiscoveryTarget;
    const announced = provider();
    const okx = provider();
    const shared = provider();
    target.ethereum = { providers: [shared] } as Eip1193Provider & { providers: Eip1193Provider[] };
    target.okxwallet = okx;
    target.rabby = shared;

    target.addEventListener("eip6963:requestProvider", () => {
      target.dispatchEvent(
        new CustomEvent("eip6963:announceProvider", {
          detail: {
            info: { uuid: "wallet-1", name: "Civic Wallet", icon: "data:image/svg+xml,<svg/>", rdns: "org.civic.wallet" },
            provider: announced,
          },
        }),
      );
    });

    const wallets = await discoverWallets(target, 0);

    expect(wallets.map((wallet) => wallet.name)).toEqual([
      "Civic Wallet",
      "Injected wallet",
      "OKX Wallet",
    ]);
    expect(new Set(wallets.map((wallet) => wallet.provider)).size).toBe(3);
  });
});
