# MS-002 — Studio Dev Fee-Safe Lifecycle

Status: `BUILDING` (2026-09-21). No Studio Dev contract, transaction, browser result, CI result, or Portal submission is claimed yet.

## Pinned accepted baseline and exact delta

- Accepted Project Revision 1: commit `f4d7cec499a39846ad8079b2d630d074aea6f039`, Portal [ScopeSeal Accord](https://portal.genlayer.foundation/builders/explorer/scopeseal-accord), legacy Studionet `0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879`.
- Accepted MS-001: [Portal contribution 195212](https://portal.genlayer.foundation/contribution/195212), `Accepted` / 300 pts, implementation/evidence through `c8f438131412923b039e7f89921f65713f44cc56`, public repository head `2488bf6d04c99f955ff433904eb1cd71ae5cdd45`, legacy Studionet `0x6AD210a93E448BdF7A6aE8C05098fc1e25983FD0`.
- The accepted amendment and single-lot E5 decisions, 2 GEN agreement purse, 1 GEN retention, credits, recovery, and wallet journeys are **baseline**. Neither their source logic nor their old transactions are V2 impact.
- New V2 capability: use the same neutral procurement judgment and settlement product on **Studio Dev**'s v0.6 fee-funded consensus stack. A connected sponsor/contractor receives a network-derived, measured maximum protocol-fee quote before signing, sends the exact quote with each action, sees decided/finalized **and** execution success or failure, then sees actual consumed/refunded fee separately from 1–2 GEN application value and reloads canonical state. A fresh Studio Dev deployment/browser lifecycle must prove this; a copy-only deployment is insufficient.
- New integration boundary: coherent RC GenVM runner/API, `genlayer-js`, fee profile/estimate, Studio Dev chain/wallet/RPC/proxy/Explorer, and deployment/lifecycle scripts. Historic Studionet remains archival, never relabeled.

This is one bounded protocol/network integration, not a new procurement verdict, evidence class, or user role. It is a substantial `EXTENDS` of both accepted phases, not a cosmetic restyle or a second counting of MS-001. The Portal's current Milestones guidance lists a *new deployment* and a *security or architecture improvement* as qualifying forms of meaningful progress; here those are accompanied by a new fee-safe user workflow and real settlement proof.

## Five-item milestone quality bar

| Bar | Admission result and required proof |
| --- | --- |
| Substantial improvement | `PASS` as a design: migration across contract runtime, SDK, fee-funded transaction protocol, wallet chain, RPC, deployment, and every value-bearing frontend write; Phase 7 must prove a new Studio Dev consequence. Plain redeploy alone would `FAIL`. |
| Not repackaging | `PASS`: fee quote before signing, execution-result check, actual fee/refund accounting, and same-chain canonical reload do not exist in accepted V1; no old verdict/tx is presented as new. |
| Builds on accepted version | `PASS`: `2488bf6` is pinned; accepted state machines/roles/accounting remain regression obligations. |
| Documented delta | `PASS`: the exact new network/protocol/user path and non-goals are documented here; final packet must show before/after and commits. |
| Toward real usage | `PASS`: the current Studio Dev stack is usable with a correct wallet/fee path; no customer adoption is claimed. |

## Ten-dimension anti-overlap audit

| Dimension | Accepted Revision 1 / MS-001 | MS-002 counted delta |
| --- | --- | --- |
| User capability/journey | Single amendment and single-lot E5 closeout on legacy Studionet | Same actions usable on Studio Dev with an explicit fee quote, confirmation, execution/fee outcome, and canonical reload |
| Trust/failure mode | Neutral validator adjudication; no fee-funded UI | Avoid user signing with unknown protocol budget or accepting `FINALIZED` when execution failed |
| Contract methods/state | 22 methods, single-lot keyed agreement/closeout | API-family port preserves semantics; no new verdict or entity is claimed |
| Judgment/authenticated evidence | Official TED original, `can-modif`, E5 | Same authoritative paths re-proven on new runner/network; old source judgment not re-counted |
| Deterministic consequence/GEN | 2 GEN agreement and 1 GEN closeout settlement on Studionet | Fresh Studio Dev release/withdraw, with protocol fee budget distinguished from application GEN |
| External integration/deployment | Legacy Studionet 61999 / v0.18 family | Studio Dev 61997 / coherent v0.6 RC family and new deployment identity |
| Frontend writes/views | Existing OKX writes, finality/reload on Studionet | Measured quote/confirmation, success+fee/refund result, Studio Dev wallet/proxy/read/write alignment |
| Tests/lifecycle | 118 accepted tests and V1 Studionet/browser proof | RC contract regression, fee-profile/adapter negatives, fresh Studio Dev/browser proof and CI |
| Adoption metric/window | Demo only, no independent customer | New Studio Dev successful distinct agreement count during a dated window; still demo only |
| Files/commits/links | `f4d7cec..2488bf6`, V1 evidence and contribution 195212 | New commits only after `2488bf6`, new `docs/evidence/studio-dev/milestones/MS-002`, new Explorer and live-path proof |

Relationship to Revision 1: substantial `EXTENDS` on network/fee protocol, **not** a new amendment decision. Relationship to MS-001: substantial `EXTENDS` on deployable closeout/browser infrastructure, **not** a new E5 lot/verdict. No earlier accepted evidence will serve as V2 network evidence.

## Fourteen-gate admission check for the migrated consequential surface

These are design/admission results, not a claim that the new network lifecycle already occurred. Phase 6/7 must supply actual proof; an unmet proof reopens selection rather than being narrated away.

| Gate | Result | Why this V2 design clears it |
| --- | --- | --- |
| Replacement | `PASS` | The underlying release/negotiation judgment still needs independent GenLayer validators; a fee-aware backend or ordinary EVM app cannot neutrally interpret official TED evidence for conflicting parties. |
| Judgment | `PASS` | The unchanged but ported amendment/E5 semantic questions remain nondeterministic inside the contract; protocol fees do not replace them. |
| Evidence availability | `PASS` | Previously proven bounded TED queries remain the exact sources; independent official TED probe and Studio Dev runtime smoke are required before value. |
| Evidence authenticity | `PASS` | The only consequential real-world facts are still exact official TED graph records with locked publication/buyer/procedure/contract/lot bindings. User cannot supply URL/body. Invalid/mismatched provenance stays `RETRYABLE` with zero credits. See authority matrix. |
| Equivalence | `PASS` | The port must preserve independent semantic validator replay and the exact critical IDs, status, coverage, verdict, and fingerprint while ignoring free-text rationale. In v0.3 use the verified safe equivalent of the old sandboxed custom-validator API. |
| Consequence | `PASS` | A successful finalized review still moves 2 GEN agreement or 1 GEN closeout rights; a failed execution or unverifiable source cannot do so. Fees are separately network-settled. |
| Adversarial | `PASS` | Sponsor and contractor retain opposing incentives; the fee payer also needs an honest pre-signing budget, but cannot choose validator outcome. |
| State model | `PASS` | Keyed state, append-only attempts, role/time checks, one-time credits and recoveries, and GEN conservation must remain invariant under the API migration; stale-phase boundary tests remain mandatory. |
| Reuse | `PASS` | Existing public reads/writes remain usable by procurement integrators; the new fee profile/client boundary makes current-network integration reproducible without forking judgment code. |
| Contract count | `PASS` | One state-owning contract remains. No pass-through consumer or decorative fee contract. |
| Differentiation | `PASS` | This is a protocol/network integration and fee/outcome safety layer on an already-accepted primitive, not a newly named oracle, repeated E5 claim, or cosmetic frontend. |
| Claim-to-code | `PASS` at admission | Every new fee, result, deployment, and canonical-read claim has a proposed interface/test/network evidence row below; it cannot be submitted while any proof cell is pending. |
| Full lifecycle | `PASS` as an executable design | The accepted frontend already has real-wallet controls; V2 must exercise the changed browser action and full Studio Dev judgment/withdrawal to canonical state, with failure/retry proof. No script-only browser claim. |
| Scope honesty | `PASS` | Legacy Studionet, Studio Dev, demo usage, old locked test GEN, fee quote versus actual fee, and missing adoption remain separately labeled. |

### Evidence Authority Matrix (consequential V2 paths)

| Claim / representation | Byte controller and authority | Deterministic binding / freshness / anti-replay | Semantic role only after checks | Invalid/missing result and blocked consequence | Required negative test |
| --- | --- | --- | --- | --- | --- |
| Original + `can-modif` public procurement disclosure, official SPARQL JSON | Publications Office TED; caller supplies only bounded publication ID, not body/URL | Exact graph constructed in contract; locked publication/UUID/version, buyer, procedure, contract and previous-link IDs; append-only attempt/publication lock | Validators judge scope against co-ratified allowance | `UNVERIFIABLE`/`RETRYABLE`; no contractor credit or negotiation | Hash-stable actor mirror, wrong prior/version/objective/buyer/contract, injected payout instructions leave GEN/hard state unchanged |
| E5 single-lot completion, official SPARQL JSON | Publications Office TED; caller supplies bounded publication ID only | Exact official graph; publication/UUID/version, previous original, buyer, procedure, contract, one lot and payment/penalty presence; attempt history | Validators judge locked closeout standard | `UNVERIFIABLE`/`RETRYABLE`; no retention release/negotiation | Valid-digest wrong lot/contract/actor, prompt injection, duplicated/missing fields; zero credit |
| Protocol-fee quote and finalized fee receipt | Studio Dev RPC/consensus, not a claimant-hosted procurement fact; wallet user authorizes an exact transaction | Quote tied to Studio Dev chain 61997, contract/method/args/application value and measured profile, used once; receipt hash/status/execution and fee fields read from same chain | None; this is deterministic protocol accounting, never LLM evidence | No quote/invalid chain -> do not send; execution failure -> no app success claim, refresh canonical state; do not fabricate refund | Wrong chain/address/args/stale quote, malformed fee estimate/receipt, `FINALIZED`+execution error, duplicate submit |

## Scope, non-goals, and headroom

- In scope: one coherent v0.6 RC migration, one active Studio Dev deployment, measured fee profile, network-derived pre-signing quote, fee/outcome-aware shared transaction flow, updated same-origin reads and wallet network, source/adapter/receipt tests, and fresh canonical/browser lifecycle. Preserve current UI shell and all accepted business semantics.
- Out of scope: multi-lot E5, cumulative amendment chains, co-funder callbacks, new judgment categories, legal/physical completion claims, adoption claims, mainnet, fee discounts/gasless promise, recovering user-abandoned legacy Studionet purses, or automatic wallet creation/funding.
- Future headroom: cumulative amendment chain after an exact linked multi-notice fixture; a two-agreement completion portfolio after authoritative per-lot contract binding; an independently owned co-funder integration after real adopter evidence. None is V2 work.

## Phase 3 exit gate

`PASS` for one selected substantial `EXTENDS` design. Phase 4 completed safety, value, before/after, claim-to-code, UI, and rollout details before implementation began. If the RC toolchain or Studio Dev source cannot support the full value-bearing lifecycle, return this idea to backlog rather than submitting a copy-only redeploy.

## Phase 4 — Frozen user journey and claims

The sponsor connects an EVM wallet on Studio Dev, creates a 2 GEN agreement against the official original TED notice, and sees the measured maximum *network* fee separately before signing. The contractor ratifies; either party requests review against the official modification; a finalized successful verdict credits the locked agreement purse (or opens the existing negotiation). The credited party withdraws. The sponsor may then open a 1 GEN E5 retention closeout, the contractor ratifies, either party requests the official E5 review, and the credited party withdraws. Every write gets the same fee-confirmation and transaction outcome path. The app reloads canonical contract views on completion and clearly distinguishes an accepted/decided transaction from a successful execution; failed execution cannot be presented as a successful agreement or settlement. The user can retry a failed transaction only after a fresh state read and quote. On the live app, the selected account and IC view RPC must both be Studio Dev. No migration of old Studionet state is promised.

There is **no new onchain verdict or transfer rule**. The new consequence is operational: a current-network user can actually execute the accepted validator-controlled settlement while authorizing a bounded protocol-fee budget and observing its real outcome. Fee quote is an upper bound, not a guaranteed charge or refund. The wallet remains the signer; the UI never computes a fake balance, fee, transaction hash, or finality.

### Delta claim-to-code matrix

| New claim | Contract method/state | View/read | Test | Studio Dev evidence required |
| --- | --- | --- | --- | --- |
| The same accepted adjudication and conservation work under the v0.6 runner | `request_review`, `request_closeout_review`, `_valid_*_result`, `_settle_*_credits`; one `ScopeSealAccord` class | `get_agreement`, `get_review_attempt`, `get_closeout`, `get_closeout_attempt`, `get_accounting` | Accepted direct suite plus new runner/metadata and malicious-result regression | New finalized review receipts, attempt/verdict reads, conservation reads |
| Sponsor can safely fund 2 GEN agreement and 1 GEN retention separately from network fee | `create_agreement`, `open_closeout` payable; application ledger unchanged | Agreement/closeout and `get_accounting`; Studio Dev wallet/RPC balance | Exact value, wrong value, malformed/missing fee estimate, wrong-chain tests | Safe receipt projection + before/after purse/account balances in GEN |
| Every wallet write shows a measured maximum fee before signing and sends its distribution/value | No new state; all fourteen public writes remain the only user mutations | Fee-profile identity and SDK estimate returned for exact chain/address/method/args/value | Real-SDK adapter test, stale/wrong-args/wrong-chain quote, distribution bounds | Browser-local quote capture and finalized receipt on Studio Dev; no private RPC payload |
| Finalized is not confused with successful execution | Existing writes must not be labeled successful on a failed VM result | `waitForFinalization`, execution result, affected canonical views | `FINALIZED`+execution failure, accepted-but-pending, timeout/retry, duplicate click | Safe status/result projection, final canonical reload after successful and failed attempt |
| User can see actual network fee and refund distinctly from app GEN | No contract fee accounting; application `total_received/locked/credited/withdrawn` unchanged | Receipt's protocol-fee fields and wallet balance; `get_accounting` | Missing/variant receipt fields, no invented refund, numeric GEN formatting | Safe fee fields + wallet balance comparison, explicitly labeled budget/actual/refund |
| Live browser uses the new deployment throughout | Fresh Studio Dev contract, same writes/views | Studio Dev explorer, IC RPC proxy, wallet chain 61997 | RPC/CORS, wallet-account preflight, browser UI control/finality/reload | New deployment identity, browser-local journey, live Vercel URL and CI |

Cells in the final evidence column describe **required future proof**, not evidence already obtained. Phase 6/7 must replace each with a specific file/receipt/link before the dossier can become `VERIFIED` or submitted.

### Write-method safety cards for the API-family port

All fourteen writes are changed at the runner/client boundary even though their business semantics must remain identical. These cards freeze the allowed state, caller, transaction-time rule, idempotency and value effects *before* editing contract source. "Duplicate rejects" means the second call cannot move value or hard state. Every row's negative tests also check wrong network/fee quote in the adapter; the contract itself is not trusted to validate a client-side quote.

| Public write | Caller; allowed / forbidden state | Time gate; repeat behavior | Application value and canonical reads; required negative tests |
| --- | --- | --- | --- |
| `create_agreement` | New sponsor = sender; unique ID only / duplicate, zero or same contractor forbidden | `now < ratify < review`; duplicate rejects | Receives **2 GEN** into lock; agreement/index/accounting. Test wrong value/ID/actor, past/equal deadlines, duplicate, unchanged ledger on reject. |
| `ratify_agreement` | Contractor; `DRAFT` / all others | `now < ratify_deadline`; duplicate rejects | No value; agreement. Test wrong caller/state and `deadline-1`, `=`, `+1` with stale phase. |
| `request_review` | Either party; `ACTIVE` or `RETRYABLE` / all others | `now < review_deadline`; same locked publication can retry, conflicting one rejects | May unlock **2 GEN** into credits or open negotiation only after validated source/result; agreement/attempt/accounting. Test wrong caller/state/publication, source invalid, injection, malicious validator, duplicate finalized, `deadline-1/=/+1` stale phase, no early credit. |
| `propose_split` | Sponsor; `NEGOTIATION` / all others | `started <= now < deadline`; new nonce replaces proposal, not funds | No value; agreement. Test wrong caller/state/allocation/nonce boundary and start/deadline `-1/=/+1`; ledger unchanged. |
| `accept_split` | Contractor; `NEGOTIATION` with current proposal / all others | `started <= now < deadline`; duplicate/stale nonce rejects | Credits exactly **2 GEN** across parties once; agreement/accounting/credit views. Test wrong caller/state/nonce/boundaries, no double credit. |
| `recover_expired` | Sponsor; `DRAFT`, `ACTIVE`, `RETRYABLE`, `NEGOTIATION` / settled or closed | `now >=` state-specific deadline; duplicate rejects | Sponsor credited **2 GEN** once; agreement/accounting. Test wrong caller/state, early/equal/late with stale phase, no double recovery. |
| `withdraw_credit` | Party with positive credit; `SETTLED` / all others | N/A: credit and settled state, not clock, authorize withdrawal; repeat rejects | Debits credit **before** transferring up to **2 GEN**; agreement/credit/accounting and wallet receipt/balance. Test wrong caller/state/no credit, repeat, transfer failure atomicity, no double-withdraw. |
| `open_closeout` | Sponsor of `CLOSED` agreement and no closeout / all other states or duplicate | `now < ratify < review`; duplicate rejects | Receives **1 GEN** retention; closeout/accounting. Test wrong caller/state/value/lot, deadlines `-1/=/+1`, duplicate, ledger unchanged. |
| `ratify_closeout` | Contractor; `OFFERED` / all others | `now < ratify_deadline`; duplicate rejects | No value; closeout. Test wrong caller/state and `deadline-1/=/+1` stale phase. |
| `request_closeout_review` | Either party; `ACTIVE` or `RETRYABLE` / all others | `now < review_deadline`; same locked E5 can retry, different one rejects | May credit **1 GEN** retention or open negotiation only after official-binding/result checks; closeout/attempt/accounting. Test wrong caller/state/E5, forged/injected source, malicious validator, duplicate finalized, `deadline-1/=/+1`, no early credit. |
| `propose_closeout_split` | Sponsor; `NEGOTIATION` / all others | `started <= now < deadline`; new nonce replaces proposal | No value; closeout. Test wrong caller/state/allocation, start/deadline boundaries, ledger unchanged. |
| `accept_closeout_split` | Contractor; `NEGOTIATION` with current proposal / all others | `started <= now < deadline`; duplicate/stale nonce rejects | Credits exactly **1 GEN** once; closeout/accounting/credit views. Test wrong caller/state/nonce/boundaries, no double credit. |
| `recover_closeout` | Sponsor; `OFFERED`, `ACTIVE`, `RETRYABLE`, `NEGOTIATION` / settled or closed | `now >=` state-specific deadline; duplicate rejects | Sponsor credited **1 GEN** once; closeout/accounting. Test wrong caller/state, early/equal/late stale phase, no double recovery. |
| `withdraw_closeout_credit` | Party with positive credit; `SETTLED` / all others | N/A: credit and settled state, not clock, authorize withdrawal; repeat rejects | Debits credit **before** transferring up to **1 GEN**; closeout/credit/accounting and wallet receipt/balance. Test wrong caller/state/no credit, repeat, transfer failure atomicity, no double-withdraw. |

### Value-destination matrix

| Value | Source and lock | Release/refund/forfeit destination | Terminal, duplicate/late/retry behavior | Canonical proof |
| --- | --- | --- | --- | --- |
| Agreement purse **2 GEN** | Sponsor at `create_agreement`; contract `total_locked` | Within baseline: contractor 2; material amendment: negotiated split 0–2; expiry: sponsor 2 | One credit allocation then each withdrawal, `CLOSED`; duplicate review/accept/recovery/withdraw cannot double spend; invalid source retains lock for retry or later recovery | `get_agreement`, `get_credit_gen`, `get_accounting`, receipt/party balances |
| Completion retention **1 GEN** | Sponsor at `open_closeout`; contract `total_locked` | E5 release: contractor 1; negotiation: agreed 0/1 split; expiry: sponsor 1 | One allocation then `CLOSED`; missing/invalid E5 retains lock for retry or later recovery | `get_closeout`, `get_closeout_credit_gen`, `get_accounting`, receipt/party balances |
| Studio Dev protocol-fee budget | Transaction signer authorizes measured maximum; protocol/consensus reserves outside contract escrow | Actual charge to protocol; unused budget refund to signer under network rules, *never* application `total_received` | Per tx only; no quote means no submission; retry requires fresh quote and canonical read; failure charge/refund must come from actual receipt, not inference | `estimateTransactionFees` quote, safe receipt fee fields, wallet balance before/after |
| Application credits | Agreement/closeout lock after validated verdict, accepted proposal, or expiry | Named sponsor/contractor withdrawal; no arbitrary recipient | Debit before transfer; zero credit rejects; no orphaned credit in settled/closed states | Credit views, `get_accounting`, receipt and destination balance |

Preserved invariant: `total_received = total_locked + total_credited + total_withdrawn` for **application GEN only**. No protocol fee is added to this contract ledger, and no unallocated purse is abandoned by V2. Broken Studio Dev test revisions, if any, must be labeled abandoned before replacement and receive no further value.

### Measurement, rollout, and rollback

Before V2: accepted V1 head `2488bf6`; 22 contract methods, 118 accepted tests, 61999-only deployment, no protocol-fee quote or fee/result display; the accepted closeout is `CLOSED / RELEASE_RETENTION`. After V2: record the exact new source commit, test count and CI run, 61997 deployment/Explorer, date/time window and **number of distinct new Studio Dev agreements closed**; report new review/closeout/withdraw hashes, canonical states and application GEN balance, browser quote versus actual charge/refund. The count is computed from fresh contract indexes/receipts in that window, not from page visits or an invented adoption metric. Demo accounts are not independent customers.

Stage RC compatibility and fee handling locally, then lint/direct tests, then one bounded Studio Dev smoke, then the full small-GEN lifecycle, browser, publish and Portal packet. Preserve the accepted Studionet deployment and its evidence as archival. If the runner/source/API migration or Studio Dev fee path cannot safely support settlement, stop before any new value, mark V2 `BLOCKED`/return to backlog, and leave the accepted main deployment untouched. Do not silently fall back to the obsolete network. There is no onchain rollback of a funded new contract; inspect and recover via its existing state machine where possible, or explicitly abandon a broken revision per workspace rule.

## Phase 4 exit gate

`PASS` as a specification. Every new claim has a code/view/test/network-proof slot; all ported consequential writes have caller/state/time/idempotency/value/negative coverage; each purse, credit, and protocol-fee destination is separated. These are obligations to be executed, not a claim that Phase 5–7 evidence exists.

## Phase 5 implementation and local verification

The accepted one-contract design is now ported as one coherent GenVM v0.3 unit: pragma `v0.3.0`, the concrete `py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng` runner, explicit v0.3 imports, exactly one `ScopeSealAccord(gl.contract.Contract)` subclass, sandboxed `gl.vm.run_nondet_default` validators, and `gl.chain.Account(...).emit_transfer` value exits. The contract remains ASCII and exposes the same 22 methods: 8 views and 14 writes.

The Studio Dev frontend adapter now configures the selected account when creating the real SDK client, switches the selected EVM provider to chain 61997, estimates protocol fees for the exact contract/method/arguments/application value, obtains explicit approval of the maximum network fee before wallet signing, supplies the returned distribution and fee value to the write, waits separately for decision and finalization, rejects finalized execution failures, and reports receipt-derived actual/refunded fee fields without inventing missing values. Application value remains exactly 2 GEN for an agreement and 1 GEN for a closeout and is visually separated from protocol fees. The shared transaction status preserves the submitted hash, shows preparing/quoted/outcome states, and canonical lifecycle actions still reload contract views after success.

Local command:

```text
npm run check
```

Fresh local result on 2026-09-21: GenVM lint passed for `ScopeSealAccord` with 22 recognized methods; 59 Python direct/static tests passed; 26 deployment/proxy helper tests passed; 48 frontend tests across 12 files passed; TypeScript passed; and the Vite production build completed. These local checks do not substitute for Studio Dev execution, browser-wallet, payout, CI, publication, or Portal evidence.

An earlier isolated feasibility probe resolved `genlayer-py v0.19.0-rc.2`, `genlayer-test v0.30.0-rc.2`, and `genvm-linter v0.11.1-rc.2` to concrete upstream commits. The same runner linted a one-class `run_nondet_default` probe with 2 methods and its direct action passed (`1 passed`). The obsolete accepted test fixture could not be reused unchanged because its `v0.2.16` manager artifact is no longer available; the production source and fixture were therefore migrated together and the full 58-test suite now passes. The RC2 semantic linter understands the v0.3 SDK, but its safety reachability table omits the renamed safe API; the project wrapper adds only that verified rename before invoking the upstream linter. Neither the probe nor local suite is network proof.

### Phase 5 exit gate

`PASS` locally. The implementation matches the frozen V2 scope and all local required checks are green. Phase 6 remains open until browser-local RPC/CORS, real SDK adapter, failure/retry, canonical reload, and changed-journey evidence are verified; Phase 7 remains open until a separately authorized Studio Dev deployment and small-GEN lifecycle exist.

## Phase 6 browser and regression verification

The local app was opened in the user's Chrome browser on 2026-09-21. Chrome displayed `Studio Dev RPC ready` through the same-origin proxy with no captured console warning/error, the wallet picker listed distinct EIP-6963/injected OKX and MetaMask providers, and the disconnected create page showed **2 GEN** plus `Connect wallet to create`. No provider was selected, no chain switch, signature, fee authorization, or contract write occurred. Evidence: [`docs/evidence/studio-dev/milestones/MS-002/local-browser.md`](../../evidence/studio-dev/milestones/MS-002/local-browser.md).

The replacement deployment was then verified again as a fresh observer in Chrome. The same-origin proxy visibly reached `Studio Dev RPC ready` without browser console warnings/errors. Canonical reads showed `scopeseal-v2-e5-003` as `CLOSED`, its closeout as `CLOSED / RELEASE_RETENTION / 0 GEN`, and the deliberately mismatched `scopeseal-v2-smoke-002` closeout as `RETRYABLE / UNVERIFIABLE / 1 GEN`. The centered picker listed the detected EIP-6963 and injected OKX/MetaMask providers. Selecting the injected OKX provider connected the authorized sponsor `0xc495...8272` on chain 61997 and exposed only sponsor-eligible actions. Opening the clickable account control showed the full account and a disconnect action; disconnect cleared the selected account and hid all write controls. This proves browser-local RPC/CORS, canonical success and non-penalizing retry reads, provider selection, role gating, and logout behavior against the replacement deployment.

The connected Chrome sponsor then created `scopeseal-v2-browser-001` through the actual frontend. Transaction `0x464cca7bf73027cd5c482a71de3ccb1043d84d994d08a67912bb5893eb3aa372` finalized successfully; the UI showed maximum network fee `0.000378544800010352 GEN`, actual fee `0.000078639500000823 GEN`, refund `0.000299905300009529 GEN`, and application value `2 GEN` as separate quantities. Canonical reload showed `DRAFT`, exactly `2 GEN` locked, zero credits, and accounting `received=2, locked=2, credited=0, withdrawn=0`. Evidence: [browser lifecycle](../../evidence/studio-dev/milestones/MS-002/lifecycle-scopeseal-v2-browser-001.json).

The contractor ratified the same agreement, then sponsor transaction `0x8d5de08a72415b7961cea120d43fdf9e857d898df98604671dcbc2d6ca1f5666` requested review. Both finalized with successful execution. Canonical state after review was `SETTLED`, verdict `WITHIN_BASELINE`, `0 GEN` locked and `2 GEN` contractor credit. A fresh Chrome reload independently displayed these fields through the app's read path, with no connected wallet.

Contractor withdrawal transaction `0x1b59e8d5e1bb64fa0a31ae5f3491dcbb3e708a3fca33b6cfb36f2cb51a5c867f` finalized with successful parent execution and emitted a 2 GEN external message to the correct recipient. The ledger became `CLOSED`, showing 2 GEN withdrawn, but repeated RPC balance reads still showed 2 GEN in the contract and no corresponding contractor increase. Therefore the external payout is **not proven**. This deployed revision is `ABANDONED_TESTNET`; do not send it more value or claim a complete lifecycle. See [withdrawal audit](../../evidence/studio-dev/milestones/MS-002/withdrawal-audit.json). A replacement source uses the official EOA external-message interface; the bounded replacement proof follows.

## Phase 7 Studio Dev deployment and changed lifecycle

The replacement source at commit `a4239e93f6e24ad3a23658a155e9be144ac03986` was deployed on Studio Dev as [contract `0xAD2c9170ec79D5772167D92A8335dfd78E3660Bf`](https://explorer-studio-dev.genlayer.com/address/0xAD2c9170ec79D5772167D92A8335dfd78E3660Bf), [transaction `0xe030b1106531df98b376cf1c508b28b38f430f642087dee678b134e96ae5c97f`](https://explorer-studio-dev.genlayer.com/tx/0xe030b1106531df98b376cf1c508b28b38f430f642087dee678b134e96ae5c97f). The deploy receipt finalized with `FINISHED_WITH_RETURN` and `MAJORITY_AGREE`; actual fee was `0.000079138750000823 GEN` with `0.099920861250009529 GEN` refunded. A fresh read found deployed code, `0 GEN` contract balance and zero accounting, and matched the authorized sponsor/contractor pair. This proves deployment only, **not** a successful payout or complete lifecycle.

On the replacement, sponsor created `scopeseal-v2-smoke-002` with 2 GEN in [transaction `0x95fd1732b03c2c225417a786d67f719666a5ef830dd7221f89075f075ce4cb9a`](https://explorer-studio-dev.genlayer.com/tx/0x95fd1732b03c2c225417a786d67f719666a5ef830dd7221f89075f075ce4cb9a). It finalized with successful execution; canonical `DRAFT` had exactly 2 GEN locked, accounting `received=2 / locked=2 / credited=0 / withdrawn=0`, and a separate balance read also showed 2 GEN in the contract. Contractor [ratification `0x38fad069c1262f5ce8eccfd2df44eb41f0b9ef638e27807fb1f69e2136d74fb1`](https://explorer-studio-dev.genlayer.com/tx/0x38fad069c1262f5ce8eccfd2df44eb41f0b9ef638e27807fb1f69e2136d74fb1) then finalized successfully; canonical agreement became `ACTIVE` with 2 GEN still locked and no credits. Sponsor [review `0x920f764d600f0b0fd7cd9d073d04526636607dfb15d81ad0f17fc0a5faf48a30`](https://explorer-studio-dev.genlayer.com/tx/0x920f764d600f0b0fd7cd9d073d04526636607dfb15d81ad0f17fc0a5faf48a30) finalized with successful execution and `MATERIAL_AMENDMENT`, opening `NEGOTIATION` until `2026-09-21T03:25:21Z`. The exact-call simulation incorrectly returned `Negotiation window is closed` while the authoritative latest-block timestamp was still inside that interval. A bounded fallback used the default Studio Dev maximum only after re-reading the canonical state and block time. Sponsor [proposal `0xafbd9e952a93b227c14cabf0b8a665272316602db86561f7b1897a8001f606f8`](https://explorer-studio-dev.genlayer.com/tx/0xafbd9e952a93b227c14cabf0b8a665272316602db86561f7b1897a8001f606f8) and contractor [acceptance `0x19e77293d2e917fb2cc80eb90ed2feaac7bbf4d71bd4b2579ec6741f34246c2c`](https://explorer-studio-dev.genlayer.com/tx/0x19e77293d2e917fb2cc80eb90ed2feaac7bbf4d71bd4b2579ec6741f34246c2c) both finalized with successful execution, settling a 1 GEN / 1 GEN split. Contractor [withdrawal `0x36855998daa7ee1fa6c41b793bf0f6fec5cec08db5f4a0771b22dd2f7219f040`](https://explorer-studio-dev.genlayer.com/tx/0x36855998daa7ee1fa6c41b793bf0f6fec5cec08db5f4a0771b22dd2f7219f040) and sponsor [withdrawal `0x732c6bd475fb9fd76d699302c7ca65cb1f6c4d161b81ba62fa93a9883ee5a488`](https://explorer-studio-dev.genlayer.com/tx/0x732c6bd475fb9fd76d699302c7ca65cb1f6c4d161b81ba62fa93a9883ee5a488) then paid exactly 1 GEN each. Final state is `CLOSED / NEGOTIATED`; accounting is `received=2 / locked=0 / credited=0 / withdrawn=2`, and contract balance is exactly `0 GEN`. This proves the replacement external-transfer implementation live. Evidence: [replacement smoke lifecycle](../../evidence/studio-dev/milestones/MS-002/lifecycle-scopeseal-v2-smoke-002.json) and [payout audit](../../evidence/studio-dev/milestones/MS-002/payout-audit-scopeseal-v2-smoke-002.json).

That same agreement then deliberately supplied a completion notice that was not linked to its locked original notice. Validators returned `UNVERIFIABLE`, the closeout moved to `RETRYABLE`, and no GEN was credited or transferred; its 1 GEN remained locked for deadline recovery. This is the live non-penalizing authenticity failure path, not a successful completion claim. The recovery command independently refused before the exact review deadline, proving the transaction-time gate remained authoritative.

A separate E5-bound lifecycle `scopeseal-v2-e5-003` locked original publication `00547772-2025` and the exact buyer, procedure, contract, and notice identifiers used by completion publication `00734925-2025`. Its initial 2 GEN agreement intentionally exercised expired-draft recovery and sponsor withdrawal, then opened a separate 1 GEN closeout. [Review `0x6b34e1c7bc2985e91ad5e449b4cb9a546f29778071ee9a1d4ed2ce22b9187ad6`](https://explorer-studio-dev.genlayer.com/tx/0x6b34e1c7bc2985e91ad5e449b4cb9a546f29778071ee9a1d4ed2ce22b9187ad6) finalized with successful execution, complete authority coverage, `RELEASE_RETENTION`, and deterministic `CREDIT_CONTRACTOR`. [Contractor withdrawal `0x035d7a6700792487cc94ec4a182ab833154171d8540159e863ca97dc6a5bd66c`](https://explorer-studio-dev.genlayer.com/tx/0x035d7a6700792487cc94ec4a182ab833154171d8540159e863ca97dc6a5bd66c) then paid exactly 1 GEN. Canonical closeout is `CLOSED / RELEASE_RETENTION`, with zero locked value and zero credits. Evidence: [E5 lifecycle](../../evidence/studio-dev/milestones/MS-002/lifecycle-scopeseal-v2-e5-003.json) and [closeout audit](../../evidence/studio-dev/milestones/MS-002/closeout-audit-scopeseal-v2-e5-003.json).

### Initial read-only preflight (before deployment)

`npm run studio-dev:inspect` reached Studio Dev chain `61997` at `2026-09-20T23:32:12.809Z`, found both authorized signer roles without exposing keys, observed sponsor balance `90.987589115499869836 GEN` and contractor balance `1.000404856500050706 GEN`, and received an enabled network fee policy with a current default maximum of `0.100000000000010352 GEN`. No MS-002 deployment exists, so the deterministic decision is `DEPLOY`. This command signed and submitted nothing. Deployment remains authorization-gated and requires the exact contract source to be committed first.

### Phase 6 exit gate

`PASS`. Fresh `npm run check` proved 59 Python tests, 26 deployment/proxy tests, 48 frontend tests, TypeScript, GenVM lint, and production build. Chrome proved browser-local RPC/CORS, detected-wallet selection, connected-account role gating, canonical success/retry reads, and disconnect. The earlier connected browser lifecycle additionally proves quote/approval/finalization/canonical reload behavior; the replacement reads prove the active deployment is now wired through the same adapter.

### Phase 7 exit gate

`PASS`, subject only to the already-scheduled recovery of the separate 1 GEN non-penalizing retry after its exact deadline. The active deployment is source-bound, its agreement payout reached zero contract balance, its E5 closeout reached `CLOSED / RELEASE_RETENTION` and paid 1 GEN, and its authenticity mismatch remained non-penalizing. The pending recovery is an accounting closeout, not missing proof of the selected consequential path; Phase 8 publication will not be finalized until that recovery is attempted at the legal time.

## Phase 8 publication

`PENDING`. Pre-push hygiene, public GitHub push, Vercel production deployment, and live URL verification follow after the deadline recovery and final evidence refresh.
