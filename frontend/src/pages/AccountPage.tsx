import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContractAdapter } from "../adapters/ContractAdapterProvider";
import { PageState } from "../components/PageState";
import type { Agreement } from "../domain/types";
import { useWallet } from "../wallet/WalletProvider";


export function AccountPage() {
  const { account, openPicker } = useWallet();
  const adapter = useContractAdapter();
  const [credits, setCredits] = useState<Array<{ agreement: Agreement; credit: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!account || !adapter.configuration.readConfigured) return;
    void adapter.listAgreements(account).then(async (agreements) => Promise.all(agreements.map(async (agreement) => ({ agreement, credit: await adapter.getCredit(agreement.id, account) })))).then((value) => { setCredits(value); setError(null); }).catch((cause) => setError(cause instanceof Error ? cause.message : "Canonical credit read failed."));
  }, [account, adapter]);
  return <div className="page-layout"><header className="page-header"><p className="eyebrow">Account</p><h1>Wallet and credits</h1><p>Canonical withdrawable credits are scoped to each agreement.</p></header>{!account ? <PageState eyebrow="Disconnected" title="No wallet connected" action={<button className="button button-accent" type="button" onClick={() => void openPicker()}>Open wallet picker</button>}><p>Select an installed EVM wallet explicitly. ScopeSeal never auto-picks a provider.</p></PageState> : error ? <PageState eyebrow="Read failed" title={error}><p>No credit is presented until the canonical read succeeds.</p></PageState> : <section className="agreement-list" aria-label="Agreement credits">{credits.length === 0 ? <p>No canonical credit is indexed for this account.</p> : credits.map(({ agreement, credit }) => <article key={agreement.id}><div><p className="eyebrow">{agreement.state}</p><h2>{credit} GEN available</h2><p>{agreement.id}</p></div><Link className="button button-secondary" to={`/agreements/${agreement.id}`}>Review and withdraw</Link></article>)}</section>}</div>;
}
