# ScopeSeal Accord - GenLayer Projects listing

## Copy-ready fields

- **Name:** ScopeSeal Accord
- **Category:** Projects
- **Publication tier:** Preview (Studionet/Studio deployment)
- **Logo:** [`frontend/public/scopeseal-logo-512.png`](../../frontend/public/scopeseal-logo-512.png)
- **One-liner:** Turn an official procurement amendment into a neutral, funded change-order decision instead of letting either party interpret scope alone.
- **Website:** https://scopeseal-accord.vercel.app
- **Repository:** https://github.com/duclucky/scopeseal-accord
- **Successful CI:** https://github.com/duclucky/scopeseal-accord/actions/runs/33490807219
- **Contract:** https://explorer-studio.genlayer.com/address/0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879

## Short description

ScopeSeal Accord is for procurement sponsors and contractors who need a neutral decision when an official contract amendment may change the agreed scope. The parties co-ratify an immutable baseline and fund 2 GEN. GenLayer validators fetch the exact official TED original and modification notices, compare their meaning, and finalize either contractor release, bilateral negotiation, or a non-penalizing retryable result. Deterministic contract checks control every GEN consequence. This Preview deployment proves the product on Studionet; it does not claim legal advice, physical-performance proof, production adoption, or another network.

## How to try it

### Inspect the completed proof without spending GEN

1. Open https://scopeseal-accord.vercel.app/agreements/scopeseal-browser-002.
2. Confirm the canonical state is `CLOSED`, the verdict is `NEGOTIATED`, locked value is `0 GEN`, sponsor credit is `0 GEN`, and contractor credit is `0 GEN`.
3. Open the contract link shown by the app and compare it with the Studio explorer contract above.

### Complete a fresh two-account browser flow

You need two EVM accounts in a compatible browser wallet and at least 2 GEN plus testnet transaction fees in the sponsor account.

1. Open the website, choose **Connect wallet**, select the detected wallet, and approve the Studionet-compatible network switch.
2. As the sponsor, open **New agreement** and enter a new unique ID plus the contractor account.
3. Enter original publication `00190662-2025`, UUID `6480e4d5-6f07-4b83-8097-5756d8fbf527`, version `01`, buyer `3267368TH`, procedure `7f56490a-c5ba-4922-853b-07b18b0d14c1`, and contract reference `417379`.
4. Use canonical objective `Deliver the procurement scope described by the original official TED contract notice.` and allowance `Additions or omissions remain within baseline only when they preserve the original purpose, capability set, and material delivery boundary.`
5. Choose a ratification deadline at least one hour ahead, a review deadline at least 24 hours ahead, and a 1-hour negotiation window. Submit **Create and fund with 2 GEN**, sign, wait for Finalized, and confirm canonical `DRAFT` with `2 GEN` locked.
6. Switch the wallet to the designated contractor account, reload, choose **Ratify agreement**, sign, wait for Finalized, and confirm `ACTIVE`.
7. Enter modification publication `00587863-2026`, request review, sign, and wait through Submitted, Accepted/Decided, and Finalized. Confirm verdict `MATERIAL_AMENDMENT`, state `NEGOTIATION`, and `2 GEN` still locked.
8. Switch to the sponsor, propose `2 GEN` for the contractor, sign, and wait for Finalized.
9. Switch to the contractor, accept the current proposal nonce, sign, and wait for Finalized. Confirm `SETTLED`, `0 GEN` locked, and `2 GEN` contractor credit.
10. As the contractor, withdraw the `2 GEN` credit, sign, wait for Finalized, and confirm `CLOSED` with both credits at `0 GEN`.

Do not retry an ambiguous transaction until its hash and canonical state have been checked. Browser-wallet proof is separate from script-signed deployment proof.

## Evidence links

- [Chrome/OKX browser-wallet lifecycle](../evidence/frontend/phase-15-browser-wallet-lifecycle.md)
- [Script-signed Studionet lifecycle](../evidence/studionet/phase-8-active-lifecycle.md)
- [Production deployment](../evidence/frontend/phase-12-live-production.md)
