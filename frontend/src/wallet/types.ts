export type ProviderRequest = {
  method: string;
  params?: readonly unknown[] | object;
};

export type Eip1193Provider = {
  request: (args: ProviderRequest) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
  providers?: Eip1193Provider[];
  isMetaMask?: boolean;
  isRabby?: boolean;
  isCoinbaseWallet?: boolean;
  isBraveWallet?: boolean;
};

export type WalletDiscoveryTarget = EventTarget & {
  ethereum?: Eip1193Provider;
  okxwallet?: Eip1193Provider;
  rabby?: Eip1193Provider;
  coinbaseWalletExtension?: Eip1193Provider;
};

export type DetectedWallet = {
  id: string;
  name: string;
  icon?: string;
  rdns?: string;
  provider: Eip1193Provider;
  source: "eip6963" | "injected";
};

export type Eip6963Announcement = {
  info: {
    uuid: string;
    name: string;
    icon?: string;
    rdns?: string;
  };
  provider: Eip1193Provider;
};
