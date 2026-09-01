import { Route, Routes } from "react-router-dom";
import { ContractAdapterProvider } from "./adapters/ContractAdapterProvider";
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

export function App() {
  return (
    <WalletProvider>
      <ContractAdapterProvider>
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
      </ContractAdapterProvider>
    </WalletProvider>
  );
}
