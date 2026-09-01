import { Link, useParams } from "react-router-dom";
import { PageState } from "../components/PageState";

export function NegotiationPage() {
  const { agreementId } = useParams();

  return (
    <div className="page-layout">
      <header className="page-header">
        <p className="eyebrow">Material amendment workflow</p>
        <h1>Resolve a material amendment</h1>
        <p>Every accepted allocation must conserve the agreement's full 2 GEN.</p>
      </header>
      <PageState
        eyebrow="Canonical state required"
        title="No canonical negotiation is loaded"
        action={<Link className="button button-secondary" to={`/agreements/${agreementId}`}>Back to agreement</Link>}
      >
        <p>
          Proposal and acceptance controls appear only for the eligible wallet during an open
          negotiation window. Expired or settled agreements remain read-only.
        </p>
      </PageState>
    </div>
  );
}
