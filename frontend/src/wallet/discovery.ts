import type {
  DetectedWallet,
  Eip1193Provider,
  Eip6963Announcement,
  WalletDiscoveryTarget,
} from "./types";

function injectedName(provider: Eip1193Provider, fallback: string) {
  if (provider.isRabby) return "Rabby Wallet";
  if (provider.isCoinbaseWallet) return "Coinbase Wallet";
  if (provider.isBraveWallet) return "Brave Wallet";
  if (provider.isMetaMask) return "MetaMask";
  return fallback;
}

function addWallet(
  wallets: DetectedWallet[],
  seenProviders: Set<Eip1193Provider>,
  wallet: DetectedWallet,
) {
  if (seenProviders.has(wallet.provider)) return;
  seenProviders.add(wallet.provider);
  wallets.push(wallet);
}

export async function discoverWallets(
  target: WalletDiscoveryTarget = window as unknown as WalletDiscoveryTarget,
  waitMs = 60,
): Promise<DetectedWallet[]> {
  const announced: DetectedWallet[] = [];
  const announcementListener: EventListener = (event) => {
    const detail = (event as CustomEvent<Eip6963Announcement>).detail;
    if (!detail?.provider || !detail.info?.uuid || !detail.info?.name) return;
    announced.push({
      id: detail.info.uuid,
      name: detail.info.name,
      icon: detail.info.icon,
      rdns: detail.info.rdns,
      provider: detail.provider,
      source: "eip6963",
    });
  };

  target.addEventListener("eip6963:announceProvider", announcementListener);
  target.dispatchEvent(new Event("eip6963:requestProvider"));
  await new Promise<void>((resolve) => globalThis.setTimeout(resolve, waitMs));
  target.removeEventListener("eip6963:announceProvider", announcementListener);

  const wallets: DetectedWallet[] = [];
  const seenProviders = new Set<Eip1193Provider>();
  announced.forEach((wallet) => addWallet(wallets, seenProviders, wallet));

  const injectedProviders = target.ethereum?.providers?.length
    ? target.ethereum.providers
    : target.ethereum
      ? [target.ethereum]
      : [];
  injectedProviders.forEach((provider, index) =>
    addWallet(wallets, seenProviders, {
      id: `injected-${index}`,
      name: injectedName(provider, "Injected wallet"),
      provider,
      source: "injected",
    }),
  );

  const namedFallbacks: Array<[string, string, Eip1193Provider | undefined]> = [
    ["okx", "OKX Wallet", target.okxwallet],
    ["rabby", "Rabby Wallet", target.rabby],
    ["coinbase", "Coinbase Wallet", target.coinbaseWalletExtension],
  ];
  namedFallbacks.forEach(([id, name, provider]) => {
    if (!provider) return;
    addWallet(wallets, seenProviders, { id, name, provider, source: "injected" });
  });

  return wallets;
}
