# MS-001 — Completion Retention Closeout

Status: `BUILDING`

## Pinned accepted baseline

- Git: `f4d7cec499a39846ad8079b2d630d074aea6f039`
- Portal: ScopeSeal Accord Revision 1, `Published`, verified 2026-09-08 at
  https://portal.genlayer.foundation/builders/explorer/scopeseal-accord
- Studionet contract: `0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879`
- Contract source: `5457d3195156bc6ec969b9b6453a7bdc83befc40`
- Contract/API family: `ScopeSealAccord/1` with
  `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`
- Live app: https://scopeseal-accord.vercel.app

## Phase 3 — admission and non-overlap

### Exact delta

After a ScopeSeal agreement reaches `CLOSED`, its sponsor can fund a separate 1 GEN retention and lock
a single TED lot plus a natural-language completion-release standard. The original contractor ratifies
that closeout. Validators independently fetch the exact official TED E5 completion notice and judge
whether its authenticated completion facts satisfy the locked standard. Deterministic code either opens
the 1 GEN contractor credit, keeps the retention locked for closeout negotiation, or records a
non-penalizing retryable attempt. Expiry and withdrawal reconcile the retention on every path.

This is `NEW`, not a re-description of Revision 1. The accepted product judges a `can-modif` notice
before or during performance and governs a 2 GEN amendment purse. MS-001 judges an E5 completion notice
after performance and governs an independently funded 1 GEN retention with separate state, attempts,
proposal nonce, credits, recovery, views, frontend actions, and evidence.

### Seven-part delta fingerprint

Trust problem: Sponsor and contractor should not trust either party or a private closeout platform to decide whether an authoritative completion notice satisfies their co-ratified retention-release standard.

Actors/adversary: The sponsor benefits from retaining or reclaiming the 1 GEN retention; the contractor benefits from release; either may overstate the meaning of a sparse or ambiguous completion record.

Evidence class + authenticity mechanism: Validators fetch only the exact official Publications Office TED SPARQL graph constructed from a syntactically bounded E5 publication number. Deterministic checks require form `completion`, notice type `compl`, publication, UUID/version, previous-publication link, buyer, procedure, contract, and exactly one locked lot plus its payment/penalty records. Caller URLs and bodies are never accepted.

Consensus question: Does the one authenticated official completion entity, including its payment, penalty, and discrepancy explanation, semantically satisfy the parties' locked completion-release standard, require bilateral retention negotiation, or lack enough authoritative meaning to decide?

State machine: `NONE -> OFFERED -> ACTIVE -> RETRYABLE | NEGOTIATION | SETTLED -> CLOSED`; attempts are append-only, proposals use nonces, and clock bounds are enforced by every affected write.

Direct consequence: `RELEASE_RETENTION` opens exactly 1 GEN contractor credit; `NEGOTIATE_RETENTION` keeps 1 GEN locked until an accepted 0-or-1 GEN split; invalid/unavailable evidence moves no GEN; expiry opens 1 GEN sponsor credit; withdrawal closes the closeout.

Reuse surface: Procurement payment platforms, public-works sponsors, auditors, and co-funders can fund, ratify, review, negotiate, recover, withdraw, and read a canonical single-lot completion closeout without copying TED acquisition or semantic adjudication logic.

### Five-item Milestones quality bar

1. `PASS` — adds a new official evidence class, state machine, value purse, user journey, and lifecycle.
2. `PASS` — does not rename, restyle, reorganize, or recount the accepted amendment primitive.
3. `PASS` — uses canonical ScopeSeal parties and agreement identity only after the accepted agreement is closed.
4. `PASS` — the E5 retention delta and why it matters are independently documentable.
5. `PASS` — extends ScopeSeal from change-order settlement to real post-performance retention closeout.

### Mandatory 14 gates for the new surface

| Gate | Result | Reason |
| --- | --- | --- |
| Replacement | `PASS` | A signed database can store the E5 values but cannot neutrally interpret a co-ratified completion standard before retention rights change. |
| Judgment | `PASS` | Whether sparse official payment, penalty, and explanatory facts satisfy a qualitative closeout standard is semantic rather than a fixed arithmetic predicate. |
| Evidence availability | `PASS` | A bounded official SPARQL probe returned E5 records and the exact single-lot fixture `00734925-2025`; safe probe output included only IDs, field presence/counts, and numeric facts. |
| Evidence authenticity | `PASS` | The contract constructs the official endpoint and graph, verifies all locked bindings and exact single-lot coverage, accepts no actor-controlled URL/body, and makes failure retryable with no consequence. The complete matrix follows. |
| Equivalence | `PASS` | Consensus meaning is the exact evidence identity/coverage, one entity verdict enum, aggregate verdict, and source status; rationale wording is excluded. |
| Consequence | `PASS` | The finalized accepted result directly controls a separately funded 1 GEN retention credit or the only legal negotiation path. |
| Adversarial | `PASS` | Sponsor and contractor have opposing retention incentives and neither supplies the official evidence bytes or verdict. |
| State model | `PASS` | One closeout per agreement, role checks, append-only attempts, nonced proposals, independent credits, direct time guards, and explicit release/refund/negotiation/withdraw destinations prevent overwrite and double settlement. |
| Reuse | `PASS` | Other builders can attach the bounded closeout primitive to a canonical closed agreement and consume typed views without forking judgment logic. |
| Contract count | `PASS` | The existing single contract owns agreement, closeout, evidence, and value. A second pass-through contract would add no trust boundary and is excluded. |
| Differentiation | `PASS` | The workspace has amendment, incident, filing, tariff, appeal, and allocation primitives, but no official E5 post-performance retention closeout bound to an accepted ScopeSeal agreement. |
| Claim-to-code | `PASS` | Every new claim is allocated to concrete methods/state/views/tests/network evidence in the Phase 4 matrix; no documentation-only claim is admitted. |
| Full lifecycle | `PASS — PLANNED` | The selected slice requires real frontend writes through finality, canonical reload, and a Studionet E5 release or negotiation path before `VERIFIED`; selection does not claim that proof already exists. |
| Scope honesty | `PASS` | E5 reports official disclosure, not physical performance truth or legal compliance. Single-lot only; no production adoption, multi-lot allocation, or external consumer is claimed. |

### Evidence Authority Matrix

| Path / consequential claim | Evidence representation and byte control | Authority and deterministic verification | Canonical binding, freshness, anti-replay | Semantic role after verification | Failure / blocked consequences | Required negative test |
| --- | --- | --- | --- | --- | --- | --- |
| `EA-CLOSEOUT-COVENANT`: parties accepted the retention standard | Sponsor's payable transaction plus original contractor's ratification; actors control only their own transactions and text | GenLayer transaction sender/value/state checks; exact 1 GEN; agreement already `CLOSED`; same sponsor/contractor; bounded lot/policy/deadlines | Agreement ID, parties, lot, standard, deadline, one-closeout key; ratification before deadline; duplicate prohibited | Locks the objective against which official evidence may later be interpreted | Revert; no review, negotiation, credit, or accounting change | Wrong actor/agreement/state/value/lot/deadline and duplicate open/ratify leave state/accounting unchanged |
| `EA-E5-NOTICE`: the requested official record is an E5 completion for the locked procurement and lot | Validator fetches the exact official TED graph; Publications Office controls graph bytes; caller supplies only publication number | Official host/graph construction; form `completion`; type `compl`; publication, UUID/version, previous publication, buyer, procedure, contract; exactly one completion entity for locked lot; payment/penalty fields present | First valid publication lock; publication+UUID/version identity; link to agreement original publication; buyer/procedure/contract/lot; attempt number and review deadline | Supplies bounded completion/payment/penalty/explanation facts to the semantic decision | `UNVERIFIABLE`/`RETRYABLE`; release, negotiation, credit, routing, and settlement blocked | Valid-looking/digest-stable claimant mirror, wrong previous notice/buyer/procedure/contract/lot, duplicate/extra lot, replayed publication, unavailable source |
| `EA-CLOSEOUT-VERDICT`: completion satisfies or conflicts with the standard | Leader/validators generate structured result; no party controls consensus output | Meaning validator independently reacquires E5 evidence; deterministic schema, exact ID/coverage, enum, aggregate/entity match, and consequence derivation | Agreement, closeout, attempt, evidence fingerprint, one expected `COMPLETION` entity; no extra/missing/duplicate entities | Only verified E5 meaning may classify `RELEASE_RETENTION`, `NEGOTIATE_RETENTION`, or `UNVERIFIABLE` | Invalid output maps to retryable/no consequence or reverts before mutation; all GEN/hard state blocked | Malicious leader/validator output with wrong IDs, extra/missing entity, invalid enum, mismatched aggregate, injected consequence |

Provenance tripwire: even if claimant-hosted completion JSON has stable bytes and a matching digest, it
cannot enter the evidence path. A wrong official previous-publication link or any wrong canonical
objective/entity/actor/version/lot binding must remain `RETRYABLE` with the 1 GEN retention still locked,
zero credits, and no hard-state change beyond the append-only non-penalizing attempt.

### Real evidence fixture

- Completion publication: `00734925-2025`
- Notice UUID/version: `e51ffa34-b755-4d6d-83e9-5e51448bffb1-01`
- Previous publication: `00547772-2025` (TED notation `547772-2025`)
- Buyer: `6912131539`
- Procedure: `d9f4bc69-ef7d-42f6-ad8f-802fd332b0a6`
- Contract: `3/PNO/2025`
- Lot: `LOT-0001`
- Official completion facts observed: payment `544332 PLN`, penalty `0 PLN`, and an authority-published
  explanation that payment followed the contract and submitted offer.

The fixture demonstrates source readiness only. It is not network lifecycle evidence until the changed
contract is deployed and the result is finalized and read back from canonical state.

## Phase 4 — frozen specification

### Scope and user journey

1. A canonical agreement must already be `CLOSED`; the accepted amendment lifecycle is unchanged.
2. The original sponsor opens exactly one closeout for that agreement, locks a single TED lot and a
   bounded completion-release standard, sets ratification/review/negotiation times, and attaches exactly
   1 GEN.
3. The original contractor ratifies before the closeout ratification deadline.
4. Either party requests review of one syntactically bounded TED completion publication before the
   review deadline.
5. Validators independently fetch the official E5 graph. Contract code rejects wrong or incomplete
   authority bindings before semantic judgment can cause a consequence.
6. `RELEASE_RETENTION` settles 1 GEN to contractor credit. `NEGOTIATE_RETENTION` keeps the 1 GEN locked
   and opens a timed sponsor proposal / contractor acceptance flow. `UNVERIFIABLE` is retryable and
   non-penalizing.
7. On expiry, the sponsor recovers the unresolved retention to sponsor credit. Each credited party
   withdraws through the closeout-specific withdrawal; the closeout becomes `CLOSED` only when both
   credits are zero.

### Exact contract surface

New storage records:

- `Closeout`: agreement/party binding, lot, completion standard, state/verdict, ratify/review windows,
  locked completion publication, attempt count/fingerprint, negotiation times, proposal amount/nonce,
  independent 1 GEN locked amount and party credits.
- `CloseoutAttempt`: append-only source identity/status/coverage, publication UUID/version and previous
  publication binding, buyer/procedure/contract/lot, one entity verdict, aggregate verdict, derived
  consequence class, fingerprint, and bounded rationale.

New public writes:

- `open_closeout`
- `ratify_closeout`
- `request_closeout_review`
- `propose_closeout_split`
- `accept_closeout_split`
- `recover_closeout`
- `withdraw_closeout_credit`

New public views:

- `get_closeout`
- `get_closeout_attempt`
- `get_closeout_credit_gen`

The module retains exactly one validator-visible `ScopeSealAccord(gl.Contract)` class and the accepted
Depends runner/API family. No second contract, callback, migration, proxy upgrade, SDK upgrade, or raw
actor evidence is introduced.

### New verdict and settlement invariants

- Source status is exactly `COMPLETE` or `UNVERIFIABLE`; source coverage is exactly `COMPLETE` or
  `INCOMPLETE`.
- Exactly one expected entity ID, `COMPLETION`, is present once; no extra, missing, or duplicate entity.
- Entity and aggregate verdict are the same enum: `RELEASE_RETENTION`, `NEGOTIATE_RETENTION`, or
  `UNVERIFIABLE`.
- Complete source coverage is required for either hard consequence.
- Publication, notice UUID/version, previous publication, buyer, procedure, contract, and lot equal the
  locked canonical values. Form/type must be official completion / `compl`.
- Payment and penalty amount/currency records exist for the exact lot. Their economic size is evidence,
  never converted to GEN and never trusted as a direct payout instruction.
- Consequence is derived in contract code: release -> contractor credit; negotiate -> new negotiation;
  unverifiable/invalid -> no consequence.
- A rejected validator result cannot change locked value, credit, proposal, or agreement state; only a
  bounded non-penalizing attempt may be appended.

### Delta claim-to-code matrix

| Claim (new) | Contract method/state | View/read | Test | Network evidence |
| --- | --- | --- | --- | --- |
| A sponsor can fund one retention only after the canonical agreement closes | `open_closeout`; `NONE -> OFFERED`; exact 1 GEN | `get_closeout`, `get_accounting` | correct/wrong sponsor, wrong agreement state, duplicate, 0/2 GEN, deadline, unchanged rejection accounting | Finalized open tx plus canonical closeout/accounting read |
| The contractor co-ratifies the closeout standard | `ratify_closeout`; `OFFERED -> ACTIVE` | `get_closeout` | wrong caller/state, duplicate, boundary -1/equality/+1 with stale state | Finalized ratify tx and `ACTIVE` read |
| Validators judge an authentic single-lot E5 record | `request_closeout_review`; `ACTIVE/RETRYABLE -> SETTLED/NEGOTIATION/RETRYABLE` | `get_closeout`, `get_closeout_attempt`, accounting | release, negotiate, unavailable/malformed, authority mismatch, injection, malicious output, replay, exact coverage | Accepted/decided/finalized E5 tx, attempt, state, accounting, Explorer |
| A clean official closeout releases the retention | deterministic consequence from `RELEASE_RETENTION` | closeout contractor credit | 1 GEN conservation, no premature/double credit | Canonical 1 GEN contractor credit then withdrawal |
| A disputed completion opens bilateral retention negotiation | deterministic consequence from `NEGOTIATE_RETENTION` | closeout state/proposal fields | all allocations, nonce, actor, boundary, duplicate acceptance | Finalized proposal/acceptance branch if selected fixture yields negotiate |
| Expiry always recovers an unresolved retention | `recover_closeout`; unresolved -> `SETTLED` sponsor credit | closeout/accounting | state-specific deadline -1/equality/+1, wrong actor/state, duplicate | Recovery branch only if used in bounded network proof |
| Party credit is withdrawn once and closes the closeout | `withdraw_closeout_credit`; `SETTLED -> CLOSED` | closeout credit and accounting | wrong caller/state, zero/duplicate, transfer/accounting conservation | Finalized withdrawal receipt and zero closeout credits |
| Users can complete the new path in the accepted app | typed wrappers and contextual closeout route/control; real wallet/finality pipeline | canonical reload after every write | adapter value/caller/destination, route/actions/states/a11y/responsive | Chrome wallet flow on deployed contract; no script substitutes for browser actions |

### Write-method safety cards

| Method | Caller | Allowed state | Forbidden state | Temporal/expiry gate | Idempotency | Value/accounting effect | Canonical views | Required negative tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `open_closeout` | Agreement sponsor | Agreement `CLOSED`, no closeout | Every other agreement state; existing closeout | `now < ratify_deadline < review_deadline`; equality is late | One keyed closeout per agreement | Receives exactly 1 GEN; total received/locked +1 | closeout, agreement, accounting | wrong caller/state/value, invalid lot/policy/window, past/equal deadlines, duplicate; unchanged accounting |
| `ratify_closeout` | Agreement contractor | `OFFERED` | All other closeout states | `now < ratify_deadline`; equality is late | Once; duplicate rejects | None | closeout | wrong caller/state; -1/equality/+1 with phase stale; unchanged state/accounting |
| `request_closeout_review` | Sponsor or contractor | `ACTIVE` or `RETRYABLE` | `OFFERED`, `NEGOTIATION`, `SETTLED`, `CLOSED` | `now < review_deadline`; equality is late | First valid publication locks; retries require same publication; attempts append | Release moves 1 locked -> contractor credit; negotiate keeps 1 locked; unverifiable unchanged | closeout, attempt, accounting | wrong caller/state/pub; boundary; switch/replay; every authority mismatch; malicious output; no-consequence proof |
| `propose_closeout_split` | Sponsor | `NEGOTIATION` | All other states | `started_at <= now < deadline`; deadline equality late | Each legal call increments nonce; does not settle | No movement; proposal is only 0 or 1 GEN | closeout | wrong caller/state/allocation; -1/equality/+1; accounting unchanged |
| `accept_closeout_split` | Contractor | `NEGOTIATION` with proposal | All other states/no proposal | `started_at <= now < deadline`; deadline equality late | Exact current nonce once; stale/duplicate rejects | Moves full 1 GEN locked to contractor allocation plus sponsor complement | closeout, credits, accounting | wrong caller/state, absent/stale nonce, boundary, double accept, conservation |
| `recover_closeout` | Sponsor | `OFFERED`, `ACTIVE`, `RETRYABLE`, `NEGOTIATION` | `SETTLED`, `CLOSED` | At/after ratify, review, or negotiation deadline selected from current state | Once; later calls reject | Moves full 1 GEN locked to sponsor credit | closeout, credit, accounting | wrong caller/state; -1/equality/+1 with stale phase; duplicate; conservation |
| `withdraw_closeout_credit` | Credited sponsor/contractor | `SETTLED`, positive caller credit | Other state, nonparty, zero credit | `N/A` — credit is already finalized and has no expiry | Debit before transfer; zero/duplicate rejects | total credited -amount; withdrawn +amount; final zero credits -> `CLOSED` | closeout, credit, accounting, receipt | wrong caller/state, zero/duplicate, transfer recipient, no double withdrawal, invariant |

### Value-destination matrix

| Value item | Payer/source | Locked state | Release/refund/forfeit destination | Terminal states | Duplicate/late/retry behavior | Canonical proof |
| --- | --- | --- | --- | --- | --- | --- |
| Closeout retention — exactly 1 GEN | Agreement sponsor through `open_closeout` | Closeout `OFFERED`, `ACTIVE`, `RETRYABLE`, or `NEGOTIATION` | Clean E5: contractor credit 1; accepted split: contractor 0/1 and sponsor complement; unresolved expiry: sponsor credit 1; no fee/forfeit/residual | `SETTLED`, then `CLOSED` after all credits withdrawn | Duplicate open/settle/accept/recover/withdraw rejects; late review/proposal/accept rejects; retryable evidence preserves all 1 GEN locked; every residual deterministically goes to sponsor complement | `get_closeout`, `get_closeout_credit_gen`, `get_accounting`, receipt and Explorer |

### Frontend design lock — `ui-ux-pro-max`

The required skill was invoked before frontend code. The existing
`design-system/scopeseal-accord/MASTER.md` remains authoritative. The generated page override is
`design-system/scopeseal-accord/pages/completion-closeout.md`; it adds no color, typography, spacing, or
component deviations. The initial recommendation's blue/orange palette and alternate fonts are not
adopted because FE-PRESERVE requires the accepted navy/gold and Plus Jakarta Sans language.

Verified skill evidence:

- Design-system result: Minimalism & Swiss Style, low performance cost and low accessibility risk;
  page override category `General`, so no new visual direction is treated as authoritative.
- Focused domain search: `ux / multi-step form validation`; top result `Feedback / Progress Indicators`,
  followed by submit feedback, associated labels, and inline validation.
- React search: the first result was generic local-state guidance and the narrower retry returned zero
  matches. It is explicitly not used as database evidence; general React 19 patterns and the accepted
  adapter/finality architecture apply.

UI implementation:

- Preserve existing shell, navigation, palette, typography, cards, status language, wallet picker, and
  transaction-status component.
- Add a deep-linkable `/agreements/:agreementId/closeout` route and one contextual Closeout card on the
  agreement page. Do not expose it as a new top-level navigation destination.
- The page shows a compact stage indicator (`Fund -> Ratify -> Review -> Resolve -> Withdraw`) with text,
  not color alone. Only the current legal action is primary.
- Sponsor setup fields use persistent labels/helper text and blur/submit validation. Read-only agreement
  parties and procurement IDs come from canonical state and are not redundantly re-entered.
- Every write remains disabled without the exact role/network/state; shows submitted,
  accepted/decided, finalized, failed, and retry language; then reloads canonical closeout/accounting.
- Minimum 44 px controls, visible focus, logical headings, status live region, no emoji/hover-only action,
  no layout-shifting animation, reduced-motion support, no horizontal scroll at 375 px.
- FE-HONEST: explain that TED E5 is an official disclosure, not proof of physical performance or legal
  compliance. No simulated signature, balance, fee, transaction, or finality.
- FE-SURFACE: primary surface shows only parties, lot, closeout state, retention, next legal action, and
  user-facing verdict. Evidence fingerprint, raw RDF, validator rationale, and internals stay in the
  existing collapsed technical area.

### Before/after evidence and measurement

| Measure | Accepted baseline | MS-001 target | Method |
| --- | --- | --- | --- |
| Official evidence classes | Original + `can-modif` | Adds E5 completion | Source/AST review and bounded official probe |
| Consequential purses | 2 GEN amendment purse | Adds isolated 1 GEN retention | Direct accounting tests and canonical network reads |
| User lifecycle | Amendment review/negotiation/withdraw | Adds fund/ratify/E5 review/resolve/withdraw closeout | Frontend tests plus fresh Chrome wallet lifecycle |
| Public contract methods | 12 (5 view, 7 write) | 22 (8 view, 14 write), subject to lint output | `genvm-lint check` output, never manual claim if it differs |
| Direct tests | 50 accepted | Accepted 50 plus new positive/negative closeout cases | Fresh pytest collection and `npm run check` |
| Adoption | No production adoption | No adoption claim; capability moves toward real closeout use | Portal copy remains explicit; future usage metrics are backlog |

### Non-goals and deferred items

- No multi-lot completion allocation, cumulative amendments, consumer callback, co-funder contract,
  appeal layer, contract upgrade/migration, adoption claim, other network, SDK/runner upgrade, legal
  conclusion, or physical inspection proof.
- No recovery of previously user-abandoned test purses; they remain disclosed and unrelated to the new
  retention accounting.
- No redesign. The closeout page is a bounded extension of the accepted product.

### Phase 4 exit gate

`PASS`: every new claim has method/state/view/test/network evidence, every consequential write has a
safety card, the only new purse has a complete destination matrix, scope/non-goals are explicit, and
the UI direction was produced through `ui-ux-pro-max` without overriding the accepted visual language.
