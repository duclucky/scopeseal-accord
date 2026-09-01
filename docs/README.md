# ScopeSeal Accord project specification

Status: **IMPLEMENTED / ACTIVE STUDIONET LIFECYCLE COMPLETE**

Track: **Projects**

Idea registry: **IDEA-021**
Network policy: **Studionet**, as locked by workspace decision D1

Phase 4 remains locked. The contract, direct tests, deployment tooling and frontend integration are implemented. The
two Studionet revisions safely finalized non-penalizing source/schema failures without consequence. The query and
semantic prompt root causes are locally fixed. At the user's direction, both failed testnet revisions and their test
GEN purses are marked `ABANDONED_TESTNET`, excluded from the active product, and will not be recovered. This is an
explicit exception to the workspace superseded-accounting policy and remains a blocker for an exact `NO BLOCKER`
acceptance claim. The new active revision independently completed its intended lifecycle.

Active contract: `0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879` on Studionet. Its official review finalized
`WITHIN_BASELINE`, contractor withdrawal transferred 2 GEN, and canonical accounting closed at received 2 GEN,
withdrawn 2 GEN, locked 0 GEN, credited 0 GEN.

## Identity

- Project name: ScopeSeal Accord
- Repository slug: `scopeseal-accord`
- Primary contract class: `ScopeSealAccord`
- Contract count: one validator-visible Intelligent Contract
- Category: Projects because the complete user-facing application is part of the contribution
- Intended substantial milestone: Completion Closeout using official TED contract-completion notices and a retention-release lifecycle

## One-sentence product hook

ScopeSeal Accord lets a sponsor and contractor lock a 2 GEN change-order agreement whose outcome is governed by GenLayer consensus over an official TED amendment and its linked original notice.

## Trust problem

The sponsor and contractor disagree about whether additions and omissions remain within the procurement baseline. Neither party, nor a private platform operated by either party, should decide alone before payment or recovery rights change. GenLayer is essential because validators must interpret the meaning of bounded official evidence and the finalized semantic result directly controls value and negotiation rights.

## Fingerprint

1. Trust problem: neutral funded interpretation of a post-award procurement amendment.
2. Actors/adversary: sponsor prefers refund/negotiation leverage; contractor prefers release.
3. Evidence/authenticity: official TED original and modification notice pair fetched by validators and bound by exact publication/buyer/procedure/contract/UUID identifiers.
4. Consensus question: within baseline, material amendment, or unverifiable under a co-ratified allowance.
5. State machine: keyed draft, active, review, negotiation/retry, settlement and close states.
6. Consequence: release 2 GEN contractor credit, open bilateral negotiation, or move no GEN/hard state.
7. Reuse: municipal payment platforms, infrastructure co-funders and change-order insurers consume the same writes/views.

## Scope and non-goals

### In scope

- One sponsor, one contractor and one exact 2 GEN funded agreement.
- One locked original TED publication/UUID binding and one later official modification notice per agreement.
- Semantic classification of the officially disclosed amendment against bounded same-objective/facility/location and restoration/safety allowance text.
- First-class material-amendment negotiation with 0/1/2 GEN contractor allocation and deterministic complementary sponsor allocation.
- Pull credits, expiry recovery, canonical views and real Studionet/browser evidence.

### Out of scope

- Legal advice or a ruling on compliance with EU procurement law.
- Proving physical performance, buyer truthfulness, invoice validity or contractor identity outside the co-ratified wallet binding.
- Arbitrary URLs, claimant-hosted evidence, screenshots, uploaded JSON or mirrored TED content.
- Multi-contract consumers, other networks, fiat settlement, adoption and Portal acceptance claims.
- The future Completion Closeout milestone.

## Locked contract-capability sketch

### Human roles

- Sponsor: creates and funds, monitors ratification, initiates eligible official review, proposes a split after a material verdict, recovers after expiry and withdraws sponsor credit.
- Contractor: ratifies, initiates eligible official review, receives within-baseline credit, accepts a negotiated split and withdraws contractor credit.
- Observer/downstream integrator: reads canonical status, official-source binding, verdict, timeline and reconciled accounting; cannot mutate an agreement.

### User-visible actions

- Connect/select/disconnect an EVM wallet and switch/add the official wallet-compatible Studionet chain.
- Create and fund an agreement with exactly 2 GEN.
- Ratify before the ratification deadline.
- Bind an official TED modification publication and request review before the review deadline.
- Observe submitted, accepted/decided, finalized, failed and retryable states.
- Propose or accept a 0/1/2 GEN contractor allocation during a material-amendment negotiation window.
- Recover an expired unresolved agreement when authorized.
- Withdraw canonical credit and refresh state after finalization.

### Minimum view data

- Agreement ID, sponsor/contractor addresses, user role, canonical state and legal next action.
- Original/modification TED publication numbers and Explorer/official-source links.
- Human-facing verdict/status label, deadlines and finality state.
- Locked amount, contractor credit, sponsor credit and total outstanding, all displayed in GEN.
- Current proposal amount/nonce during negotiation and append-only retry availability.

### Value, finality, retry and recovery expectations

- Creation sends exactly 2 GEN; the UI never displays base units.
- No value consequence is shown before the adjudication transaction is finalized and canonical state is re-read.
- Unavailable, mismatched, insufficient or invalid evidence is retryable and non-penalizing.
- Material amendments retain all 2 GEN until accepted negotiation or expiry recovery.
- Withdrawals are separately submitted/finalized and disabled until canonical credit exists.

## Product/frontend blueprint

### Human users and jobs

| User | Top job | Decision supported |
| --- | --- | --- |
| Sponsor | Fund a bounded amendment agreement and recover or negotiate safely | Whether to create, review, propose and recover in the current legal state |
| Contractor | Accept terms, prove the official amendment and receive/agree payment | Whether ratification/review/acceptance/withdrawal is currently legal |
| Observer/integrator | Verify the canonical outcome without reading raw storage | Whether the agreement is active, retryable, negotiated, settled or closed |

### Information architecture and named routes

| Route | User job | Primary action | Required states/data | Mobile behavior |
| --- | --- | --- | --- | --- |
| `/` | Understand the product and resume relevant work | Connect wallet or open/create agreement | Unconfigured, disconnected, loading, populated, empty, RPC error | Single-column hero and prioritized agreement list |
| `/agreements/new` | Create and fund a bounded covenant | Review and submit 2 GEN creation | Form validation, wallet/network, submitting, finalized, failed | One field group per section; sticky action never obscures focus |
| `/agreements/:id` | Understand canonical status and perform the one legal next action | Contextual ratify/review/recover/withdraw | Loading, not found, all contract states, submitted/finalized/retry | Timeline becomes vertical; technical details collapsed |
| `/agreements/:id/negotiate` | Resolve a material amendment | Sponsor proposes or contractor accepts | Not eligible, open, proposal pending, expired, settled | Allocation choices stack with clear 2 GEN conservation summary |
| `/activity` | Review transaction/agreement history | Open one agreement or Explorer record | Disconnected, empty, loading, populated, error | Cards replace wide table; IDs wrap safely |
| `/account` | Manage wallet/network and credits | Withdraw or disconnect | Disconnected, wrong network, zero/positive credit, pending/finalized | Full-width controls with account menu preserved |
| `/help` | Understand evidence, verdicts, recovery and limits | Open official TED/Explorer guidance | Always available; external-link failure does not block app | Readable text measure and anchored sections |

Persistent navigation exposes Home, New agreement, Activity, Account and Help. Agreement detail/negotiation use deep links and predictable back navigation. Desktop uses a restrained top navigation; small screens use an accessible compact menu rather than a second competing navigation hierarchy.

### Per-screen feedback rules

- Every async read has reserved loading content, error cause and retry action.
- Every write has submitted, awaiting decision/finality, finalized and failed/retry recovery language.
- Empty states explain the next available user job without inventing canonical data.
- Success always triggers a canonical contract reload before presenting the resulting agreement state.
- Raw enums, validator prompts, attempt internals and reviewer/submission data remain inside a restrained technical-details disclosure or official Explorer/TED link.

### Visibility matrix

| Information/action | Sponsor | Contractor | Observer |
| --- | --- | --- | --- |
| Canonical status, parties, deadlines, GEN accounting | Visible | Visible | Visible |
| Create/fund | Visible when connected | Hidden | Hidden |
| Ratify | Hidden unless also named contractor | Visible only in DRAFT before deadline | Hidden |
| Bind/review | Visible when legal | Visible when legal | Hidden |
| Propose split | Visible only in open negotiation | Read-only proposal | Hidden |
| Accept split | Read-only proposal | Visible only before deadline | Hidden |
| Expiry recovery | Visible only to eligible sponsor | Hidden | Hidden |
| Withdraw | Visible only with sponsor credit | Visible only with contractor credit | Hidden |
| Raw validator/system fields | Technical disclosure only | Technical disclosure only | Technical disclosure only |

### UI action inventory

| Action | Role | Legal state | Required input/value | Expected finality | Recovery path |
| --- | --- | --- | --- | --- | --- |
| Create agreement | Sponsor | New | Bounded terms, IDs, contractor, deadlines, exactly 2 GEN | Submitted then finalized | Retry only after checking tx/state |
| Ratify | Contractor | DRAFT before deadline | Agreement ID | Submitted then finalized ACTIVE | Refresh; no duplicate ratification |
| Request review | Sponsor or contractor | ACTIVE before deadline | TED modification publication number | Submitted, decided, finalized | Retry only from canonical RETRYABLE/ACTIVE state |
| Propose split | Sponsor | NEGOTIATION before deadline | 0/1/2 GEN contractor allocation | Submitted then finalized | New nonce only after canonical reload |
| Accept split | Contractor | NEGOTIATION before deadline | Current proposal nonce | Submitted then finalized SETTLED | Stale nonce rejected |
| Recover expired | Sponsor | Eligible stale/open state at/after deadline | Agreement ID | Submitted then finalized SETTLED | Idempotent canonical reread |
| Withdraw | Credited party | Positive credit | No user-entered amount | Submitted then finalized | Re-read credit/receipt before retry |

### User-facing state language

| Canonical meaning | Product label |
| --- | --- |
| DRAFT | Awaiting contractor acceptance |
| ACTIVE | Ready for an official amendment |
| REVIEW_PENDING | Validators are reviewing the TED notice pair |
| WITHIN_BASELINE | Within the agreed baseline |
| NEGOTIATION | Material amendment — agreement needed |
| RETRYABLE | Official evidence could not be verified — retry available |
| SETTLED | Payment allocation finalized |
| CLOSED | Agreement closed and accounting reconciled |

### Wallet/network behavior

- Discover EIP-6963 providers and injected OKX, Rabby, MetaMask, Coinbase, Brave and compatible fallbacks.
- Open a centered, keyboard-operable provider picker; never auto-select the first provider.
- Request accounts only from the wallet chosen by the user.
- Switch/add the current official wallet-compatible chain before writes.
- Route wallet transaction traffic through the selected EVM provider and GenLayer IC reads through the configured IC RPC/same-origin proxy.
- Connected address opens an account menu with a clear disconnect action. Disconnect clears selected provider/account UI state and disables writes.

### Visual preservation constraints

Phase 3A will invoke and persist the project-local `ui-ux-pro-max` design system. From Phase 3B onward, FE-PRESERVE prohibits rebuilding, regenerating or visually redesigning the frontend. Integration may make only the smallest control, label, state or field correction required by the finalized contract interface.

## Evidence policy preview

Only official TED validator-side acquisition can authorize a consequence. The actor provides a publication number, not the evidence body. Every original/modification binding and normalized verdict must pass deterministic provenance, exact-ID, enum and coverage invariants. A valid digest of claimant-controlled bytes is insufficient; failure is non-penalizing and moves no GEN or hard state.

## Phase 4 locked technical specification

### Authority chain and verified evidence route

- Network, submission channel and nondeterministic API follow root decisions D1-D3 without reinterpretation.
- Contract authoring follows the current `docs/08-CONTRACT-AUTHORING-RULES.md` Depends/API unit: the first meaningful line is the verified `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6` Depends comment, followed by `from genlayer import *`. No Studio pragma is added unless the deployment-phase current template and smoke test prove it is required.
- The only consequential web authority is the Publications Office of the European Union TED Open Data SPARQL service. The contract constructs the query and URL; callers can provide only canonical publication numbers.
- Official TED documentation identifies the TED Open Data endpoint and published-notice reuse formats. A live Phase 4 probe of `https://publications.europa.eu/webapi/rdf/sparql` returned HTTP 200 JSON for both locked notices and exposed publication, notice/version, previous-notice, buyer, procedure, contract, baseline description and modification-description fields.
- Canonical demonstration pair: original `00190662-2025`, modification `00587863-2026`, original notice UUID `6480e4d5-6f07-4b83-8097-5756d8fbf527`, version `01`, buyer legal identifier `3267368TH`, procedure identifier `7f56490a-c5ba-4922-853b-07b18b0d14c1`, and contract identifier `417379`.
- The direct TED XML route was not selected as the contract authority because the live non-browser probe was challenged by AWS WAF. This is an availability finding, not an authenticity failure. The official SPARQL GET route was selected because it returned structured JSON without authentication or a browser challenge.

### Exact v1 contract boundary

One module declares exactly one validator-visible class: `ScopeSealAccord(gl.Contract)`. It owns all agreement state, official-source review, negotiation, pull credits and accounting. There is no consumer contract in v1 because a second contract would only mirror status.

Public writes:

| Method | Parameters | Purpose |
| --- | --- | --- |
| `create_agreement` | agreement ID, contractor, original publication, original notice UUID/version, buyer/procedure/contract identifiers, canonical objective, scope allowance, ratification deadline, review deadline, negotiation-window seconds; exactly 2 GEN attached | Create and fund one immutable draft |
| `ratify_agreement` | agreement ID | Contractor co-ratifies all locked terms |
| `request_review` | agreement ID, modification publication | Authorized party triggers validator-side official TED acquisition and semantic consensus |
| `propose_split` | agreement ID, contractor allocation in whole GEN | Sponsor proposes 0, 1 or 2 GEN during material-amendment negotiation |
| `accept_split` | agreement ID, current proposal nonce | Contractor accepts the exact live proposal |
| `recover_expired` | agreement ID | Sponsor recovers the full 2 GEN after the applicable unresolved deadline |
| `withdraw_credit` | agreement ID | A credited sponsor or contractor withdraws that agreement's canonical credit |

Canonical views:

| View | Result |
| --- | --- |
| `get_agreement` | Full bounded agreement projection, role addresses, identifiers, state, verdict, deadlines, proposal, credits and legal next-action facts |
| `get_review_attempt` | One append-only normalized attempt by agreement ID and attempt number; no raw source body or prompt |
| `get_account_agreement_ids` | Stable CSV index of agreement IDs for one address |
| `get_credit_gen` | Whole-GEN credit for one agreement/address pair |
| `get_accounting` | Whole-GEN received, locked, credited and withdrawn totals plus the conservation check fields |

Public calldata contains only supported GenVM types: `str`, `Address` and bounded integer types. Every `TreeMap` key is `str`. Collection storage is declared, never reassigned in `__init__`. All contract text and comments are ASCII.

### Input bounds and canonical normalization

- Agreement IDs: 3-80 ASCII letters, digits, hyphen, underscore or period; globally unique.
- TED publication numbers: exactly eight digits, hyphen and four-digit year. The contract never accepts a URL, query, graph URI or evidence body.
- UUIDs: lowercase canonical UUID text; versions: exactly two decimal digits other than `00`.
- Buyer, procedure and contract identifiers: 1-96 printable ASCII characters with no control characters or query delimiters.
- Canonical objective: 20-800 printable ASCII characters. Scope allowance: 20-1,200 printable ASCII characters. These are immutable after contractor ratification and remain separate from fetched evidence.
- Contractor must be nonzero and different from sponsor.
- Ratification deadline must be later than creation time; review deadline must be later than ratification deadline. Equality at either deadline is late.
- Negotiation window is bounded from 1 hour through 30 days and begins only when a material verdict finalizes.
- Attached value must be exactly 2 GEN. `propose_split` accepts only the human-facing whole-GEN enum 0, 1 or 2; no fractional amount or user-supplied destination is accepted.

### Storage model

`Agreement` stores only bounded scalar fields: identifiers, sponsor/contractor, immutable objective and allowance, deadlines, current state/verdict, locked modification publication, append-only attempt counter, evidence fingerprint, negotiation start/deadline, current proposal and nonce, locked amount and party credits. `ReviewAttempt` stores source status/coverage, exact bound IDs, semantic verdict, derived consequence class and a digest of the exact normalized official response used for review. `AccountingSummary` exposes whole-GEN totals. Address indexes are stored as bounded CSV strings keyed by canonical lowercase address text.

No raw TED body, prompt, rationale longer than the bounded summary, private reviewer data, transaction receipt or validator configuration is stored. No global `last_*` field exists; every attempt and proposal is keyed by agreement ID.

### State machine

```text
ABSENT --create 2 GEN--> DRAFT
DRAFT --contractor ratifies before deadline--> ACTIVE
DRAFT --sponsor recovers at/after ratification deadline--> SETTLED
ACTIVE/RETRYABLE --complete WITHIN_BASELINE review--> SETTLED
ACTIVE/RETRYABLE --complete MATERIAL_AMENDMENT review--> NEGOTIATION
ACTIVE/RETRYABLE --invalid/unavailable/incomplete review--> RETRYABLE
ACTIVE/RETRYABLE --sponsor recovers at/after review deadline--> SETTLED
NEGOTIATION --contractor accepts current proposal before deadline--> SETTLED
NEGOTIATION --sponsor recovers at/after negotiation deadline--> SETTLED
SETTLED --last party credit withdrawn--> CLOSED
```

`REVIEW_PENDING` is a frontend transaction/finality state, not stored canonical state. A finalized `WITHIN_BASELINE` verdict is stored alongside canonical `SETTLED`; a finalized material verdict is stored alongside `NEGOTIATION`. No clock automatically advances a stored state.

Forbidden transitions include draft review, unratified negotiation, retry with a different modification publication, proposal outside `NEGOTIATION`, acceptance of a stale nonce, recovery before the applicable deadline, review after the review deadline, and any mutation from `CLOSED`.

### Core invariants

1. One agreement always belongs to exactly one sponsor and one contractor; all keyed records are isolated.
2. The original authority binding, canonical objective, allowance, parties, deadlines and funded 2 GEN cannot change after creation; contractor ratification is acceptance of that exact record.
3. Exactly one modification publication is locked on the first review attempt. Retries may only use that same publication.
4. A consequence requires official source status `COMPLETE`, exact source coverage, one and only one `AMENDMENT_SCOPE` entity, all locked identifiers matched and a valid consensus verdict.
5. `UNVERIFIABLE`/`RETRYABLE` may append an attempt and lock the first modification publication, but cannot change locked GEN, credits, proposal rights, settlement allocation or party addresses.
6. Every settled allocation conserves exactly 2 GEN: contractor allocation plus sponsor allocation equals 2 GEN. The contract derives the complement; validator prose and callers never supply both destinations.
7. `received GEN = locked GEN + credited GEN + withdrawn GEN` across the contract after every successful write.
8. Settlement moves the full 2 GEN exactly once from locked liability to party credits. Recovery and acceptance reject after settlement.
9. Withdrawal debits the exact per-agreement credit and global credited total before external transfer. A second withdrawal has zero credit and rejects.
10. `CLOSED` means locked amount and both party credits for that agreement are zero; global conservation still holds.

### Evidence Authority Matrix

| Consequential evidence | Who creates it | Who submits the locator | Who serves it to validators | Authentication/provenance mechanism | Locked bindings checked before semantics | Semantic role | Failure behavior | Blocked consequences |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Original TED notice record | Contracting authority/eSender; published by EU Publications Office | Sponsor supplies only canonical publication number at creation; contractor ratifies it | EU Publications Office TED Open Data SPARQL service | Validator-side acquisition from the authoritative official publication graph; contract-constructed host/query; HTTP success, JSON parse and exactly-one-row checks | Network/contract implicit in execution; agreement ID; original publication; notice UUID/version; buyer legal ID; procedure ID; contract ID; canonical objective and allowance from locked state | Supplies the official baseline description and immutable procurement identifiers | `UNVERIFIABLE`/`RETRYABLE`; no semantic consequence | Contractor credit, sponsor credit, negotiation right, settlement and transfer |
| TED contract-modification notice | Contracting authority/eSender; published by EU Publications Office | Sponsor or contractor supplies only canonical publication number | EU Publications Office TED Open Data SPARQL service | Same validator-side official acquisition; no caller URL/body/hash accepted | Agreement ID; modification publication; form/type is contract modification; `refersToPrevious` equals locked UUID-version; buyer/procedure/contract identifiers match original; first publication lock prevents replay/switch | Supplies additions, omissions, modification reason and official modification description | `UNVERIFIABLE`/`RETRYABLE`; append bounded attempt only | All value/credit movement, hard settlement, negotiation opening and withdrawal eligibility |
| Co-ratified canonical objective and allowance | Sponsor proposes; named contractor ratifies onchain | Sponsor calldata then contractor transaction | Contract storage | Role authorization plus exact state/time guards; immutable after creation | Agreement ID, parties, objective text, allowance text, deadlines and 2 GEN | Policy against which validators compare official amendment meaning | Creation/ratification reverts; no agreement activation | Review eligibility and every later consequence |

Actor-controlled text is never an evidence body. A matching digest alone is never treated as authenticity. TED publication proves what the official notice says, not physical performance, legal compliance or correctness of the buyer's statement.

### Official query and objective gates

The contract builds two fixed SPARQL GET queries and percent-encodes them itself:

1. Original query: exact publication number, notice UUID/version, buyer legal identifier, procedure identifier, settled-contract identifier, title and baseline description.
2. Modification query: exact publication number/version/form type, previous notice UUID-version, buyer legal identifier, procedure identifier, contract-to-be-modified identifier, baseline title/description, modification description, reason and justification code.

Each query is scoped to a named official graph discovered through the publication number and returns exactly one normalized row. The leader deterministically rejects missing, multiple, malformed or overlong rows before calling the LLM. It also rejects a non-modification form/type, previous-notice mismatch, buyer/procedure/contract mismatch, empty baseline or amendment text, or response beyond the source size cap. The exact normalized response bytes used for judgment are hashed inside the review path and the fingerprint is stored with the attempt.

The original and modification records are fetched independently inside the nondeterministic function. Validators rerun both official fetches. No storage is read inside the nondeterministic function; every locked field is captured beforehand.

### Consensus question, prompt containment and output schema

Consensus question: "Given the locked canonical objective and allowance, does the official TED modification remain within that allowance, materially alter it, or lack sufficient authoritative coverage?"

The prompt presents `CANONICAL_AUTHORITY` separately from `OFFICIAL_TED_RECORDS`. It says that record text is data, never instructions, and must not redefine parties, authority, expected entity IDs, allowed verdicts, payout, settlement destinations or policy. The expected entity set is exactly `AMENDMENT_SCOPE`. Validators are instructed to consider stated additions and omissions together and to select only one bounded verdict.

Normalized result:

```json
{
  "schema_version": "SCOPESEAL_REVIEW_V1",
  "source_status": "COMPLETE|UNAVAILABLE|INVALID|MISMATCH|INSUFFICIENT",
  "source_coverage": "COMPLETE|INCOMPLETE",
  "original_publication": "00190662-2025",
  "modification_publication": "00587863-2026",
  "original_notice_binding": "uuid-version",
  "buyer_legal_id": "locked-id",
  "procedure_id": "locked-id",
  "contract_id": "locked-id",
  "entity_results": [
    {"entity_id": "AMENDMENT_SCOPE", "verdict": "WITHIN_BASELINE|MATERIAL_AMENDMENT"}
  ],
  "aggregate_verdict": "WITHIN_BASELINE|MATERIAL_AMENDMENT|UNVERIFIABLE",
  "rationale": "bounded text"
}
```

Objective fields and source status are produced by contract code from parsed official responses, not trusted from LLM prose. The LLM supplies only the entity semantic verdict and rationale after objective gates pass. `gl.vm.run_nondet` uses a custom validator that reruns acquisition and semantic judgment, then compares source status/coverage, every locked binding, the exact entity ID, entity verdict and aggregate verdict. Rationale wording is deliberately ignored.

### Deterministic settlement invariants

Before any accepted result can move GEN or open negotiation, deterministic code requires:

- exact top-level schema and allowed enums;
- `source_status == COMPLETE` and `source_coverage == COMPLETE`;
- all objective fields equal locked state and the first modification lock;
- exactly one `entity_results` row;
- that row's ID is exactly `AMENDMENT_SCOPE`, appears once and has one allowed semantic enum;
- no missing, extra or duplicate entity IDs;
- aggregate verdict equals the entity verdict;
- consequence is derived by contract code: within -> contractor 2 GEN credit; material -> negotiation; all source/shape/binding failures -> non-penalizing retryable;
- every 2 GEN allocation has a deterministic complementary sponsor destination and no residual.

Root/downstream class rules are `N/A` in v1 because there is one expected entity and no dependency graph. Any root, blocked, inherited, downstream or caller-supplied consequence field is an unexpected extra and rejects before mutation. Malicious valid-shape output with mismatched aggregate/entity verdict, extra entity, missing entity, invalid enum or changed binding becomes retryable and leaves GEN accounting unchanged.

### Value-destination matrix

| Value | Payer/source | Locked state | Release/refund/forfeit destination | Terminal states | Duplicate/late/retry behavior | Canonical proof view |
| --- | --- | --- | --- | --- | --- | --- |
| Agreement purse: 2 GEN | Sponsor in `create_agreement` | Agreement `DRAFT`, then `ACTIVE`/`RETRYABLE`/`NEGOTIATION` | 2 GEN contractor credit for within-baseline; negotiated 0/1/2 GEN contractor credit plus deterministic sponsor complement; full 2 GEN sponsor credit on eligible expiry recovery | `SETTLED`, then `CLOSED` after withdrawals | Duplicate ID/value rejects; unavailable review moves no GEN; late review/proposal/accept rejects; settlement/recovery can happen once | `get_agreement`, `get_credit_gen`, `get_accounting` |
| Sponsor credit | Derived only from accepted proposal complement or expiry recovery | `SETTLED` credit | Sponsor EVM address through pull withdrawal | Credit zero; agreement closes when both credits zero | Zero/duplicate withdrawal rejects; receipt/state read required before retry | Same views plus transaction receipt/Explorer evidence |
| Contractor credit | Derived only from within verdict or accepted proposal | `SETTLED` credit | Contractor EVM address through pull withdrawal | Credit zero; agreement closes when both credits zero | Same | Same |

There is no fee, bond, reward, slash, operator purse or residual in v1. No committed amount can be orphaned: every unresolved state has a sponsor recovery deadline, and every settlement exposes pull withdrawal.

### Write-method safety cards

| Method | Caller | Allowed states | Forbidden states | Temporal/expiry gate | Idempotency | Value/accounting effect | Views affected | Negative tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `create_agreement` | Any connected EVM address becomes sponsor | Agreement absent | Existing ID | At transaction time `now < ratify_deadline < review_deadline`; equality with either upcoming deadline is invalid | Duplicate ID rejects before value/accounting mutation | Receives exactly 2 GEN; increases received and locked totals by 2 GEN | Agreement, account index, accounting | wrong value; zero/same contractor; malformed IDs/text; duplicate; deadline equality/past/order; unchanged accounting on rejection; payable metadata |
| `ratify_agreement` | Exact contractor | `DRAFT` | `ACTIVE`, `RETRYABLE`, `NEGOTIATION`, `SETTLED`, `CLOSED` | `now < ratify_deadline`; equality is late; phase may remain stale `DRAFT` | Second call rejects | No GEN movement; locks acceptance and changes state to `ACTIVE` | Agreement, account index | wrong caller; boundary -1/equality/+1 with stale draft; duplicate; unchanged accounting/state on rejection |
| `request_review` | Sponsor or contractor | `ACTIVE`, `RETRYABLE` | `DRAFT`, `NEGOTIATION`, `SETTLED`, `CLOSED` | Ratification already final; `now < review_deadline`; equality is late; stale `ACTIVE` cannot permit late review | Each completed call has a new attempt number; retry must use the same locked modification publication; duplicate settled review rejects | On within: locked -2 GEN, contractor credit +2 GEN. On material: no GEN move, opens negotiation. On unverifiable: no GEN/rights consequence beyond bounded attempt/retry state | Agreement, attempt, credits, accounting | unauthorized; wrong state; boundary -1/equality/+1; changed publication on retry; source unavailable/malformed/mismatch; malicious output; accounting unchanged for retry/reject |
| `propose_split` | Exact sponsor | `NEGOTIATION` | Every other state | `negotiation_started_at <= now < negotiation_deadline`; start equality allowed, deadline equality late | Each valid proposal increments nonce; identical proposal is still a new explicit nonce; stale state rejects | No GEN movement; records allowed contractor allocation 0/1/2 GEN | Agreement | wrong caller/state; invalid/fractional/out-of-range amount; lower boundary; deadline -1/equality/+1 with stale negotiation; accounting unchanged |
| `accept_split` | Exact contractor | `NEGOTIATION` with a current proposal | Every other state; no proposal | `negotiation_started_at <= now < negotiation_deadline`; start equality allowed, deadline equality late | Exact current nonce accepted once; stale/duplicate nonce rejects | Moves full 2 GEN from locked to contractor allocation plus sponsor complement; state `SETTLED` | Agreement, both credits, accounting | wrong caller/state; absent/stale nonce; boundary -1/equality/+1; double accept; conservation and unchanged rejection state |
| `recover_expired` | Exact sponsor | `DRAFT`, `ACTIVE`, `RETRYABLE`, `NEGOTIATION` when its deadline expired | `SETTLED`, `CLOSED`; any unexpired eligible state | Draft: `now >= ratify_deadline`; active/retryable: `now >= review_deadline`; negotiation: `now >= negotiation_deadline`; equality is expired | First call settles; duplicate rejects | Moves full 2 GEN locked amount to sponsor credit once | Agreement, sponsor credit, accounting | wrong caller; each deadline -1/equality/+1 with deliberately stale state; settled/closed; existing negotiation before expiry; double recovery; no double credit |
| `withdraw_credit` | Sponsor or contractor with credit on that agreement | `SETTLED` and caller credit > 0 | Other states; zero credit; `CLOSED` | `N/A`: a finalized credit does not expire and withdrawal legality is intentionally time-independent | Debits credit before transfer; duplicate/zero call rejects | Decreases credited total, increases withdrawn total, transfers exact caller credit; closes only after both credits are zero | Agreement, caller credit, accounting | wrong party; wrong state; zero/duplicate; one party withdraws while other remains; transfer failure rollback; debit-before-call; conservation/no double withdrawal |

### Temporal boundary matrix

Canonical transaction time is `datetime.now(timezone.utc)` in the pinned runner and is controlled in direct tests with the runtime transaction clock. All intervals are half-open unless recovery explicitly uses the complementary closed lower bound.

| Entrypoint | Legal interval | Exact-boundary meaning | Stale-state proof |
| --- | --- | --- | --- |
| `create_agreement` | `now < ratify_deadline < review_deadline` | `now == ratify_deadline` rejects | No agreement/accounting mutation |
| `ratify_agreement` | `now < ratify_deadline` | Equality is late | Leave `DRAFT` stale at equality/+1; call rejects |
| `request_review` | `now < review_deadline` after ratification | Equality is late | Leave `ACTIVE`/`RETRYABLE` stale; no attempt/accounting mutation |
| `propose_split` | `negotiation_start <= now < negotiation_deadline` | Start equality valid; deadline equality late | Leave `NEGOTIATION` stale; proposal/nonce unchanged at late points |
| `accept_split` | Same | Same | Leave proposal and `NEGOTIATION` stale; no credit at late points |
| `recover_expired` | `now >=` the state-specific deadline | Equality is expired and valid | Leave draft/active/retryable/negotiation stale and prove the matching branch only |
| `withdraw_credit` | No time bound | N/A | Not phase-clock dependent |

Every time-bounded entrypoint receives boundary minus one, exact boundary and boundary plus one direct tests. Rejected calls assert state, attempts, proposal nonce, credits, locked GEN and global accounting unchanged.

### Claim-to-code matrix

| Public claim | Write/view/state transition | Guard/invariant | Direct/frontend proof | Network proof required |
| --- | --- | --- | --- | --- |
| Parties co-ratify exact immutable terms | `create_agreement`, `ratify_agreement`, `get_agreement`; `DRAFT -> ACTIVE` | caller, exact terms hash projection, deadline and no update method | creation/ratification/isolation tests; create/detail UI tests | finalized create + ratify tx and canonical reread |
| Validators use official TED records, not claimant uploads | `request_review`, `get_review_attempt` | contract-built host/query, publication format, official structured row and exact IDs | source acquisition/authenticity tripwire tests; no URL/body frontend input | finalized review plus official query links and sanitized attempt |
| Meaning, not rationale shape, reaches consensus | `request_review` | custom validator compares critical IDs/coverage/entity/aggregate verdict and ignores rationale | semantic replay, differing rationale and malicious output tests | accepted/finalized adjudication receipt and stored verdict |
| Unverifiable evidence moves no GEN | `request_review`; `ACTIVE/RETRYABLE -> RETRYABLE` | invalid source/output maps to retry before settlement | unavailable/malformed/mismatch/prompt-injection tests plus accounting snapshot | retryable network attempt if safely reproducible; otherwise no claim beyond local proof |
| Within-baseline releases 2 GEN contractor credit | review and credit/accounting views; `ACTIVE -> SETTLED` | exact source coverage + entity invariants + code-derived allocation | verdict/consequence/accounting/frontend finality tests | finalized review, credit and withdrawal evidence |
| Material change requires bilateral split | review, propose, accept views; `ACTIVE -> NEGOTIATION -> SETTLED` | material enum, role/nonce/time checks and 2 GEN conservation | all 0/1/2 allocations, wrong roles, stale nonce and boundary tests | finalized material lifecycle or claim narrowed if not achieved |
| Sponsor can recover unresolved 2 GEN after expiry | `recover_expired`, agreement/accounting views | caller + state-specific `now >= deadline` + once-only settlement | each branch boundary/stale-state/recovery tests | finalized recovery evidence for the demonstrated branch |
| Withdrawals cannot double-pay | `withdraw_credit`, credit/accounting views; `SETTLED -> CLOSED` | debit before external call, credit > 0, conservation | duplicate, partial lifecycle and transfer rollback tests | withdrawal receipt, canonical zero credit and reconciled accounting |

### Test matrix locked before implementation

- Static: Depends first meaningful line, star import, ASCII-only bytes, exactly one `ScopeSealAccord(gl.Contract)`, one contract file, supported storage/public types, `str` TreeMap keys and payable metadata.
- Creation/ratification: exact 2 GEN, wrong values, duplicate IDs, actor isolation, locked configuration, wrong caller and every temporal boundary.
- Official source: two independent SPARQL responses, HTTP/source failures, malformed JSON, empty/multiple rows, wrong form, wrong original/version/buyer/procedure/contract, missing descriptions and oversized response.
- Authenticity tripwires: caller-hosted URL/body impossible at ABI; valid digest of nonofficial bytes cannot enter review; wrong canonical objective/entity/party/source binding and evidence text attempting to redefine authority/payout cannot reach a consequence.
- Consensus: rationale variation accepted when meaning matches; semantic replay catches disagreeing verdict; fenced/malformed output; missing/extra/duplicate entity; invalid enum; aggregate/entity mismatch; consequence field injection; prompt injection.
- Consequences: both verdict classes, retryable, every 0/1/2 GEN negotiated allocation, exact sponsor complement and zero residual.
- Recovery/value: wrong caller/state, duplicate settle/recover/withdraw, transfer rollback, no double credit/withdraw, both withdrawal orders and global conservation.
- Temporal: boundary -1/equality/+1 for every listed write with intentionally stale states and unchanged rejected accounting.
- Frontend: every claimed action has wrapper, control, role/state visibility, submitted/accepted/finalized/failed/retry handling and canonical reload; browser wallet selection/logout/network split and CORS checks.
- Deployment: raw and normalized receipt parser shapes, allowlisted safe fields, resumable state, dynamic attempt discovery and ambiguous-transaction reread.

### Frontend action-to-contract matrix

| Browser action | Wrapper | UI control | Finality handling | Canonical reload |
| --- | --- | --- | --- | --- |
| Create/fund 2 GEN | `createAgreement` | New agreement primary action | submitted -> accepted/decided -> finalized or failed/retry | agreement, index, accounting |
| Ratify | `ratifyAgreement` | Contractor-only detail action | same | agreement |
| Review official modification | `requestReview` | Sponsor/contractor detail action | includes nondeterministic accepted/finalized distinction | agreement, latest attempt, accounting |
| Propose split | `proposeSplit` | Sponsor-only negotiation form | same | agreement/proposal nonce |
| Accept split | `acceptSplit` | Contractor-only current-proposal action | same | agreement, both credits, accounting |
| Recover expired | `recoverExpired` | Sponsor-only contextual action | same | agreement, sponsor credit, accounting |
| Withdraw | `withdrawCredit` | Credited party detail/account action | same; receipt checked before retry | agreement, credit, accounting |

The adapter keeps wallet transaction traffic on the selected EVM provider and canonical IC reads on the configured GenLayer RPC or same-origin proxy. FE-PRESERVE permits wiring these controls into the accepted shell but prohibits redesign.

### Deployment and consequential lifecycle plan

1. Verify Python 3.12 environment, current official service/tool status, contract lint, direct tests, parser tests and frontend checks.
2. Inspect project `.env`, then authorized root `.env`, checking only presence of required values.
3. Bind network, source commit, Depends/API unit and address in one active sanitized deployment record; archive superseded attempts.
4. Deploy with the authorized sponsor account; verify schema and canonical empty accounting before sending value.
5. Run a sequential 2 GEN lifecycle using the locked TED pair. Create, contractor-ratify, request official review, wait for accepted then finalized, read canonical state, execute the legal settlement/withdrawal or recovery branch, and prove final credits/accounting.
6. Never retry an ambiguous write before checking transaction status and destination/canonical state. Never save raw receipts, node configuration, validator payloads or secrets.
7. Browser-local proof must separately verify wallet selection, current chain handling, IC reads, writes/finality/reload and absence of CORS/`Failed to fetch` errors.

### Reuse boundary and milestone headroom

Downstream municipal payment platforms, infrastructure co-funders and change-order insurers can consume the same write/view lifecycle without trusting a ScopeSeal operator. V1 remains deliberately single-purse and single-amendment per agreement. The planned Completion Closeout milestone is substantial rather than cosmetic: it would add official TED completion-notice authority, retention allocation, completion-specific semantic entities, cure/retry states and new accounting paths while preserving the accepted amendment primitive.

## Honest limitations

The active contract, frontend, and 2 GEN Studionet lifecycle are verified. The active lifecycle finalized CREATE,
RATIFY, official REVIEW, and contractor WITHDRAW; canonical state is `CLOSED`, verdict `WITHIN_BASELINE`, with received
2 GEN, withdrawn 2 GEN, locked 0 GEN, and credited 0 GEN. Two earlier failed testnet revisions are excluded as
`ABANDONED_TESTNET` with their test purses intentionally unrecovered at the user's direction; this is not claimed as
superseded-accounting compliance. Browser wallet write, public GitHub repository, live frontend, external adoption,
and Portal acceptance remain pending at this point in the evidence sequence.

## Kill criteria

Return to ideation/specification if official TED acquisition cannot be bounded in GenVM, if claimant-controlled evidence becomes consequential, if the client/backend computes the verdict, if semantic output invariants cannot prevent value movement on invalid coverage, or if the frontend cannot prove real browser-local read/write/finality behavior.
