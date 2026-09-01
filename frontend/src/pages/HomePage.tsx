import { ArrowRight, Scales, ShieldCheck, TreeStructure } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Public procurement, without private judgment</p>
          <h1>Amendments without unilateral judgment</h1>
          <p className="hero-lede">
            Neither sponsor nor contractor decides alone. ScopeSeal binds a 2 GEN
            agreement to the meaning of an official TED amendment and its linked original notice.
          </p>
          <div className="hero-actions">
            <Link className="button button-accent" to="/agreements/new">
              Create a 2 GEN agreement
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/help">
              Review the evidence rules
            </Link>
          </div>
          <p className="honesty-note">
            No agreement data is shown until canonical state is available from the configured contract.
          </p>
        </div>
        <div className="decision-frame" aria-label="ScopeSeal decision path">
          <div className="decision-node">
            <span>01</span>
            <strong>Co-ratify</strong>
            <p>Lock parties, baseline, authority bindings and 2 GEN.</p>
          </div>
          <div className="decision-node">
            <span>02</span>
            <strong>Review</strong>
            <p>Validators fetch the exact official TED notice pair.</p>
          </div>
          <div className="decision-node">
            <span>03</span>
            <strong>Settle</strong>
            <p>Release, negotiate, or retry without penalty.</p>
          </div>
        </div>
      </section>

      <section className="feature-section" aria-labelledby="why-scopeseal">
        <div className="section-heading">
          <p className="eyebrow">A bounded settlement primitive</p>
          <h2 id="why-scopeseal">Trust the source, distribute the judgment</h2>
        </div>
        <div className="feature-grid">
          <article>
            <ShieldCheck size={28} aria-hidden="true" />
            <h3>Official evidence only</h3>
            <p>Actor-hosted mirrors and matching digests cannot authorize a consequence.</p>
          </article>
          <article>
            <Scales size={28} aria-hidden="true" />
            <h3>Semantic consensus</h3>
            <p>Additions and omissions are compared to the co-ratified scope allowance.</p>
          </article>
          <article>
            <TreeStructure size={28} aria-hidden="true" />
            <h3>Explicit recovery</h3>
            <p>Material change opens negotiation; unverifiable evidence moves no GEN.</p>
          </article>
        </div>
      </section>
    </>
  );
}
