import { describe, expect, it, vi } from "vitest";
import { ensureWalletChain, STUDIONET_WALLET_CHAIN } from "./network";
import type { Eip1193Provider } from "./types";

describe("Studionet wallet network", () => {
  it("uses the verified 61999 chain identifier for switching", async () => {
    const request = vi.fn().mockResolvedValue(null);
    const wallet = { request } satisfies Eip1193Provider;

    await ensureWalletChain(wallet, { ...STUDIONET_WALLET_CHAIN, rpcUrls: ["https://wallet-rpc.example"] });

    expect(request).toHaveBeenCalledWith({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xf22f" }],
    });
  });

  it("adds the chain only after a 4902 switch error and requires a configured wallet RPC", async () => {
    const missing = Object.assign(new Error("Unknown chain"), { code: 4902 });
    const request = vi.fn().mockRejectedValueOnce(missing).mockResolvedValueOnce(null);
    const wallet = { request } satisfies Eip1193Provider;

    await ensureWalletChain(wallet, { ...STUDIONET_WALLET_CHAIN, rpcUrls: ["https://wallet-rpc.example"] });

    expect(request).toHaveBeenNthCalledWith(2, {
      method: "wallet_addEthereumChain",
      params: [expect.objectContaining({ chainId: "0xf22f", rpcUrls: ["https://wallet-rpc.example"] })],
    });

    const unconfigured = { request: vi.fn().mockRejectedValue(missing) } satisfies Eip1193Provider;
    await expect(
      ensureWalletChain(unconfigured, { ...STUDIONET_WALLET_CHAIN, rpcUrls: [] }),
    ).rejects.toThrow("Wallet-compatible Studionet RPC is not configured");
  });
});
