import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { discoverWallets } from "./discovery";
import type { DetectedWallet } from "./types";

type WalletContextValue = {
  account: string | null;
  selectedWallet: DetectedWallet | null;
  wallets: DetectedWallet[];
  pickerOpen: boolean;
  discovering: boolean;
  error: string | null;
  openPicker: () => Promise<void>;
  closePicker: () => void;
  selectWallet: (wallet: DetectedWallet) => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

type WalletProviderProps = {
  children: ReactNode;
  discover?: () => Promise<DetectedWallet[]>;
};

export function WalletProvider({ children, discover = () => discoverWallets() }: WalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<DetectedWallet | null>(null);
  const [wallets, setWallets] = useState<DetectedWallet[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = useCallback(async () => {
    setPickerOpen(true);
    setDiscovering(true);
    setError(null);
    try {
      setWallets(await discover());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Wallet discovery failed");
    } finally {
      setDiscovering(false);
    }
  }, [discover]);

  const selectWallet = useCallback(async (wallet: DetectedWallet) => {
    setError(null);
    try {
      const result = await wallet.provider.request({ method: "eth_requestAccounts" });
      const accounts = Array.isArray(result) ? result.filter((item): item is string => typeof item === "string") : [];
      if (!accounts[0]) throw new Error("The selected wallet returned no account");
      setSelectedWallet(wallet);
      setAccount(accounts[0]);
      setPickerOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Wallet connection failed");
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setSelectedWallet(null);
    setWallets([]);
    setPickerOpen(false);
    setError(null);
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      account,
      selectedWallet,
      wallets,
      pickerOpen,
      discovering,
      error,
      openPicker,
      closePicker: () => setPickerOpen(false),
      selectWallet,
      disconnect,
    }),
    [account, selectedWallet, wallets, pickerOpen, discovering, error, openPicker, selectWallet, disconnect],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useWallet must be used inside WalletProvider");
  return value;
}
