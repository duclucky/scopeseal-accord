# Phase 6 frontend integration verification

Status: frontend contract integration and browser-local RPC path verified. No browser wallet transaction or deployed
contract state is claimed by this file; those require the later Studionet deployment gate.

## Test-first adapter evidence

RED:

```text
npm test -- src/adapters/genlayerContract.test.ts
Error: Failed to resolve import "./genlayerContract"
Test Files 1 failed
```

GREEN/full frontend verification:

```text
npm test
Test Files 12 passed (12)
Tests 38 passed (38)

npm run typecheck
tsc -b

npm run build
4584 modules transformed
dist/assets/index-BO9nd8DR.css 16.41 kB (3.93 kB gzip)
dist/assets/index-DOpRIbFa.js 294.44 kB (89.62 kB gzip)
built in 452ms
```

The adapter tests prove:

- reads use the same-origin `/genlayer-rpc` path and map canonical structured views;
- the account index is used instead of local storage;
- `create_agreement` attaches exactly 2 GEN at the SDK transport boundary;
- all seven writes map to their exact contract entrypoint;
- the selected EIP-1193 provider is passed to the write client;
- accepted and finalized states are awaited separately;
- finalized execution errors reject rather than claiming success;
- canonical state is reloaded only after finalization.

The browser-control tests exercise create, ratify, review, explicit retry, propose, accept, recover and withdraw UI
controls in their matching role/state. Ineligible controls are not shown.

## Browser-local verification

The Vite application was served on an all-interface local listener while the browser opened only the localhost origin.
The app itself issued a POST to `/genlayer-rpc`; the same-origin development proxy forwarded it to the pinned
Studionet IC RPC. The visible result was:

```text
Studionet RPC ready
```

The probe accepts only `eth_chainId = 0xf22f`. This is browser proof rather than a Node `fetch` substitute. Browser
console warnings/errors after the probe: `[]`.

Responsive measurements from the real browser:

```text
375x812 create route: clientWidth 360, scrollWidth 360, 13 fields, primary button height 44.21875px
375x812 wallet modal: left 16, top 251.78125, width 328, height 308.4375, overflow false
768x900 detail route: clientWidth 768, scrollWidth 768, honest unconfigured canonical state true
1440x900 activity route: clientWidth 1425, scrollWidth 1425, honest wallet-required state true
```

FE-PRESERVE remained in force: integration added only canonical data cards, legal actions, transaction status and the
network health indicator. The locked typography, palette, navigation, layout hierarchy and responsive breakpoints
were not redesigned.

## Honest boundary

- Browser-local RPC/CORS behavior: verified.
- EIP-6963 selection, injected fallbacks, centered modal and disconnect: verified by frontend tests and browser layout.
- Real browser wallet signature: pending a configured deployment and user wallet environment.
- Accepted/finalized browser transaction and post-finality canonical reload against Studionet: pending the network
  lifecycle gate.
