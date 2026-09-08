# ScopeSeal Accord

ScopeSeal Accord turns an official public-procurement amendment into a validator-governed, funded change-order decision instead of trusting either contracting party's narrative.

Status: **MS-001 SUBMISSION_READY / PORTAL SUBMISSION NOT YET AUTHORIZED**. The accepted amendment product now includes a
post-performance Completion Retention Closeout. Its primary Studionet proof finalized a 1 GEN E5 release and withdrawal;
a separate Chrome/OKX write proved accepted/finalized handling, canonical reload, and a no-consequence mismatch tripwire.
Public hosting is live; the final Portal control remains a separate, explicitly authorized action.

- Live app: https://scopeseal-accord.vercel.app
- Active milestone contract: https://explorer-studio.genlayer.com/address/0x6AD210a93E448BdF7A6aE8C05098fc1e25983FD0
- Accepted baseline contract: https://explorer-studio.genlayer.com/address/0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879
- Successful MS-001 CI: https://github.com/duclucky/scopeseal-accord/actions/runs/34247307347
- CI workflow: https://github.com/duclucky/scopeseal-accord/actions/workflows/ci.yml
- Lifecycle evidence: [active Studionet lifecycle](docs/evidence/studionet/phase-8-active-lifecycle.md)
- Browser-wallet evidence: [Chrome/OKX lifecycle](docs/evidence/frontend/phase-15-browser-wallet-lifecycle.md)
- MS-001 network/browser evidence: [Completion closeout verification](docs/evidence/studionet/milestones/MS-001/verification.md)
- Milestone dossier: [MS-001 Completion Retention Closeout](docs/milestones/MS-001/README.md)
- Copy-ready listing: [Projects listing packet](docs/submission/project-listing.md)
- Portal logo: [512 x 512 PNG](frontend/public/scopeseal-logo-512.png)
- Full specification: [project specification](docs/README.md)

## Problem

Procurement change orders can depend on whether a published modification is genuinely linked to the original award
and whether its scope stays within a jointly ratified baseline. A party-hosted explanation cannot safely decide a
funded consequence. ScopeSeal locks the agreement and evidence authority onchain, fetches the official TED notice,
uses GenLayer validators for the semantic comparison, then applies deterministic settlement invariants before any GEN
credit is created.

## MS-001: Completion Retention Closeout

After a canonical agreement is `CLOSED`, its sponsor can lock a separate 1 GEN retention for one official TED lot and
a bounded completion-release standard. The original contractor ratifies it. Validators then acquire the exact official
E5 completion notice and deterministic code verifies its publication lineage, buyer, procedure, contract, and lot before
semantic judgment may release the retention or open bilateral negotiation. Invalid, unavailable, or mismatched authority
stays `RETRYABLE` and cannot create credit or move GEN.

## Architecture

- `contracts/scopeseal_accord.py`: one ASCII `ScopeSealAccord(gl.Contract)` class with keyed agreements and closeouts,
  co-ratification, official-evidence review, independent pull credits, and canonical views.
- `scripts/studionet.mjs`: resumable deployment and lifecycle runner using authorized server-side signers; secrets are
  read only from ignored environment files.
- `frontend/`: React/Vite Projects frontend. It discovers EVM wallets through EIP-6963 and injected fallbacks, keeps
  wallet writes separate from GenLayer IC reads, and reloads canonical state after finality.
- `frontend/api/genlayer-rpc.js`: same-origin, read-only production proxy allowing only `eth_chainId` and `gen_call`.
- `tests/`: direct contract, deployment parser/helper, and frontend lifecycle tests.

The consequential path is:

```text
Sponsor funds 2 GEN -> both parties ratify -> validators inspect official TED evidence
-> deterministic output/accounting checks -> finalized pull credit -> contractor withdraws -> CLOSED
-> sponsor funds 1 GEN closeout -> contractor ratifies -> validators inspect official E5 completion
-> release or bilateral negotiation -> withdrawal -> CLOSED
```

## Run locally

Prerequisites are Node.js, npm, and Python 3.12. On Windows PowerShell:

```powershell
npm ci
npm --prefix frontend ci
py -3.12 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
npm run check
Copy-Item frontend\.env.example frontend\.env.local
npm --prefix frontend run dev
```

Set only public frontend values in `frontend/.env.local`; never place a private key in a `VITE_*` variable. The app
must use the same-origin `/genlayer-rpc` read path in browser deployments.

## Deploy to Studionet

Use an authorized, funded Studionet account in the ignored project `.env`, or the ignored parent workspace `.env`.
Do not print or commit its value.

```powershell
npm run check
npm run studionet:inspect
npm run studionet:deploy
npm run studionet:lifecycle
npm run studionet:milestone
```

`inspect` verifies safe configuration presence; `deploy` creates or recovers the active deployment record; and
`lifecycle` and `milestone` resume from canonical state instead of replaying completed writes. Human-facing
demo amounts are whole GEN: the agreement uses 2 GEN and the closeout uses 1 GEN.

## Verification

`npm run check` is the single local gate. It runs GenVM lint, all Python/direct tests, deployment helper tests,
frontend tests, TypeScript checking, and the production frontend build. Network and browser evidence are preserved in
`docs/evidence/`; local test success is not presented as Studionet evidence.

The current gate passes one contract with 22 public methods (8 views, 14 writes), 58 Python tests, 14 deployment tests,
and 46 frontend tests, followed by TypeScript and a production Vite build.

## Honest limitations

- The complete Chrome/OKX lifecycle is proven for `scopeseal-browser-002`; it does not prove support for every EVM
  wallet extension or browser combination.
- The browser milestone proof intentionally stopped at `RETRYABLE` after a structurally mismatched E5 record. Its 1 GEN
  remains locked with zero credits and a deterministic sponsor recovery path after the recorded review deadline; no
  successful browser E5 verdict is claimed.
- A separate abandoned browser test agreement, `scopeseal-browser-001`, still has 2 GEN locked on the accepted baseline
  contract.
- Only Studionet is evidenced; other networks, production adoption, and Portal acceptance are not claimed.
- Superseded diagnostic testnet revisions remain explicitly archived or marked `ABANDONED_TESTNET` at the user's
  direction. They are excluded from the active product and are not represented as recovered or zero-accounting.
