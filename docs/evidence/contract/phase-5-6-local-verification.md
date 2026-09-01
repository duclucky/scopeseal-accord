# Phase 5-6 contract verification

Date: 2026-09-01

Status: **local direct-mode and semantic lint PASS; Studionet evidence pending**

## TDD witness

The implementation was developed in discrete RED/GREEN slices:

| Slice | RED evidence | GREEN evidence |
| --- | --- | --- |
| Static contract boundary | 5 errors: `contracts/scopeseal_accord.py` missing | 5 static tests passed after adding the current Depends header, ASCII source, one class and exact 12-method ABI |
| Creation and ratification | 3 failures: creation/ratification stubs raised `not implemented` | 3 tests passed after exact 2 GEN, input, deadline, keyed storage and contractor-only ratification logic |
| Official review and consequences | 3 failures: review stub | 3 tests passed for within-baseline contractor credit, material negotiation and wrong-previous retry |
| Negotiation, recovery and withdrawal | 7 failures: proposal/recovery stubs | 7 tests passed for all 0/1/2 GEN allocations, nonce/roles, state-specific expiry, two-party credits and close |
| Adversarial evidence | New invariant/provenance cases | 10 tests passed for extra/missing meaning, aggregate mismatch, consequence injection, wrong authority bindings, claimant URL rejection and unavailable official source |
| Temporal entrypoints | New boundary/stale-state matrix | 19 tests passed for boundary minus one, equality and plus one across creation, ratification, review, proposal, acceptance and recovery |
| Isolation | New cross-agreement/unauthorized review case | Added test passed; final suite count increased to 48 |

## Fresh verification output

Command:

```powershell
.venv\Scripts\python.exe -m pytest tests\direct -q
```

Output:

```text
................................................ [100%]
48 passed in 3.54s
```

Command:

```powershell
$env:PYTHONUTF8='1'
.venv\Scripts\genvm-lint.exe check contracts\scopeseal_accord.py
```

Output:

```text
Lint passed (3 checks)
Validation passed
Contract: ScopeSealAccord
Methods: 12 (5 view, 7 write)
```

The linter also reported that a newer runner exists. It was intentionally not substituted: workspace policy treats the Depends runner and API as one versioned unit, and an upgrade requires an isolated migration spike plus lint, direct tests and a bounded network smoke test.

## Source identity

```text
file: contracts/scopeseal_accord.py
lines: 931
bytes: 38116
non-ASCII bytes: 0
gl.Contract subclasses: 1
Depends hash occurrences: 1
SHA-256: 50603e7b420679a3fd194f297848afce58deaa3c91fe551278362309788bb622
```

The source hash above precedes any later Task 8-10 remediation; deployment identity must use a fresh hash and commit after all local checks.

## Engineering-quality review

- The seven-write/five-view public interface stays aligned with the Phase 4 specification and hides SPARQL, normalization, accounting and storage details.
- A single source module is required by the validator-visible contract rule. Within it, official acquisition, normalization, semantic comparison, deterministic settlement and accounting are separated into named helpers.
- Public methods enforce role, state and transaction-time conditions locally. Recovery uses the deadline for the actual stale state rather than relying on an offchain phase advance.
- The largest residual complexity is the official SPARQL acquisition/normalization path. It remains inside the contract because splitting it into another contract would weaken the trust boundary. Focused adversarial tests protect this complexity.
- Intentionally deferred: deployment receipt tooling, real `genlayer-js` adapter wiring, bounded Studionet source smoke and consequential lifecycle. No network claim is made here.
