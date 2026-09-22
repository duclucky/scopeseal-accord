# ScopeSeal Accord — MS-002 submission packet

Status: `SUBMISSION_READY / NOT_SUBMITTED`. Recommended category: **Milestones**. Do not use the final Portal Submit control without new explicit action-time authorization.

## Copy-ready fields

**Title:** Studio Dev Fee-Safe Lifecycle

**Changes & Improvements:**

ScopeSeal Accord V2 ports the accepted amendment and completion-retention workflows to GenLayer Studio Dev (chain 61997) as one coherent fee-funded release. The contract now uses the v0.3 GenVM API and a pinned runner, while preserving one ASCII ScopeSealAccord class and the accepted authority, state-machine, recovery, and GEN-accounting guarantees. The frontend detects multiple EVM wallets, switches the selected provider to Studio Dev, quotes the exact protocol fee before signing, separates the 1–2 GEN application value from network fees, verifies successful execution and refunds, and reloads canonical state. Fresh Studio Dev evidence proves a negotiated 2 GEN payout, an authenticated TED E5 RELEASE_RETENTION closeout with a 1 GEN withdrawal, and a mismatched completion notice remaining RETRYABLE/UNVERIFIABLE with no penalty. All 59 Python, 26 deployment/proxy, and 48 frontend tests pass; CI and the production Vercel app are live. No mainnet or independent adoption is claimed.

Character count: 992, within the displayed 1000-character Portal limit.

## Evidence links

1. Repository: <https://github.com/duclucky/scopeseal-accord>
2. Exact accepted-baseline-to-evidence range: <https://github.com/duclucky/scopeseal-accord/compare/2488bf6d04c99f955ff433904eb1cd71ae5cdd45...dae1ba95453f8900b8269b87c270fbe67fed1d26>
3. Successful evidence-head CI: <https://github.com/duclucky/scopeseal-accord/actions/runs/35689747449>
4. Active Studio Dev contract: <https://explorer-studio-dev.genlayer.com/address/0xAD2c9170ec79D5772167D92A8335dfd78E3660Bf>
5. Active deployment transaction: <https://explorer-studio-dev.genlayer.com/tx/0xe030b1106531df98b376cf1c508b28b38f430f642087dee678b134e96ae5c97f>
6. E5 closeout evidence: <https://github.com/duclucky/scopeseal-accord/blob/dae1ba95453f8900b8269b87c270fbe67fed1d26/docs/evidence/studio-dev/milestones/MS-002/lifecycle-scopeseal-v2-e5-003.json>
7. Payout audit: <https://github.com/duclucky/scopeseal-accord/blob/dae1ba95453f8900b8269b87c270fbe67fed1d26/docs/evidence/studio-dev/milestones/MS-002/payout-audit-scopeseal-v2-smoke-002.json>
8. Retry recovery audit: <https://github.com/duclucky/scopeseal-accord/blob/dae1ba95453f8900b8269b87c270fbe67fed1d26/docs/evidence/studio-dev/milestones/MS-002/recovery-audit-scopeseal-v2-smoke-002.json>
9. Live application: <https://scopeseal-accord.vercel.app>

## Verified facts and qualification

- One deployed intelligent contract, `ScopeSealAccord/3`, with exactly one validator-visible class and 22 methods.
- 133 passing automated tests: 59 Python direct/static, 26 deployment/proxy, and 48 frontend; lint, TypeScript, and production build pass.
- Active network: Studio Dev chain 61997. The legacy Studionet deployments are baseline/archive only.
- Two distinct canonical agreement IDs on the active replacement deployment closed on 2026-09-21; identity is deduplicated by agreement ID.
- Application accounting after the complete lifecycles: 6 GEN received, 6 GEN withdrawn, 0 GEN locked, 0 GEN credited, and 0 GEN contract balance.
- This qualifies as one substantial phase because the accepted product is coherently migrated across GenVM API/runner, SDK, network, wallet fee protocol, transaction outcome handling, deployment, and live lifecycle. It is neither a restyle nor a resubmission of the accepted E5 judgment.
- Honest limits: demonstration/testnet evidence only; no mainnet or independent adoption. Production canonical reads are live, while the real browser-write lifecycle was proven locally because the extension declined a new production-origin connection.

## Required short report

**Project name:** ScopeSeal Accord (Milestone: Studio Dev Fee-Safe Lifecycle)

**What changed:** The accepted ScopeSeal amendment and completion-retention product now runs coherently on Studio Dev with a network-derived pre-signing fee quote, execution-result and fee/refund verification, canonical reload, and fresh zero-liability settlement evidence.

**Why it matters:** Sponsors and contractors can use the current GenLayer network without confusing protocol fees with 1–2 GEN application value or treating finality as successful execution when a transaction failed.

**GitHub (public):** https://github.com/duclucky/scopeseal-accord

**Live app:** https://scopeseal-accord.vercel.app

**Contract (Studio Dev):** 0xAD2c9170ec79D5772167D92A8335dfd78E3660Bf

**Milestone ID / status:** MS-002 / SUBMISSION_READY
