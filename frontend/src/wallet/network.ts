import type { Eip1193Provider } from "./types";

export type WalletChain = {
  chainId: string;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  blockExplorerUrls: string[];
};

const configuredWalletRpc = import.meta.env.VITE_GENLAYER_WALLET_RPC_URL?.trim();

export const STUDIONET_WALLET_CHAIN: WalletChain = {
  chainId: "0xf22f",
  chainName: import.meta.env.VITE_GENLAYER_WALLET_CHAIN_NAME?.trim() || "GenLayer Studionet",
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: configuredWalletRpc ? [configuredWalletRpc] : [],
  blockExplorerUrls: [
    import.meta.env.VITE_GENLAYER_EXPLORER_URL?.trim() || "https://explorer-studio.genlayer.com",
  ],
};

function errorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return Number((error as { code: unknown }).code);
  }
  return undefined;
}

export async function ensureWalletChain(provider: Eip1193Provider, chain = STUDIONET_WALLET_CHAIN) {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain.chainId }],
    });
  } catch (error) {
    if (errorCode(error) !== 4902) throw error;
    if (chain.rpcUrls.length === 0) {
      throw new Error("Wallet-compatible Studionet RPC is not configured");
    }
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [chain],
    });
  }
}
