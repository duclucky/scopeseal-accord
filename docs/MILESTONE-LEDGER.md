# ScopeSeal Accord Milestone Ledger

## Project identity and accepted baseline

- Project: ScopeSeal Accord
- Track: Projects; subsequent updates use Portal contribution type `Milestones`
- Repository: https://github.com/duclucky/scopeseal-accord
- Accepted repository baseline: `f4d7cec499a39846ad8079b2d630d074aea6f039`
- Accepted Portal record: https://portal.genlayer.foundation/builders/explorer/scopeseal-accord
- Portal management record: https://portal.genlayer.foundation/builders/explorer/manage/206
- Verified Portal outcome: `Published` (Revision 1, displayed update date 2026-09-06)
- Outcome observed: 2026-09-08T17:06:35+07:00 in the authenticated Portal account
- Accepted live application: https://scopeseal-accord.vercel.app
- Accepted Studionet contract: `0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879`
- Accepted contract source commit: `5457d3195156bc6ec969b9b6453a7bdc83befc40`
- Accepted contract API / Depends family: `ScopeSealAccord/1` / `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`
- Deployment evidence: [Studionet deployment](evidence/studionet/deployment.json)
- Lifecycle evidence: [Studionet lifecycle](evidence/studionet/lifecycle.json) and [Chrome wallet lifecycle](evidence/frontend/phase-15-browser-wallet-lifecycle.md)

This is the first Milestone ledger for the accepted Project. The accepted baseline above was recovered
from the current Portal record, Git history, deployed identity, and public evidence; it was not inferred
from elapsed time or repository activity.

## Ordered phase history

| Milestone ID | Title | Status | Baseline reference | Delta fingerprint | Commit range | Deployment identity | Evidence index | Portal reference | Outcome date | Supersedes/extends | Lessons and follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

No milestone has been submitted yet.

## Current phase pointer

`MS-001` — `SUBMISSION_READY` after local/CI verification, finalized Studionet/browser evidence, public GitHub history, verified Vercel production, and a self-contained Portal packet. Final Portal action is not authorized yet.

## Cross-phase claim and evidence inventory

There are no earlier ScopeSeal Milestones. The inventory below pins the accepted Project core so later
phases cannot count it again as new work.

| Dimension | Accepted Revision 1 baseline | Pinned evidence |
| --- | --- | --- |
| User capability and journey | Sponsor creates and funds a 2 GEN amendment covenant; contractor ratifies; either party requests an official change-order review; parties settle a material amendment or withdraw a released credit | Portal `How to try it`, `README.md`, browser lifecycle |
| Trust problem | Neither sponsor nor contractor controls the semantic decision on whether an official modification remains inside their co-ratified baseline | `docs/README.md` fingerprint and threat model |
| Contract methods/state | `create_agreement`, `ratify_agreement`, `request_review`, `propose_split`, `accept_split`, `recover_expired`, `withdraw_credit`; keyed agreement and attempt state | `contracts/scopeseal_accord.py`, 12-method lint record |
| Judgment and evidence | Validators fetch exact official TED original and `can-modif` records and compare the disclosed change with the locked allowance | Contract source, TED evidence matrix, review tests |
| Consequence and GEN | `WITHIN_BASELINE` opens 2 GEN contractor credit; `MATERIAL_AMENDMENT` opens negotiation with 2 GEN locked; retry is non-penalizing | Direct tests and both Studionet lifecycles |
| Integration/deployment | One `ScopeSealAccord/1` contract on Studionet plus the same-origin read proxy and selected EVM wallet write path | `deployment.json`, frontend adapter tests |
| Frontend writes/views | New agreement, ratification, review, amendment split, acceptance, recovery, withdrawal; canonical agreement/accounting reload | Frontend routes/tests and Chrome proof |
| Tests/lifecycle evidence | 50 direct tests, 3 receipt parser tests, 12 deployment helper tests, 40 frontend tests at accepted release; script and Chrome lifecycles | Project evidence and successful CI run for `f4d7cec` |
| Usage/adoption metric | Demonstration lifecycles only; no production adoption claimed | Portal limitation and public README |
| Previously used public proof | Accepted commit `f4d7cec`; source commit `5457d319`; contract `0x8837...E879`; app, repo, Portal page, transaction links, logo, listing copy | Portal Revision 1 and project evidence tree |

### Baseline recovery checks

- Git root is the project child, branch `main`; local and `origin/main` both resolve to accepted commit
  `f4d7cec499a39846ad8079b2d630d074aea6f039`.
- The pre-existing edit to `docs/submission/project-listing.md` is preserved and excluded from baseline
  claims until separately committed.
- Project `.env` and parent `.env` exist; the authorized Studionet sponsor and second-role key names are
  present only in the ignored parent file. Values were not printed. Project `.env` remains ignored.
- Public tracked-path scan found zero `.env`, key, wallet, control-prompt, `AGENTS.md`, `CLAUDE.md`,
  source-notes, research, reference, or template paths.
- Current npm registry versions observed on 2026-09-08 are `genlayer 0.39.2`, `genlayer-js 1.1.8`, and
  `genlayer-mcp 2.2.0`; the accepted frontend already pins `genlayer-js 1.1.8` and `viem 2.56.1`.
  No dependency or runner migration is part of the first Milestone.
- Current official GenLayer docs still require nondeterministic web access inside a nondeterministic
  block and deterministic state mutation after consensus. The accepted Depends/API family stays pinned.
- Current TED eForms documentation identifies `E5` / `compl` as the voluntary Contract Completion
  notice. A bounded official SPARQL probe returned real E5 records, including single-lot notice
  `00734925-2025`; therefore evidence readiness is real rather than hypothetical.

### Known collision risks

- A new phase must not relabel the accepted 2 GEN amendment decision, its negotiation, or its existing
  wallet/finality UI as milestone work.
- Generic retry hardening or presentation cleanup is maintenance, not a standalone Milestone.
- A completion phase must introduce an independently useful completion evidence class, closeout state,
  retention consequence, browser journey, and fresh lifecycle evidence.

## Adaptive backlog

Priority was refreshed on 2026-09-08 from the accepted Project state, the published Portal record,
current official GenLayer guidance, TED E5 availability, and the absence of production-adoption data.
No item is selected in this section.

| Priority | Candidate | Relationship | New capability / GenLayer need | Consequence and evidence path | Dependencies / deferred work | Status reason |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Completion Retention Closeout | `NEW` | Sponsor and contractor co-ratify a separate 1 GEN closeout retention; validators interpret an exact official TED E5 completion notice under their locked release standard | Clean supported completion opens contractor credit; a material exception opens closeout negotiation; unavailable or mismatched authority is retryable. Official TED SPARQL E5 record, exact UUID/version, buyer, procedure, contract, lot, payment, penalty, and explanation bindings | Defer cumulative amendments, external consumer callbacks, and multi-lot closeouts | Strongest evidence readiness, distinct post-performance journey, and measurable progress toward real procurement usage |
| 2 | Cumulative Amendment Chain | `EXTENDS` | Review multiple official `can-modif` notices and judge cumulative semantic drift rather than only one modification | New cumulative verdict controls the existing 2 GEN purse; official linked notice chain | Requires a bounded chain-depth policy and real multi-notice lifecycle fixture; defer completion retention | Substantial but overlaps the accepted evidence family more than priority 1 |
| 3 | Co-funder Consumption Adapter | `NEW` | A real procurement co-funder consumes finalized ScopeSeal state before its own contribution release | Authenticated, idempotent consumer boundary and a real external integration | Requires an actual adopter or independently stateful consumer; no partner evidence exists yet | Best adoption path, but dependency readiness is insufficient for this run |
| 4 | Multi-lot Completion Portfolio | `EXTENDS` | One closeout distributes retained GEN across several official completion lots after validator classification | Exact lot coverage and deterministic allocation with remainder destination | Depends on the single-closeout E5 primitive first; defer portfolio UI and batch accounting | Reserved as a later substantial extension, not folded into the first closeout phase |

### Backlog changes and reservations

- Completion Retention Closeout is promoted to the top because official E5 records are now queryable and
  expose the required completion, payment, penalty, contract, procedure, buyer, and lot fields.
- The cumulative-amendment item remains backlog because it risks recounting the accepted change-order
  surface unless its cumulative consequence is isolated and separately proven.
- The co-funder adapter remains backlog until a real independent state/enforcement boundary or adopter
  exists; a pass-through contract is forbidden.
- Multi-lot completion is explicitly reserved for a later Milestone so the first closeout stays one
  bounded, independently complete vertical slice.

## Phase 3 selection record — 2026-09-08

### Five-item quality bar

| Candidate | Substantial | Not repackaging | Builds on accepted version | Delta documentable | Moves toward real usage | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Completion Retention Closeout | PASS — new evidence/state/value lifecycle | PASS — not amendment relabeling | PASS — attaches to a canonical ScopeSeal agreement | PASS — E5 retention delta is separable | PASS — completes the post-performance procurement journey | Select |
| Cumulative Amendment Chain | PASS | PASS if bounded to cumulative drift | PASS | PASS | PASS | Keep backlog; higher overlap and source-chain complexity |
| Co-funder Consumption Adapter | PASS only with an independent consumer | PASS | PASS | PASS | PASS with a real adopter | Keep backlog; current adopter/boundary evidence is absent |
| Multi-lot Completion Portfolio | PASS | PASS | PASS after the single-lot primitive | PASS | PASS | Reserve; depends on MS-001 and would overbuild this phase |

### Ten-dimension anti-overlap audit

| Dimension | Completion closeout | Cumulative amendments | Co-funder adapter | Multi-lot completion |
| --- | --- | --- | --- | --- |
| 1. User capability | Release/contest a post-performance retention | Judge cumulative drift | Gate an independent co-funder release | Close several official lots |
| 2. Trust/failure mode | Parties dispute whether official completion satisfies a locked closeout standard | Individually minor changes may aggregate materially | Consumer must not trust a ScopeSeal-operated relay | Missing/duplicate lots could skew portfolio settlement |
| 3. Methods/state | New closeout state machine and credits | Amendment chain and cumulative result | Consumer-owned receipt/idempotency state | Lot-indexed closeout/allocation state |
| 4. Judgment/evidence | New official TED E5 completion class | Existing `can-modif` class, multiple records | Consumes finalized canonical verdict; no fake new judgment | E5 evidence with exact multi-lot coverage |
| 5. Consequence/GEN | New 1 GEN retention release/negotiation/refund | Existing purse under new cumulative verdict | Independent co-funder value/right | Deterministic per-lot split and remainder |
| 6. Integration | TED E5 | TED modification chain | Real external consumer | TED E5 portfolio |
| 7. Frontend | New closeout journey | Amendment history review | Consumer status/callback surface | Batch lot review |
| 8. Tests/evidence | New E5, value, time, browser, Studionet proof | Chain ordering/replay/full lifecycle | Sender/idempotency/integration proof | Coverage/duplicate/remainder/full lifecycle |
| 9. Adoption metric | Closeout attempts and finalized retentions | Multi-amendment agreements | Real consumer usage | Lots closed per agreement |
| 10. Public proof | Entirely new dossier/tx/deployment/screens | Must not reuse single-change evidence as delta | Requires consumer repo/address/evidence | Must not reuse single-lot MS-001 evidence |
| Relationship | `NEW` | substantial `EXTENDS` | `NEW` when dependency exists | future `EXTENDS` of MS-001 |

The selected candidate does not count any Revision 1 method, transaction, screenshot, or claim as new.
There are no earlier Milestone IDs to compare. MS-001 is a distinct post-performance completion surface,
while the accepted Project remains the amendment baseline.

### Selected phase

| Milestone ID | Title | Status | Baseline reference | Delta fingerprint | Commit range | Deployment identity | Evidence index | Portal reference | Outcome date | Supersedes/extends | Lessons and follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `MS-001` | Completion Retention Closeout | `SUBMISSION_READY` | Accepted commit `f4d7cec`; Portal Revision 1 Published; Studionet `0x8837...E879` | Official TED E5 completion judgment controls a separately funded 1 GEN retention and new closeout states/credits | Implementation/evidence `f4d7cec..c8f4381`; submission packet commit pending | Studionet `0x6AD210...83FD0`; primary E5 lifecycle `RELEASE_RETENTION`; Chrome/OKX finalized 1 GEN closeout funding and canonical reload; production https://scopeseal-accord.vercel.app | [Dossier](milestones/MS-001/README.md) | `NOT_SUBMITTED` | Extends accepted Project; no earlier Milestone | Single-lot only; multi-lot and consumer adoption remain backlog; structural mismatch retries are refused |

Exactly one phase is selected.

## Portal outcome log

| Observed at | Record | Verified state | Routing decision |
| --- | --- | --- | --- |
| 2026-09-08T17:06:35+07:00 | [ScopeSeal Accord live record](https://portal.genlayer.foundation/builders/explorer/scopeseal-accord) and authenticated project manager `/manage/206` | Revision 1 `Published`; live record exposes the accepted repo, app, and Studio contract | Initialize the first ledger and continue to baseline recovery; no pending phase blocks selection |

## Append-only amendments

None.
