import { PageState } from "../components/PageState";
import { useWallet } from "../wallet/WalletProvider";

export function AccountPage() {
  const { openPicker } = useWallet();

  return (
    <div className="page-layout">
      <header className="page-header">
        <p className="eyebrow">Account</p>
        <h1>Wallet and credits</h1>
        <p>Manage the selected provider, Studionet connection and canonical withdrawable credits.</p>
      </header>
      <PageState
        eyebrow="Disconnected"
        title="No wallet connected"
        action={(
          <button className="button button-accent" type="button" onClick={() => void openPicker()}>
            Open wallet picker
          </button>
        )}
      >
        <p>Select an installed EVM wallet explicitly. ScopeSeal never auto-picks a provider.</p>
      </PageState>
    </div>
  );
}
