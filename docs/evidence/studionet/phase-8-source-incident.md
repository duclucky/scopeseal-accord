# Phase 8 Studionet source incident and recovery gate

Date: 2026-09-01

Status: **PENDING_REAL_EVIDENCE - superseded revision recovery is time-locked**

## Finalized evidence

- Deployment `0x560e61E429D84944eB8008323bE84cCc1f1f50C9` finalized with `SUCCESS` and
  `MAJORITY_AGREE`.
- Agreement `scopeseal-official-001` received exactly 2 GEN, ratified, and submitted two review attempts.
- Both review transactions finalized with successful transaction execution and majority agreement.
- Attempt 1 and attempt 2 each stored `sourceStatus=UNAVAILABLE`, `sourceCoverage=INCOMPLETE`, and
  `aggregateVerdict=UNVERIFIABLE`.
- Canonical accounting remained received 2 GEN, locked 2 GEN, credited 0 GEN, withdrawn 0 GEN. No payout,
  negotiation right, hard consequence, or actor-controlled evidence path was opened.

The sanitized transaction hashes, receipt projections, canonical state after every finalized write, and Explorer
links are preserved in `deployment.json`, `deployment-attempts.json`, and `lifecycle.json`. No raw receipt, trace,
validator configuration, stdout, or stderr is stored.

## Root-cause evidence

The deployed query used an unbounded `GRAPH ?g` scan. The original query also required
`epo:SettledContract`, while the selected official RDF graph types the resource as `epo:Contract`.

Exact pre-fix host reproduction:

```text
original: HTTP 200, 228 bytes, 0 bindings
modification: read timeout after 30 seconds
```

Minimal hypothesis test using the same query with only a fixed publication named graph and the correct contract
type:

```text
original: HTTP 200, 1 binding, 1.89 seconds, exact 8 expected keys
modification: HTTP 200, 1 binding, 3.17 seconds, exact 12 expected keys
```

The contract now deterministically derives the official graph URI from the already validated TED publication number,
uses that graph in both queries, and matches `epo:Contract`. A new static regression test failed before this change and
passes after it.

## Retirement gate

Command:

```text
npm run studionet:retire
```

Real safe output:

```text
Result: WAIT_FOR_EXPIRY
canonicalState: RETRYABLE
availableAt: 2026-09-02T04:43:23Z
accounting: credited_gen=0, locked_gen=2, received_gen=2, withdrawn_gen=0
```

The retirement command cannot send recovery early. At or after the deadline it will recover the expired agreement,
withdraw the sponsor credit, and require locked and credited accounting to be zero with received equal to withdrawn.

The failed revision may be quarantined from the active project slot before that deadline only when canonical state is
exactly `RETRYABLE`, the latest attempt is the matching `UNAVAILABLE`/`UNVERIFIABLE` attempt, accounting is exactly
received 2 GEN, locked 2 GEN, credited 0 GEN, withdrawn 0 GEN, and the archived recovery command remains configured.
This permits the corrected revision to become active without presenting the failed address as part of the product.
It does not waive the outstanding 2 GEN recovery proof required before final project acceptance.
