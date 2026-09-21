# MS-002 local browser evidence

Initially observed at `2026-09-20 23:25:46 UTC`, then repeated against the replacement deployment at `2026-09-21 04:00 UTC` (`2026-09-21` Asia/Bangkok). This is local-browser evidence. Transaction receipts and canonical lifecycle proof remain in their separate Studio Dev evidence files.

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

## Replacement-deployment browser verification

Chrome loaded active contract `0xAD2c9170ec79D5772167D92A8335dfd78E3660Bf` through the same-origin proxy and visibly reached `Studio Dev RPC ready` with no captured console warning/error. Fresh canonical reads showed:

```text
scopeseal-v2-e5-003 closeout: CLOSED / RELEASE_RETENTION / 0 GEN locked
scopeseal-v2-smoke-002 closeout: RETRYABLE / UNVERIFIABLE / 1 GEN locked
```

The picker again listed the distinct EIP-6963 and injected providers. Selecting the injected OKX provider connected the authorized sponsor `0xc495...8272` on chain 61997. The retryable closeout then exposed sponsor-only **Retry official review** and **Recover after expiry** controls. Opening the clickable account control displayed the full connected address and **Disconnect wallet**. Disconnect immediately restored **Connect a wallet**, removed the connected account, and hid the sponsor write controls.

This proves the replacement address is used by browser reads, both successful and non-penalizing retry states are surfaced honestly, chain/account role preflight succeeds with the detected wallet, and logout clears write authority. The earlier connected browser lifecycle evidence separately proves exact fee quote/approval, signature, decision/finalization, fee outcome, and canonical reload behavior. The final hosted-browser repetition remains Phase 8 publication evidence.
