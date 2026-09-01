# Phase 4 specification gate

Date: 2026-09-01

Status: **PASS — DESIGN locked; contract implementation may begin test-first**

## Gate results

1. Category remains **Projects**; the frontend is a required product surface, not a substitute for the Intelligent Contract.
2. Exactly one contract is justified: `ScopeSealAccord`. No second consumer/callback contract is needed in v1.
3. All 14 ideation gates remain PASS. The evidence-authenticity gate relies on validator-side EU Publications Office acquisition, not claimant-hosted evidence.
4. Contract API is exact: seven public writes and five canonical views are named with bounded parameters and legal states.
5. State machine is complete from funded draft through active review, retry/negotiation, settlement, withdrawal and close.
6. Evidence Authority Matrix has a complete row for the original notice, modification notice and co-ratified policy.
7. Every value/recovery method has a safety card covering caller, states, clock, idempotency, accounting, views and negative tests.
8. Every temporal write has explicit equality semantics and a boundary-minus-one/equality/plus-one stale-state test requirement.
9. Value destinations conserve exactly 2 GEN. No fee, residual, orphaned purse or caller-supplied destination exists.
10. Validator output must cover exactly one `AMENDMENT_SCOPE` entity. Extra/missing/duplicate entities, invalid enums, mismatched aggregate verdict or changed authority binding cannot move GEN or open negotiation.
11. `UNVERIFIABLE`/`RETRYABLE` may append a bounded attempt only; locked GEN, credits, settlement and party rights remain unchanged.
12. Every public product claim maps to a write/view, state transition, deterministic guard, direct/frontend tests and required network evidence.
13. The seven browser actions map to typed wrappers, accepted UI controls, transaction finality states and canonical reloads under FE-PRESERVE.
14. Honest limits distinguish the successful host-side source probe and browser shell from unimplemented contract behavior and pending Studionet evidence.

## Official-source proof used to lock the design

Official primary documentation:

- TED Open Data SPARQL connection guide: `https://docs.ted.europa.eu/ODS/latest/connecting/sparql.html`
- TED published-notice reuse and direct formats: `https://docs.ted.europa.eu/ODS/latest/reuse/download-direct.html`
- TED notice/version identifiers: `https://docs.ted.europa.eu/eforms/latest/schema/notice-information.html`

Fresh command probes against `https://publications.europa.eu/webapi/rdf/sparql` returned:

```text
minimal SPARQL GET: HTTP 200, content-type application/sparql-results+json
00587863-2026: 1 publication-number match
00190662-2025: 1 publication-number match
modification named graph: http://data.europa.eu/a4g/resource/2026/00587863_2026
original named graph:     http://data.europa.eu/a4g/resource/2025/00190662_2025
modification literal rows: 69
original literal rows:     71
```

The structured result exposed the locked previous-notice binding `6480e4d5-6f07-4b83-8097-5756d8fbf527-01`, buyer legal identifier `3267368TH`, procedure identifier `7f56490a-c5ba-4922-853b-07b18b0d14c1`, contract identifier `417379`, original baseline description and official addition/omission text.

The alternative direct XML probe returned a TED AWS WAF human-verification challenge in the non-browser shell. Phase 4 therefore selects the official structured SPARQL GET path and records XML only as a non-selected availability fallback. A bounded GenVM/Studionet source smoke test remains mandatory before value-bearing lifecycle claims.

## Mechanical specification checks

The following checks are required before the first contract source is created:

```text
docs/README.md status: DESIGN
write safety-card rows: 7
value-destination rows: 3
frontend action rows: 7
expected semantic entity IDs: exactly 1 (AMENDMENT_SCOPE)
planned contract modules: 1
current contract modules: 0
```

Any drift in these counts or the selected evidence route returns the project to Phase 4 before implementation.
