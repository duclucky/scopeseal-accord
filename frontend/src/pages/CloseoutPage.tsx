import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContractAdapter } from "../adapters/ContractAdapterProvider";
import { PageState } from "../components/PageState";
import { TransactionStatus } from "../components/TransactionStatus";
import type { Agreement, Closeout } from "../domain/types";
import { useTransactions } from "../transactions/TransactionProvider";
import { useWallet } from "../wallet/WalletProvider";

const stages = ["Fund", "Ratify", "Review", "Resolve", "Withdraw"];

export function CloseoutPage() {
  const { agreementId = "" } = useParams();
  const adapter = useContractAdapter();
  const { account } = useWallet();
  const { run, state: transaction } = useTransactions();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [closeout, setCloseout] = useState<Closeout | null>(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lotId, setLotId] = useState("LOT-0001");
  const [standard, setStandard] = useState("Release retention when the official completion notice confirms final payment and no penalty.");
  const [ratifyDeadline, setRatifyDeadline] = useState("");
  const [reviewDeadline, setReviewDeadline] = useState("");
  const [publication, setPublication] = useState("");
  const [allocation, setAllocation] = useState<0 | 1>(1);

  const reload = useCallback(async () => {
    try {
      const nextAgreement = await adapter.getAgreement(agreementId);
      setAgreement(nextAgreement);
      try { const next = await adapter.getCloseout(agreementId); setCloseout(next); setMissing(next === null); }
      catch (cause) { if (cause instanceof Error && /not found|missing key/iu.test(cause.message)) { setCloseout(null); setMissing(true); } else throw cause; }
      setError(null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Canonical closeout read failed."); }
  }, [adapter, agreementId]);
  useEffect(() => { if (adapter.configuration.readConfigured) void reload(); }, [adapter.configuration.readConfigured, reload]);
  const transact = (label: string, submit: () => Promise<{ hash: string }>) => void run({ label, submit, waitForAccepted: adapter.waitForAccepted, waitForFinality: adapter.waitForFinality, reload });
  if (!adapter.configuration.readConfigured) return <div className="page-layout"><header className="page-header"><p className="eyebrow">Completion retention</p><h1>Completion retention closeout</h1></header><PageState eyebrow="Connection required" title="Canonical closeout state is not connected"><p>Configure a deployed contract before using this workflow.</p></PageState></div>;
  if (!agreement) return <div className="page-layout"><PageState eyebrow={error ? "Read failed" : "Canonical read"} title={error ?? "Loading completion closeout"}><button className="button button-secondary" type="button" onClick={() => void reload()}>Retry canonical read</button></PageState></div>;
  const key = account?.toLowerCase(); const sponsor = key === agreement.sponsor.toLowerCase(); const contractor = key === agreement.contractor.toLowerCase();
  const canWrite = adapter.configuration.writeConfigured && transaction.phase !== "submitting" && transaction.phase !== "submitted" && transaction.phase !== "accepted";
  const stage = !closeout ? 0 : closeout.state === "OFFERED" ? 1 : ["ACTIVE", "RETRYABLE"].includes(closeout.state) ? 2 : closeout.state === "NEGOTIATION" ? 3 : 4;
  return <div className="page-layout">
    <header className="page-header"><p className="eyebrow">Agreement {agreement.id}</p><h1>Completion retention closeout</h1><p>Resolve a separate 1 GEN retention from official TED completion evidence.</p></header>
    <ol className="stage-list" aria-label="Closeout progress">{stages.map((item, index) => <li key={item} aria-current={index === stage ? "step" : undefined} className={index <= stage ? "stage-active" : ""}>{item}</li>)}</ol>
    {closeout ? <section className="canonical-card" aria-label="Canonical closeout state"><dl className="canonical-grid"><div><dt>State</dt><dd>{closeout.state}</dd></div><div><dt>Verdict</dt><dd>{closeout.verdict || "Not decided"}</dd></div><div><dt>Locked</dt><dd>{closeout.lockedGen} GEN</dd></div><div><dt>Lot</dt><dd>{closeout.lotId}</dd></div><div><dt>Sponsor credit</dt><dd>{closeout.sponsorCreditGen} GEN</dd></div><div><dt>Contractor credit</dt><dd>{closeout.contractorCreditGen} GEN</dd></div></dl><h2>Locked release standard</h2><p>{closeout.completionStandard}</p></section> : null}
    <section className="action-panel" aria-labelledby="closeout-action"><p className="eyebrow">Role and state gated</p><h2 id="closeout-action">Available action</h2>
      {error ? <p className="inline-notice" role="alert">{error}</p> : null}
      {missing && agreement.state !== "CLOSED" ? <p>The agreement must be CLOSED before its sponsor can fund a closeout.</p> : null}
      {missing && agreement.state === "CLOSED" && sponsor ? <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); transact("Fund completion closeout", () => adapter.openCloseout({ agreementId, lotId, completionStandard: standard, ratificationDeadline: new Date(String(data.get("ratificationDeadline"))).toISOString(), reviewDeadline: new Date(String(data.get("reviewDeadline"))).toISOString(), negotiationWindowSeconds: 3600 })); }}><label>TED lot ID<input value={lotId} onChange={(event) => setLotId(event.target.value)} required /></label><label>Completion release standard<textarea value={standard} onChange={(event) => setStandard(event.target.value)} minLength={20} required /></label><label>Ratification deadline<input name="ratificationDeadline" type="datetime-local" value={ratifyDeadline} onChange={(event) => setRatifyDeadline(event.target.value)} required /></label><label>Review deadline<input name="reviewDeadline" type="datetime-local" value={reviewDeadline} onChange={(event) => setReviewDeadline(event.target.value)} required /></label><p className="field-help">This transaction locks exactly 1 GEN. TED amounts never set the GEN allocation.</p><button className="button button-accent" disabled={!canWrite} type="submit">Fund 1 GEN closeout</button></form> : null}
      {closeout?.state === "OFFERED" && contractor ? <button className="button button-accent" disabled={!canWrite} type="button" onClick={() => transact("Ratify closeout", () => adapter.ratifyCloseout(agreementId))}>Ratify locked standard</button> : null}
      {closeout && ["ACTIVE", "RETRYABLE"].includes(closeout.state) && (sponsor || contractor) ? <form onSubmit={(event) => { event.preventDefault(); transact("Review official completion", () => adapter.reviewCloseout(agreementId, publication)); }}><label>Completion TED publication<input value={publication} onChange={(event) => setPublication(event.target.value)} pattern="[0-9]{8}-[0-9]{4}" required /></label><button className="button button-accent" disabled={!canWrite} type="submit">{closeout.state === "RETRYABLE" ? "Retry official review" : "Request official review"}</button></form> : null}
      {closeout?.state === "NEGOTIATION" && sponsor ? <form onSubmit={(event) => { event.preventDefault(); transact("Propose closeout allocation", () => adapter.proposeCloseoutAllocation(agreementId, allocation)); }}><label>Contractor allocation<select value={allocation} onChange={(event) => setAllocation(Number(event.target.value) as 0 | 1)}><option value={1}>1 GEN to contractor</option><option value={0}>0 GEN to contractor</option></select></label><button className="button button-accent" disabled={!canWrite} type="submit">Propose allocation</button></form> : null}
      {closeout?.state === "NEGOTIATION" && contractor && closeout.proposalNonce > 0 ? <button className="button button-accent" disabled={!canWrite} type="button" onClick={() => transact("Accept closeout allocation", () => adapter.acceptCloseoutAllocation(agreementId, closeout.proposalNonce))}>Accept proposal #{closeout.proposalNonce}</button> : null}
      {closeout && ["OFFERED", "ACTIVE", "RETRYABLE", "NEGOTIATION"].includes(closeout.state) && sponsor ? <button className="button button-secondary" disabled={!canWrite} type="button" onClick={() => transact("Recover expired closeout", () => adapter.recoverCloseout(agreementId))}>Recover after expiry</button> : null}
      {closeout?.state === "SETTLED" && ((sponsor && closeout.sponsorCreditGen > 0) || (contractor && closeout.contractorCreditGen > 0)) ? <button className="button button-accent" disabled={!canWrite} type="button" onClick={() => transact("Withdraw closeout credit", () => adapter.withdrawCloseoutCredit(agreementId))}>Withdraw closeout credit</button> : null}
      {!sponsor && !contractor ? <p>This account is an observer; write controls remain hidden.</p> : null}<TransactionStatus />
    </section><Link className="text-link" to={`/agreements/${agreementId}`}>Back to agreement</Link>
  </div>;
}
