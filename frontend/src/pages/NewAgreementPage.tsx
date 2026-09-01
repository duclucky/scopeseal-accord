export function NewAgreementPage() {
  return (
    <div className="page-layout form-page">
      <header className="page-header">
        <p className="eyebrow">Sponsor workflow</p>
        <h1>Create an amendment agreement</h1>
        <p>Lock the authority bindings and scope allowance the contractor will explicitly accept.</p>
      </header>

      <form className="agreement-form" onSubmit={(event) => event.preventDefault()}>
        <fieldset>
          <legend>Parties and official baseline</legend>
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
              Original notice UUID and version
              <input name="originalUuid" required placeholder="UUID-01" />
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

        <button className="button button-accent" type="submit" disabled>
          Connect wallet to create
        </button>
      </form>
    </div>
  );
}
