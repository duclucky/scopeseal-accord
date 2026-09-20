# ScopeSeal Accord Milestone Ledger

## Project identity and accepted baseline

- Project: ScopeSeal Accord
- Track: Projects; subsequent updates use Portal contribution type `Milestones`
- Repository: https://github.com/duclucky/scopeseal-accord
- Accepted Project Revision 1 baseline: `f4d7cec499a39846ad8079b2d630d074aea6f039`
- Current accepted Milestone v1 repository baseline: `2488bf6d04c99f955ff433904eb1cd71ae5cdd45` (implementation/evidence through `c8f438131412923b039e7f89921f65713f44cc56`; submission packet through `2488bf6`)
- Current accepted Milestone v1 Portal record: https://portal.genlayer.foundation/contribution/195212
- Current accepted Milestone v1 network identity: legacy Studionet `0x6AD210a93E448BdF7A6aE8C05098fc1e25983FD0`; this is not a Studio Dev deployment
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

At initial ledger creation, no milestone had been submitted. The dated MS-001 outcome amendment below supersedes that historical snapshot.

## Current phase pointer

`MS-002` — `SELECTED` after the 2026-09-21 quality, overlap, and gate audit below. `MS-001` is `ACCEPTED` on the authenticated Portal. The historical `SUBMISSION_READY` record below remains as a snapshot and is corrected by the dated outcome amendment.

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
| `MS-001` | Completion Retention Closeout | `ACCEPTED` | Accepted commit `f4d7cec`; Portal Revision 1 Published; Studionet `0x8837...E879` | Official TED E5 completion judgment controls a separately funded 1 GEN retention and new closeout states/credits | Implementation/evidence `f4d7cec..c8f4381`; packet/accepted repo head `2488bf6` | Legacy Studionet `0x6AD210...83FD0`; primary E5 lifecycle `RELEASE_RETENTION`; Chrome/OKX finalized 1 GEN closeout funding and canonical reload; production https://scopeseal-accord.vercel.app | [Dossier](milestones/MS-001/README.md) | [Portal Milestone v1](https://portal.genlayer.foundation/contribution/195212) | 2026-09-08 (Portal display; acceptance observed 2026-09-21) | Extends accepted Project; no earlier Milestone | Accepted with 300 pts; single-lot only; multi-lot and consumer adoption remain backlog; structural mismatch retries are refused |

Historical selection record: exactly one phase was selected for MS-001 at that time. MS-001 is now accepted; no MS-002 candidate has yet been selected.

## Portal outcome log

| Observed at | Record | Verified state | Routing decision |
| --- | --- | --- | --- |
| 2026-09-08T17:06:35+07:00 | [ScopeSeal Accord live record](https://portal.genlayer.foundation/builders/explorer/scopeseal-accord) and authenticated project manager `/manage/206` | Revision 1 `Published`; live record exposes the accepted repo, app, and Studio contract | Initialize the first ledger and continue to baseline recovery; no pending phase blocks selection |
| 2026-09-21T05:43:19+07:00 | [Completion Retention Closeout contribution 195212](https://portal.genlayer.foundation/contribution/195212) in the authenticated Ducky account and My Submissions | Milestone v1 `Accepted`, 300 pts; Portal displays contribution/submission date 2026-09-08 and the submitted compare, CI, Studio and Explorer evidence | Promote the submitted MS-001 end state to the accepted baseline; evaluate MS-002 against both Revision 1 and MS-001, without recounting either |

## Append-only amendments

2026-09-21: The earlier `MS-001 / SUBMISSION_READY / NOT_SUBMITTED` text was the accurate local snapshot before Portal submission. The authenticated Portal now proves a later accepted submission at contribution `195212`. The table's current status and baseline pointer were updated without deleting the earlier dossier/packet text; the previous network evidence remains labeled legacy Studionet. Portal does not expose an exact acceptance timestamp in the observed record, so only the displayed 2026-09-08 contribution date and 2026-09-21 observation time are asserted.

## MS-002 Phase 1 inventory — 2026-09-21

- Accepted comparison floor: Project Revision 1 commit `f4d7cec499a39846ad8079b2d630d074aea6f039`, followed by accepted MS-001 implementation/evidence `c8f438131412923b039e7f89921f65713f44cc56` and accepted public repository head `2488bf6d04c99f955ff433904eb1cd71ae5cdd45`. `origin/main` matched this head when checked.
- Accepted Portal records: [Project](https://portal.genlayer.foundation/builders/explorer/scopeseal-accord) and [MS-001](https://portal.genlayer.foundation/contribution/195212). The Portal submission form identifies ScopeSeal Accord's next contribution as milestone `v2`.
- Accepted capability inventory: Revision 1's 2 GEN single-amendment agreement and official TED original/`can-modif` adjudication; MS-001's separate 1 GEN single-lot official E5 completion retention. Both have their own canonical state, credits, recovery, wallet journey, tests, and legacy Studionet evidence. These are baseline context, not MS-002 delta.
- Repository: child Git root on `main`, 117 tracked paths, exact one pre-existing user edit in `docs/submission/project-listing.md` (left untouched), project and frontend `.env` present/ignored, parent `.env` present outside Git. Current accepted package set is `genlayer-js@1.1.8`, `genlayer@0.39.2`, Python `genlayer-py@v0.18`, `genlayer-test@v0.29`, `genvm-linter@0.11.0`.
- Current workspace D1 is **Studio Dev** (`61997`), not legacy Studionet (`61999`). Read-only `eth_chainId` probes returned `0xf22d` from both `https://studio-dev.genlayer.com/api` (official canonical URL) and the locked `https://studio-next.genlayer.com/api` alias. [Official v0.6 migration guidance](https://docs.genlayer.com/developers/consensus-v06-migration) requires a coherent RC stack, fee-aware transaction estimates, and successful execution result as well as finality. The official `v2-dev` boilerplate branch at `816f3b88175032f10242e278c0d13d75f185c882` uses `genlayer-js@2.0.0-rc.1`, Python v0.19-dev/test v0.30-dev, and a different pinned Depends/API family. This is a **migration risk**, not evidence that the accepted Studionet contract already runs on Studio Dev.
- Fresh read-only `npm run studionet:inspect` at 2026-09-20T22:48:52.186Z reported active legacy deployment/source identity unchanged, `scopeseal-closeout-001` canonical `CLOSED / RELEASE_RETENTION`, zero agreement/closeout credit, global received 6 / withdrawn 5 / locked 1 / credited 0 GEN. This is **baseline legacy Studionet state**; the 1 GEN retained in the separate browser tripwire branch is not a new V2 deposit or a recovered balance.
- Collision risk: a plain redeployment, restyle, restated E5 release, generic retry fix, or screenshots of V1 cannot be claimed as a new judgment/consequence. Any selected V2 must have a distinctly usable integration or contract consequence and its own Studio Dev, browser, CI, and public proof. No new V2 phase is selected at this inventory checkpoint.

## MS-002 Phase 2 backlog refresh — 2026-09-21

This refresh is directional only; no new phase is selected by the table. Portal v2 permits a substantial new deployment/integration, but the old Studionet receipt is not Studio Dev proof. TED's official eForms guidance permits multiple completion lots, yet a bounded official SPARQL probe of five multi-lot E5 notices found distinct contract IDs per lot in the inspected fixtures. A global search for two amendments linked to one prior notice exceeded its 25-second bound. These are feasibility constraints, not claims that the cases do not exist.

| Priority | Candidate | Relationship to Revision 1 / MS-001 | New user capability and GenLayer-specific need | Distinct consequence and evidence path | Dependencies / deferred work | Decision at refresh |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Studio Dev Fee-Aware Launch | `EXTENDS` the accepted product through a new network/protocol integration, not a new E5 verdict | Sponsors and contractors can use the accepted amendment and closeout product on the current Studio Dev v0.6 stack, see a real fee quote before signing, and distinguish finality from execution success and consumed/refunded fees | Fresh Studio Dev contract + browser-wallet lifecycle + canonical GEN ledger and successful execution/fee receipt; previous Studionet evidence is baseline only | Coherent pinned RC SDK/runner/CLI/test stack, isolated migration spike, fee-profile tests, address/chain/proxy switch; no multi-lot or new evidence class | Leading candidate: current D1 makes it necessary and Portal explicitly recognizes a substantial new deployment; selection must reject a mere copy/redeploy |
| 2 | Cumulative Amendment Chain | Potential substantial `EXTENDS` of Revision 1 | Parties judge aggregate drift across a bounded linked official `can-modif` sequence before releasing the amendment purse | New ordered exact-coverage semantic result controls the 2 GEN purse; source-chain and replay tests, fresh network lifecycle | Need a real multi-notice same-contract chain, bounded depth/version policy, and source probe; initial exact-prior fixture had only one modification and broad search timed out | Backlog; evidence readiness insufficient today |
| 3 | Two-agreement Completion Portfolio | Potential substantial `EXTENDS` of MS-001 | One sponsor manages two closed contract agreements from the same procurement notice as a portfolio, with independent per-lot completion decisions | Exact two-lot/two-contract coverage, deterministic 1 GEN per agreement destinations and remainder, no duplicate/missing lot settlement | Official E5 multi-lot fixtures exist, but their lots have distinct contract IDs; requires a portfolio of separately bound agreements and original-source feasibility before selection | Backlog; cannot pretend a one-contract closeout covers these fixtures |
| 4 | Independent Co-funder Consumption | Potential `NEW` integration | A real co-funder consumes finalized ScopeSeal status before releasing its own contribution | Authenticated/idempotent consumer-controlled state and a demonstrable external release, not a pass-through mirror | Requires an actual adopter or independently owned enforcement boundary; no such partner/current adoption evidence | Backlog; do not create a decorative second contract |

Other adjacent maintenance (generic retry, UI polish, historical test-purse recovery) remains outside the milestone catalogue. Priority 1 preserves future substantial headroom in candidates 2–4 without claiming them now.

## MS-002 Phase 3 selection — 2026-09-21

The [MS-002 dossier](milestones/MS-002/README.md) records the full ten-dimension comparison against **both** accepted Revision 1 and MS-001, the 14-gate admission matrix, and the bounded evidence/value policy. Candidate dispositions:

| Candidate | Five-item milestone quality bar | Relationship | Selection decision |
| --- | --- | --- | --- |
| Studio Dev Fee-Safe Lifecycle | All five pass **only** for the coherent v0.6 port with measured fee profile, real pre-signing quote, execution-result and fee/refund verification, fresh Studio Dev settlement, and changed browser path; a plain redeploy fails substantial/not-repackaging | Substantial `EXTENDS` | `SELECTED` as `MS-002`; this is one new protocol/network integration, not a new E5 judgment |
| Cumulative Amendment Chain | Substantial in principle, but the bounded two-notice authoritative fixture and full-source path are not ready | Potential `EXTENDS` | `BACKLOG`; no source-chain or payout claim this phase |
| Two-agreement Completion Portfolio | Substantial in principle, but multi-lot E5 rows represent separate contracts and require a portfolio state/value design | Potential `EXTENDS` | `BACKLOG`; no single-contract shortcut |
| Independent Co-funder Consumption | Strong real-usage path, but no actual independent consumer/adopter exists yet | Potential `NEW` | `BACKLOG`; no pass-through consumer |

The selected V2 delta is **not** the accepted amendment or single-lot completion judgment. It is making that accepted product usable on the current Studio Dev fee-funded consensus stack, with user-visible fee budget/outcome correctness and a fresh network/browser consequence. No adjacent feature is folded into it. Phase 3 admission is conditional on preserving all accepted invariants and on Phase 6/7 proving the planned lifecycle; any missing required proof returns the item to backlog rather than inflating a submission claim.

| Milestone ID | Title | Status | Baseline reference | Delta fingerprint | Commit range | Deployment identity | Evidence index | Portal reference | Outcome date | Supersedes/extends | Lessons and follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `MS-002` | Studio Dev Fee-Safe Lifecycle | `SELECTED` | Accepted MS-001 public head `2488bf6`; Portal contribution `195212`; legacy Studionet `0x6AD210...83FD0` | Coherent v0.6 Studio Dev port + measured protocol-fee quote and success/refund-aware browser settlement of the accepted covenant | `2488bf6..PENDING` | Studio Dev address/source/Depends `PENDING_REAL_EVIDENCE` | [Dossier](milestones/MS-002/README.md) | `NOT_SUBMITTED` |  | Extends accepted Revision 1 and MS-001 without recounting their verdicts/evidence | Multi-lot, cumulative chain, and adopter integration remain backlog |
