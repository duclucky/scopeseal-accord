export function HelpPage() {
  return (
    <div className="page-layout prose-page">
      <header className="page-header">
        <p className="eyebrow">Evidence and recovery guide</p>
        <h1>How ScopeSeal works</h1>
        <p>What validators inspect, what each result means and which claims the product deliberately avoids.</p>
      </header>
      <section>
        <h2>Official evidence only</h2>
        <p>
          Validators fetch the exact TED modification notice and its linked original notice. A
          claimant-hosted mirror, screenshot, upload or matching digest cannot authorize settlement.
        </p>
      </section>
      <section>
        <h2>Three bounded results</h2>
        <dl className="definition-list">
          <div><dt>Within baseline</dt><dd>The official disclosure remains inside the co-ratified allowance and opens contractor credit.</dd></div>
          <div><dt>Material amendment</dt><dd>The change exceeds the allowance and opens a bilateral negotiation window.</dd></div>
          <div><dt>UNVERIFIABLE</dt><dd>Evidence is unavailable, mismatched or insufficient; no GEN or hard state moves and retry remains available.</dd></div>
        </dl>
      </section>
      <section>
        <h2>Honest boundary</h2>
        <p>
          ScopeSeal does not decide legal compliance or physical performance. It governs only the
          parties' private 2 GEN covenant in response to an authenticated official disclosure.
        </p>
      </section>
    </div>
  );
}
