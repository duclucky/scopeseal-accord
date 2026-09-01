# ScopeSeal Accord

ScopeSeal Accord turns an official public-procurement amendment into a validator-governed, funded change-order decision instead of trusting either contracting party's narrative.

Status: **IMPLEMENTED / STUDIONET SCRIPT + CHROME/OKX LIFECYCLES COMPLETE**. The active contract has finalized both
the within-baseline release path and the material-amendment negotiation path. The browser-wallet proof withdrew exactly
2 GEN and closed its agreement with zero locked/credited accounting. Public hosting is live; Portal submission remains
a separate, user-authorized action.

- Live app: https://scopeseal-accord.vercel.app
- Active contract: https://explorer-studio.genlayer.com/address/0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879
- CI: https://github.com/duclucky/scopeseal-accord/actions/workflows/ci.yml
- Lifecycle evidence: [active Studionet lifecycle](docs/evidence/studionet/phase-8-active-lifecycle.md)
- Browser-wallet evidence: [Chrome/OKX lifecycle](docs/evidence/frontend/phase-15-browser-wallet-lifecycle.md)
- Copy-ready listing: [Projects listing packet](docs/submission/project-listing.md)
- Portal logo: [512 x 512 PNG](frontend/public/scopeseal-logo-512.png)
- Full specification: [project specification](docs/README.md)

## Problem

Procurement change orders can depend on whether a published modification is genuinely linked to the original award
and whether its scope stays within a jointly ratified baseline. A party-hosted explanation cannot safely decide a
funded consequence. ScopeSeal locks the agreement and evidence authority onchain, fetches the official TED notice,
uses GenLayer validators for the semantic comparison, then applies deterministic settlement invariants before any GEN
credit is created.

## Architecture

- `contracts/scopeseal_accord.py`: one ASCII `ScopeSealAccord(gl.Contract)` class with keyed agreements, explicit
  states, co-ratification, official-evidence review, pull credits, and canonical views.
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
```

`inspect` verifies safe configuration presence; `deploy` creates or recovers the active deployment record; and
`lifecycle` resumes from canonical state instead of replaying completed writes. Human-facing demo amounts are whole
GEN: the proven lifecycle funds exactly 2 GEN.

## Verification

`npm run check` is the single local gate. It runs GenVM lint, all Python/direct tests, deployment helper tests,
frontend tests, TypeScript checking, and the production frontend build. Network and browser evidence are preserved in
`docs/evidence/`; local test success is not presented as Studionet evidence.

## Honest limitations

- The complete Chrome/OKX lifecycle is proven for `scopeseal-browser-002`; it does not prove support for every EVM
  wallet extension or browser combination.
- A separate abandoned browser test agreement, `scopeseal-browser-001`, still has 2 GEN locked on the active contract.
- Only Studionet is evidenced; other networks, production adoption, and Portal acceptance are not claimed.
- Two superseded diagnostic testnet revisions remain intentionally marked `ABANDONED_TESTNET` at the user's direction.
  They are excluded from the active product and active deployment record, but their old 2 GEN test purses were not
  recovered. These exceptions are disclosed rather than represented as global zero-accounting recovery.
