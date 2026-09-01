import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContractAdapter } from "../adapters/ContractAdapterProvider";
import { PageState } from "../components/PageState";
import type { Agreement } from "../domain/types";
import { useWallet } from "../wallet/WalletProvider";


export function ActivityPage() {
  const { account, openPicker } = useWallet();
  const adapter = useContractAdapter();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!account || !adapter.configuration.readConfigured) return;
    void adapter.listAgreements(account).then(setAgreements).catch((cause) => setError(cause instanceof Error ? cause.message : "Canonical activity read failed."));
  }, [account, adapter]);
  return <div className="page-layout"><header className="page-header"><p className="eyebrow">Your work</p><h1>Your agreement activity</h1><p>Canonical state only; browser storage is never the source.</p></header>{!account ? <PageState eyebrow="Wallet required" title="Connect a wallet to load your canonical activity" action={<button className="button button-accent" type="button" onClick={() => void openPicker()}>Open wallet picker</button>}><p>ScopeSeal does not show sample transactions as real.</p></PageState> : error ? <PageState eyebrow="Read failed" title={error}><p>Retry by reloading this canonical activity view.</p></PageState> : agreements.length === 0 ? <PageState eyebrow="Canonical empty state" title="No agreements found for this account"><p>The contract account index returned no agreement IDs.</p></PageState> : <section className="agreement-list" aria-label="Canonical agreements">{agreements.map((agreement) => <article key={agreement.id}><div><p className="eyebrow">{agreement.state}</p><h2>{agreement.id}</h2><p>{agreement.verdict || "Awaiting official review"} · {agreement.lockedGen} GEN locked</p></div><Link className="button button-secondary" to={`/agreements/${agreement.id}`}>Open agreement</Link></article>)}</section>}</div>;
}
