import { Route, Routes } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { ContractAdapterProvider } from "./adapters/ContractAdapterProvider";
import type { ContractAdapter } from "./adapters/contract";
import { unconfiguredContract } from "./adapters/unconfiguredContract";
import { AppShell } from "./components/AppShell";
import { AccountPage } from "./pages/AccountPage";
import { ActivityPage } from "./pages/ActivityPage";
import { AgreementDetailPage } from "./pages/AgreementDetailPage";
import { HelpPage } from "./pages/HelpPage";
import { HomePage } from "./pages/HomePage";
import { NegotiationPage } from "./pages/NegotiationPage";
import { NewAgreementPage } from "./pages/NewAgreementPage";
import { TransactionProvider } from "./transactions/TransactionProvider";
import { WalletProvider } from "./wallet/WalletProvider";
import { useWallet } from "./wallet/WalletProvider";
import type { DetectedWallet } from "./wallet/types";

function RuntimeContractProvider({ children, override }: { children: ReactNode; override?: ContractAdapter }) {
  const { account, selectedWallet } = useWallet();
  const address = import.meta.env.VITE_CONTRACT_ADDRESS?.trim();
  const [runtimeAdapter, setRuntimeAdapter] = useState<ContractAdapter>(override ?? unconfiguredContract);
  useEffect(() => {
    let active = true;
    if (override) {
      setRuntimeAdapter(override);
      return () => { active = false; };
    }
    if (!address) {
      setRuntimeAdapter(unconfiguredContract);
      return () => { active = false; };
    }
    void import("./adapters/genlayerContract").then(({ createGenLayerContractAdapter }) => {
      if (!active) return;
      try {
        setRuntimeAdapter(createGenLayerContractAdapter({ contractAddress: address, account: account ?? undefined, provider: selectedWallet?.provider, icReadPath: "/genlayer-rpc" }));
      } catch {
        setRuntimeAdapter(unconfiguredContract);
      }
    });
    return () => { active = false; };
  }, [override, address, account, selectedWallet]);
  const adapter = override ?? runtimeAdapter;
  return <ContractAdapterProvider adapter={adapter}>{children}</ContractAdapterProvider>;
}

export function App({ adapter, discoverWallets }: { adapter?: ContractAdapter; discoverWallets?: () => Promise<DetectedWallet[]> } = {}) {
  return (
    <WalletProvider discover={discoverWallets}>
      <RuntimeContractProvider override={adapter}>
        <TransactionProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="agreements/new" element={<NewAgreementPage />} />
              <Route path="agreements/:agreementId" element={<AgreementDetailPage />} />
              <Route path="agreements/:agreementId/negotiate" element={<NegotiationPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="help" element={<HelpPage />} />
            </Route>
          </Routes>
        </TransactionProvider>
      </RuntimeContractProvider>
    </WalletProvider>
  );
}
