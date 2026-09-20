# MS-002 local browser evidence

Observed at `2026-09-20 23:25:46 UTC` (`2026-09-21` Asia/Bangkok). This is local-browser evidence only. It is not a deployment, wallet signature, transaction, finalized lifecycle, CI, Vercel, or Portal claim.

## Reproduction

1. Start the Vite application on `http://127.0.0.1:4173/` with its dependency cache outside the repository. The existing generated `frontend/node_modules/.vite` path is ACL-locked on this Windows host, so the isolated cache avoids deleting or overwriting it.
2. Open the URL in the user's Chrome browser.
3. Wait for the footer RPC status.
4. Open the wallet picker without selecting a provider or approving a transaction.
5. Open **Create a 2 GEN agreement** without connecting a wallet.
6. Inspect visible state and Chrome console warnings/errors.

## Real observed output

```text
Studio Dev RPC ready
```

Chrome's wallet-selection dialog listed:

```text
OKX Wallet — EIP-6963 provider
MetaMask — Injected provider
OKX Wallet — Injected provider
```

The create page showed the canonical application amount separately:

```text
Agreement payment
2 GEN
Sent only through the selected EVM wallet after the current network is confirmed.
Connect wallet to create
```

Final Chrome inspection:

```json
{
  "statuses": ["2 GEN", "Studio Dev RPC ready"],
  "errorsOrWarnings": []
}
```

## What this proves

- The local Vite page renders in the user's real Chrome browser.
- The browser's same-origin `/api/genlayer-rpc` path reaches Studio Dev without a visible `Failed to fetch` or CORS error.
- The UI detects multiple EVM providers and requires an explicit provider choice rather than auto-selecting one.
- With no selected account, the create action is labeled as a connection action; no wallet signature or contract write was attempted.
- Application value is presented as 2 GEN, not raw base units or a protocol fee.

## Still required before Phase 6/7 can pass

- A fresh MS-002 contract address on Studio Dev and canonical view reads from that address.
- A real connected-account preflight and chain 61997 switch/add result.
- Browser-visible exact fee quote, approval, wallet signature, decision, successful finalization, actual/refunded fee fields, and canonical reload.
- A changed-journey failure/retry result that cannot be presented as success.
- Fresh 2 GEN agreement and 1 GEN closeout lifecycle evidence, safe receipt projections, Explorer links, CI and hosted-browser proof.
