import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useContractAdapter } from "../adapters/ContractAdapterProvider";
import { TransactionStatus } from "../components/TransactionStatus";
import { useTransactions } from "../transactions/TransactionProvider";
import { useWallet } from "../wallet/WalletProvider";


function utc(value: FormDataEntryValue | null) {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new Error("Enter a valid deadline.");
  return date.toISOString().replace(/\.\d{3}Z$/u, "Z");
}


export function NewAgreementPage() {
  const adapter = useContractAdapter();
  const { account, openPicker } = useWallet();
  const { run } = useTransactions();
  const navigate = useNavigate();
  const [agreementId, setAgreementId] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account || !adapter.configuration.writeConfigured) {
      void openPicker();
      return;
    }
    const data = new FormData(event.currentTarget);
    const id = String(data.get("agreementId"));
    setAgreementId(id);
    void run({
      label: "Create 2 GEN agreement",
      submit: () => adapter.createAgreement({
        id,
        contractor: String(data.get("contractor")),
        originalPublication: String(data.get("originalPublication")),
        originalNoticeUuid: String(data.get("originalNoticeUuid")),
        originalNoticeVersion: String(data.get("originalNoticeVersion")),
        buyerId: String(data.get("buyerId")),
        procedureId: String(data.get("procedureId")),
        contractReference: String(data.get("contractReference")),
        canonicalObjective: String(data.get("canonicalObjective")),
        allowance: String(data.get("allowance")),
        ratificationDeadline: utc(data.get("ratificationDeadline")),
        reviewDeadline: utc(data.get("reviewDeadline")),
        negotiationWindowSeconds: Number(data.get("negotiationHours")) * 3600,
      }),
      waitForAccepted: adapter.waitForAccepted,
      waitForFinality: adapter.waitForFinality,
      reload: async () => { await adapter.getAgreement(id); navigate(`/agreements/${id}`); },
    });
  };

  return (
    <div className="page-layout form-page">
      <header className="page-header">
        <p className="eyebrow">Sponsor workflow</p>
        <h1>Create an amendment agreement</h1>
        <p>Lock the authority bindings and scope allowance the contractor will explicitly accept.</p>
      </header>

      <form className="agreement-form" onSubmit={submit}>
        <fieldset>
          <legend>Parties and official baseline</legend>
          <label>
            Agreement ID
            <input name="agreementId" autoComplete="off" required pattern="[A-Za-z0-9._-]{3,80}" />
          </label>
          <label>
            Contractor wallet address
            <input name="contractor" autoComplete="off" required placeholder="0x..." />
          </label>
          <div className="form-grid">
            <label>
              Original TED publication number
              <input name="originalPublication" required placeholder="190662-2025" />
            </label>
            <label>
              Original notice UUID
              <input name="originalNoticeUuid" required placeholder="6480e4d5-6f07-4b83-8097-5756d8fbf527" />
            </label>
            <label>
              Original notice version
              <input name="originalNoticeVersion" required pattern="[0-9]{2}" placeholder="01" />
            </label>
            <label>
              Buyer identifier
              <input name="buyerId" required />
            </label>
            <label>
              Procedure identifier
              <input name="procedureId" required />
            </label>
            <label>
              Contract reference
              <input name="contractReference" required placeholder="CON-0001" />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Semantic allowance</legend>
          <label>
            Canonical objective
            <textarea name="canonicalObjective" required rows={3} />
          </label>
          <label>
            Locked semantic allowance
            <textarea
              name="allowance"
              required
              rows={6}
              placeholder="Define the same-objective, facility, location and restoration or safety envelope."
            />
          </label>
          <p className="field-help">
            This text cannot be changed after the contractor ratifies it. It is not a legal-compliance rubric.
          </p>
        </fieldset>

        <fieldset>
          <legend>Deadlines</legend>
          <div className="form-grid">
            <label>
              Ratification deadline
              <input name="ratificationDeadline" type="datetime-local" required />
            </label>
            <label>
              Review deadline
              <input name="reviewDeadline" type="datetime-local" required />
            </label>
            <label>
              Negotiation window in hours
              <input name="negotiationHours" type="number" min="1" max="168" required />
            </label>
          </div>
        </fieldset>

        <aside className="value-summary" aria-label="Locked payment summary">
          <div>
            <span>Agreement payment</span>
            <output>2 GEN</output>
          </div>
          <p>Sent only through the selected EVM wallet after the current network is confirmed.</p>
        </aside>

        <TransactionStatus />
        {account && adapter.configuration.writeConfigured ? (
          <button className="button button-accent" type="submit">Create and fund with 2 GEN</button>
        ) : (
          <button className="button button-accent" type="button" onClick={() => void openPicker()}>Connect wallet to create</button>
        )}
        {agreementId ? <span className="sr-only">Preparing {agreementId}</span> : null}
      </form>
    </div>
  );
}
