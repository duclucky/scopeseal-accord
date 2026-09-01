import { PageState } from "../components/PageState";

export function ActivityPage() {
  return (
    <div className="page-layout">
      <header className="page-header">
        <p className="eyebrow">Your work</p>
        <h1>Your agreement activity</h1>
        <p>Follow submitted transactions, finalized decisions and withdrawals by agreement.</p>
      </header>
      <PageState eyebrow="Wallet required" title="Connect a wallet to load your canonical activity">
        <p>ScopeSeal does not infer activity from browser storage or show sample transactions as real.</p>
      </PageState>
    </div>
  );
}
