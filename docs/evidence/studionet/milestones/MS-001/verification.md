# MS-001 Studionet verification

Verified: 2026-09-08 UTC

## Active identity

- Network: Studionet, chain ID 61999
- Contract: `0x6AD210a93E448BdF7A6aE8C05098fc1e25983FD0`
- Explorer: https://explorer-studio.genlayer.com/address/0x6AD210a93E448BdF7A6aE8C05098fc1e25983FD0
- Deploy tx: https://explorer-studio.genlayer.com/tx/0x37739328653c9f1de043f70bc3f65fcb7e9bc1d6700ed3903776ae20fe887e03
- Source commit: `4eb6a0c5d2eb1b8ebf8bafa2ca8a0e30f7fedb6b`
- Contract API: `ScopeSealAccord/2`

## Consequential delta proof

| Step | Value | Finalized transaction | Canonical result |
| --- | ---: | --- | --- |
| Open closeout | 1 GEN | https://explorer-studio.genlayer.com/tx/0xaa641b1782beaf22817196b3e8dc6a1779be0281cde61f512950145b28040a3f | `OFFERED`, 1 GEN locked |
| Contractor ratify | 0 GEN | https://explorer-studio.genlayer.com/tx/0xd2692df7079016a1bb3002cde6a54bd66fb6d8be110648b56c66750e587901d5 | `ACTIVE`, 1 GEN locked |
| Review official E5 | 0 GEN | https://explorer-studio.genlayer.com/tx/0x0e2b2c9013887211a0128f4299377f52d65497980b4b2ba93b30bd94f9c94689 | `SETTLED`, `RELEASE_RETENTION`, contractor credit 1 GEN |
| Contractor withdraw | 0 GEN | https://explorer-studio.genlayer.com/tx/0xcd2a01e75b52f60e7c0381922df100b76f367cdba017d78267db73776637479b | `CLOSED`, 0 GEN locked/credited |

`npm run studionet:inspect` reported source/coverage `COMPLETE`, verdict `RELEASE_RETENTION`, consequence
`CREDIT_CONTRACTOR`, contract balance 0 GEN, and active accounting received 3 / locked 0 / credited 0 /
withdrawn 3 GEN.

## Browser-local proof

Chrome loaded `http://localhost:5174/agreements/scopeseal-closeout-001/closeout` through the production
adapter boundary. The page showed Studionet RPC `ready` and canonical `CLOSED`, `RELEASE_RETENTION`,
`LOT-0001`, locked 0 GEN, sponsor credit 0 GEN, and contractor credit 0 GEN. There was no browser
`Failed to fetch` or CORS error.

The separately connected OKX account `0xbd733bc56ec4a55fa25c068b9306b0171335d199` then exercised the
changed write path on agreement `scopeseal-browser-ms001-001`:

| Step | Value | Finalized transaction | Canonical result |
| --- | ---: | --- | --- |
| Browser fund closeout | 1 GEN | https://explorer-studio.genlayer.com/tx/0x77274c2ea97a5826618ba945ac08dba6ac538ca5c637596ba63c545c54c11358 | UI showed accepted, finalized, then `OFFERED` with 1 GEN locked |
| Contractor ratify | 0 GEN | https://explorer-studio.genlayer.com/tx/0x498f5694a8e573e3ffb41a6c022960f48f27ba0fd079abfe4d6245ff0d28b915 | `ACTIVE`, 1 GEN locked |
| Mismatched E5 tripwire | 0 GEN | https://explorer-studio.genlayer.com/tx/0x12eddc49b008f504138d84f34050c085fb6d38eb20a697c11b892f94026c2dc3 | `RETRYABLE`, `UNVERIFIABLE`, source `MISMATCH`, `NO_CONSEQUENCE` |

Chrome was reloaded as a fresh disconnected observer and read canonical `RETRYABLE`, `UNVERIFIABLE`,
`LOT-0001`, 1 GEN locked, and zero sponsor/contractor credits. The mismatch was caused by requesting an
E5 record linked to `00547772-2025` for an agreement locked to `00190662-2025`; official TED search found
no qualifying E5 completion record for the latter ([projected lookup](browser-completion-lookup.json)). The resumable runner therefore reports
`REFUSE_STRUCTURAL_RETRY` and sends no retry. Global active-revision accounting is received 6 /
withdrawn 5 / locked 1 / credited 0 GEN; sponsor recovery becomes available at
`2026-09-08T17:28:00.000Z`. No recovery or successful browser E5 verdict is claimed.

## Superseded diagnostic revision

`0x9eD134a2D1b39071145A2958b798e1B3c2cf2611` is archived as `ABANDONED_TESTNET`. Its E5 review produced
a non-penalizing `UNVERIFIABLE`; 1 GEN remained locked, no credits or consequence occurred, and no
further value will be sent to it.
