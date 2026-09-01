# ScopeSeal Accord project specification

Status: **SELECTED**

Track: **Projects**

Idea registry: **IDEA-021**
Network policy: **Studionet**, as locked by workspace decision D1

This brief is initialized during Phase 3A. Phase 4 will lock the complete contract API, storage schema, safety cards, consensus prompt/output schema, accounting invariants and claim-to-code evidence rows before contract implementation.

## Identity

- Project name: ScopeSeal Accord
- Repository slug: `scopeseal-accord`
- Primary contract class: planned `ScopeSealAccord`
- Contract count: one planned validator-visible Intelligent Contract
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

## Provisional contract-capability sketch

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

## Honest limitations

No contract, test, Studionet address, GitHub repository, live frontend, browser write, finalized lifecycle or external adoption is claimed at SELECTED status. Contract API and test counts remain pending Phase 4–6 verification.

## Kill criteria

Return to ideation/specification if official TED acquisition cannot be bounded in GenVM, if claimant-controlled evidence becomes consequential, if the client/backend computes the verdict, if semantic output invariants cannot prevent value movement on invalid coverage, or if the frontend cannot prove real browser-local read/write/finality behavior.
