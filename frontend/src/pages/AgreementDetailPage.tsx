import { ArrowSquareOut } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import { PageState } from "../components/PageState";

export function AgreementDetailPage() {
  const { agreementId } = useParams();

  return (
    <div className="page-layout">
      <header className="page-header split-heading">
        <div>
          <p className="eyebrow">Canonical agreement</p>
          <h1>Agreement {agreementId}</h1>
        </div>
        <a className="button button-secondary" href="https://ted.europa.eu/en/" target="_blank" rel="noreferrer">
          Open TED
          <ArrowSquareOut size={19} aria-hidden="true" />
        </a>
      </header>
      <PageState eyebrow="Connection required" title="Canonical agreement state is not connected">
        <p>
          Configure the deployed contract and connect a wallet to load current status, deadlines,
          official notice bindings, role-gated actions and GEN accounting.
        </p>
        <p>No static or locally stored agreement is presented as canonical.</p>
      </PageState>
    </div>
  );
}
