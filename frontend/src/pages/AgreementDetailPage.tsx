import { ArrowSquareOut } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContractAdapter } from "../adapters/ContractAdapterProvider";
import { PageState } from "../components/PageState";
import { TransactionStatus } from "../components/TransactionStatus";
import type { Agreement } from "../domain/types";
import { useTransactions } from "../transactions/TransactionProvider";
import { useWallet } from "../wallet/WalletProvider";


export function AgreementDetailPage() {
  const { agreementId = "" } = useParams();
  const adapter = useContractAdapter();
  const { account } = useWallet();
  const { run } = useTransactions();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modification, setModification] = useState("");

  const reload = useCallback(async () => {
    if (!adapter.configuration.readConfigured) return;
    try {
      setAgreement(await adapter.getAgreement(agreementId));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Canonical agreement read failed.");
    }
  }, [adapter, agreementId]);

  useEffect(() => { void reload(); }, [reload]);

  const transact = (label: string, submit: () => ReturnType<typeof adapter.ratifyAgreement>) => void run({
    label, submit, waitForAccepted: adapter.waitForAccepted, waitForFinality: adapter.waitForFinality, reload,
  });

  if (!adapter.configuration.readConfigured) {
    return <div className="page-layout"><header className="page-header"><p className="eyebrow">Canonical agreement</p><h1>Agreement {agreementId}</h1></header><PageState eyebrow="Connection required" title="Canonical agreement state is not connected"><p>Configure the deployed contract to load state. No browser fixture is presented as canonical.</p></PageState></div>;
  }

  if (!agreement) {
    return <div className="page-layout"><PageState eyebrow={error ? "Read failed" : "Canonical read"} title={error ?? "Loading agreement state"}><button className="button button-secondary" type="button" onClick={() => void reload()}>Retry canonical read</button></PageState></div>;
  }

  const accountKey = account?.toLowerCase();
  const sponsor = accountKey === agreement.sponsor.toLowerCase();
  const contractor = accountKey === agreement.contractor.toLowerCase();
  const canWrite = adapter.configuration.writeConfigured;

  return (
    <div className="page-layout">
      <header className="page-header split-heading">
        <div><p className="eyebrow">Canonical agreement · {agreement.state}</p><h1>Agreement {agreement.id}</h1></div>
        <a className="button button-secondary" href={`https://ted.europa.eu/en/notice/-/detail/${agreement.originalPublication}`} target="_blank" rel="noreferrer">Open TED <ArrowSquareOut size={19} aria-hidden="true" /></a>
      </header>
      <section className="canonical-card" aria-label="Canonical agreement state">
        <dl className="canonical-grid">
          <div><dt>State</dt><dd>{agreement.state}</dd></div><div><dt>Verdict</dt><dd>{agreement.verdict || "Not decided"}</dd></div>
          <div><dt>Locked</dt><dd>{agreement.lockedGen} GEN</dd></div><div><dt>Your role</dt><dd>{sponsor ? "Sponsor" : contractor ? "Contractor" : "Observer"}</dd></div>
          <div><dt>Original notice</dt><dd>{agreement.originalPublication}</dd></div><div><dt>Modification</dt><dd>{agreement.modificationPublication || "Not locked"}</dd></div>
          <div><dt>Sponsor credit</dt><dd>{agreement.sponsorCreditGen} GEN</dd></div><div><dt>Contractor credit</dt><dd>{agreement.contractorCreditGen} GEN</dd></div>
        </dl>
        <h2>Locked allowance</h2><p>{agreement.allowance}</p>
      </section>
      <section className="action-panel" aria-labelledby="available-action-title">
        <p className="eyebrow">Role and state gated</p><h2 id="available-action-title">Available action</h2>
        {!canWrite ? <p>Connect the eligible wallet to enable a write.</p> : null}
        {agreement.state === "DRAFT" && contractor ? <button className="button button-accent" type="button" disabled={!canWrite} onClick={() => transact("Ratify agreement", () => adapter.ratifyAgreement(agreement.id))}>Ratify locked terms</button> : null}
        {["ACTIVE", "RETRYABLE"].includes(agreement.state) && (sponsor || contractor) ? <form onSubmit={(event) => { event.preventDefault(); transact("Review official amendment", () => adapter.reviewModification(agreement.id, modification)); }}><label>Modification TED publication<input value={modification} onChange={(event) => setModification(event.target.value)} required pattern="[0-9]{8}-[0-9]{4}" /></label><button className="button button-accent" type="submit" disabled={!canWrite}>{agreement.state === "RETRYABLE" ? "Retry official review" : "Request official review"}</button></form> : null}
        {agreement.state === "NEGOTIATION" ? <Link className="button button-accent" to={`/agreements/${agreement.id}/negotiate`}>Open negotiation</Link> : null}
        {["DRAFT", "ACTIVE", "RETRYABLE", "NEGOTIATION"].includes(agreement.state) && sponsor ? <button className="button button-secondary" type="button" disabled={!canWrite} onClick={() => transact("Recover expired agreement", () => adapter.recoverExpired(agreement.id))}>Recover after expiry</button> : null}
        {agreement.state === "SETTLED" && ((sponsor && agreement.sponsorCreditGen > 0) || (contractor && agreement.contractorCreditGen > 0)) ? <button className="button button-accent" type="button" disabled={!canWrite} onClick={() => transact("Withdraw canonical credit", () => adapter.withdrawCredit(agreement.id))}>Withdraw credit</button> : null}
        {!sponsor && !contractor ? <p>This connected account is an observer. System controls remain hidden.</p> : null}
        <TransactionStatus />
      </section>
    </div>
  );
}
