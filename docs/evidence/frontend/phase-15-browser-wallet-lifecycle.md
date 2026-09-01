# Phase 15 Chrome/OKX browser-wallet lifecycle

Date: 2026-09-01
Network: Studionet
Result: SUCCESS for agreement `scopeseal-browser-002`

## Public identity

- App: https://scopeseal-accord.vercel.app/agreements/scopeseal-browser-002
- Contract: `0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879`
- Explorer: https://explorer-studio.genlayer.com/address/0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879
- Sponsor: `0xc495ef51618d03267a1f227afe5b27b38c748272`
- Contractor: `0xbd733bc56ec4a55fa25c068b9306b0171335d199`
- Browser/wallet: user-controlled Chrome session with the detected OKX EVM provider
- Official original TED publication: `00190662-2025`
- Official modification TED publication: `00587863-2026`

No private key, wallet export, complete raw Studio receipt, validator configuration, or browser profile is stored in this evidence.

## Finalized browser transitions

| Action | Signer | GEN sent | Finalized transaction | Canonical result after reload |
| --- | --- | ---: | --- | --- |
| Create | Sponsor | 2 GEN | [`0xab75e79d4f559d84752d8606537e11cd7b3207044d71a57f09db19bb8e5de9f3`](https://explorer-studio.genlayer.com/tx/0xab75e79d4f559d84752d8606537e11cd7b3207044d71a57f09db19bb8e5de9f3) | `DRAFT`; 2 GEN locked |
| Ratify | Contractor | 0 GEN | [`0x6186d0465d9350bbe5d40ed941b58c74aafebbe06fa0e1090da2daaadbc10a7f`](https://explorer-studio.genlayer.com/tx/0x6186d0465d9350bbe5d40ed941b58c74aafebbe06fa0e1090da2daaadbc10a7f) | `ACTIVE` |
| Request official review | Contractor | 0 GEN | [`0xf64975d8a08e54b005f1247a602ffd1b37df67b4a5f2b23b99284e1119f5f385`](https://explorer-studio.genlayer.com/tx/0xf64975d8a08e54b005f1247a602ffd1b37df67b4a5f2b23b99284e1119f5f385) | `MATERIAL_AMENDMENT`; `NEGOTIATION`; 2 GEN locked |
| Propose split | Sponsor | 0 GEN | [`0x96a8ddb1cf87c723b5ed277e6ca687b536514228f4cc6d0e9eb8ec00ee9a6e35`](https://explorer-studio.genlayer.com/tx/0x96a8ddb1cf87c723b5ed277e6ca687b536514228f4cc6d0e9eb8ec00ee9a6e35) | Nonce 1; 2 GEN contractor / 0 GEN sponsor |
| Accept split | Contractor | 0 GEN | [`0xda5bacb6714d431932980d50c55b30e09afbdcecd58cdd6e6f66a77103e45e44`](https://explorer-studio.genlayer.com/tx/0xda5bacb6714d431932980d50c55b30e09afbdcecd58cdd6e6f66a77103e45e44) | `SETTLED`; `NEGOTIATED`; 0 GEN locked; 2 GEN contractor credit |
| Withdraw | Contractor | 0 GEN | [`0x93627ee9c94de62ae7f17acd4efe79ac51f77fa9bd6d8e6d603234d84a36cded`](https://explorer-studio.genlayer.com/tx/0x93627ee9c94de62ae7f17acd4efe79ac51f77fa9bd6d8e6d603234d84a36cded) | `CLOSED`; `NEGOTIATED`; 0 GEN locked; both credits 0 GEN |

Each action was initiated from the production frontend, signed by the selected browser wallet account, observed through Submitted and accepted/decided handling, finalized through the selected wallet provider, and followed by a canonical Intelligent Contract state reload through the read path. After the completed flow, the page showed `CLOSED` and the browser warning/error console query returned an empty list.

## Accounting boundary and abandoned test evidence

The successful statement above is agreement-scoped: `scopeseal-browser-002` ended with 0 GEN locked and 0 GEN party credits.

`scopeseal-browser-001` is a separate abandoned browser test agreement. Its create transaction `0xeb23ffbce509376c6c340fa7f1d852ebcc46ba673067fa4b24e3745e79f7a9fa` finalized in `DRAFT` with 2 GEN locked, but its designated contractor was not an available browser-wallet actor for the intended two-party proof. At the user's direction, it was not used for the final demonstration and its testnet value was not recovered.

Two earlier diagnostic contract revisions are also retained as `ABANDONED_TESTNET` with unrecovered 2 GEN test purses. Therefore this document does not claim zero total accounting across all agreements or revisions. It proves one complete, reconciled browser-wallet lifecycle on the active contract and discloses the remaining testnet exceptions.
