import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContractAdapter } from "../adapters/ContractAdapterProvider";
import { PageState } from "../components/PageState";
import { TransactionStatus } from "../components/TransactionStatus";
import type { Agreement } from "../domain/types";
import { useTransactions } from "../transactions/TransactionProvider";
import { useWallet } from "../wallet/WalletProvider";


export function NegotiationPage() {
  const { agreementId = "" } = useParams();
  const adapter = useContractAdapter();
  const { account } = useWallet();
  const { run } = useTransactions();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [allocation, setAllocation] = useState<0 | 1 | 2>(1);
  const reload = useCallback(async () => setAgreement(await adapter.getAgreement(agreementId)), [adapter, agreementId]);
  useEffect(() => { if (adapter.configuration.readConfigured) void reload(); }, [adapter.configuration.readConfigured, reload]);
  const transact = (label: string, submit: () => ReturnType<typeof adapter.proposeAllocation>) => void run({ label, submit, waitForAccepted: adapter.waitForAccepted, waitForFinality: adapter.waitForFinality, reload });

  if (!agreement || agreement.state !== "NEGOTIATION") {
    return <div className="page-layout"><header className="page-header"><p className="eyebrow">Material amendment workflow</p><h1>Resolve a material amendment</h1></header><PageState eyebrow="Canonical state required" title="No canonical negotiation is loaded" action={<Link className="button button-secondary" to={`/agreements/${agreementId}`}>Back to agreement</Link>}><p>Controls appear only when the contract reports an open negotiation.</p></PageState></div>;
  }
  const sponsor = account?.toLowerCase() === agreement.sponsor.toLowerCase();
  const contractor = account?.toLowerCase() === agreement.contractor.toLowerCase();
  return <div className="page-layout"><header className="page-header"><p className="eyebrow">Material amendment workflow</p><h1>Resolve a material amendment</h1><p>Every accepted allocation conserves the agreement's full 2 GEN.</p></header><section className="action-panel"><p>Current proposal: {agreement.proposalNonce ? `${agreement.contractorAllocationGen} GEN to contractor · nonce ${agreement.proposalNonce}` : "None"}</p><p>Negotiation deadline: <time>{agreement.negotiationDeadline}</time></p>{sponsor ? <form onSubmit={(event) => { event.preventDefault(); transact("Propose 2 GEN allocation", () => adapter.proposeAllocation(agreement.id, allocation)); }}><label>Contractor allocation<select value={allocation} onChange={(event) => setAllocation(Number(event.target.value) as 0 | 1 | 2)}><option value={0}>0 GEN</option><option value={1}>1 GEN</option><option value={2}>2 GEN</option></select></label><button className="button button-accent" type="submit" disabled={!adapter.configuration.writeConfigured}>Propose allocation</button></form> : null}{contractor && agreement.proposalNonce ? <button className="button button-accent" type="button" disabled={!adapter.configuration.writeConfigured} onClick={() => transact("Accept allocation", () => adapter.acceptAllocation(agreement.id, agreement.proposalNonce!))}>Accept proposal nonce {agreement.proposalNonce}</button> : null}{!sponsor && !contractor ? <p>This account is an observer.</p> : null}<TransactionStatus /></section></div>;
}
