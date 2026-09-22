# MS-002 final verification

Observed on 2026-09-21 after the retryable closeout recovery and sponsor withdrawal.

## Canonical Studio Dev state

- Active contract: `0xAD2c9170ec79D5772167D92A8335dfd78E3660Bf` on Studio Dev chain `61997`.
- Latest authoritative read at `2026-09-21T05:13:58.335Z`: deployed code present and contract balance `0 GEN`.
- `scopeseal-v2-smoke-002`: agreement `CLOSED / NEGOTIATED`; closeout `CLOSED / EXPIRED_RECOVERY`; no locked value or credits.
- Global application accounting: `received=6 / withdrawn=6 / locked=0 / credited=0 GEN`.
- Recovery transaction: `0xb772d5e7443e59d0c8b4e84b5c2eb5a441b7c8582715692057dc124144c84642`, successful execution and majority agreement.
- Sponsor withdrawal: `0x85fb9dd120b1bcf6d6bb158421d93f1462e709756d0492db5aa084708ae7f4bb`, successful execution and majority agreement.

The sanitized command output and canonical fields are preserved in `recovery-audit-scopeseal-v2-smoke-002.json`; no private validator configuration or secret material is recorded.

## Local verification

Fresh `npm run check` completed successfully:

- GenVM lint recognized exactly one `ScopeSealAccord` contract with 22 methods (8 view, 14 write).
- 59 Python direct/static tests passed.
- 26 deployment/proxy tests passed.
- 48 frontend tests in 12 files passed.
- TypeScript and the production Vite build passed.

The Projects grading bot, supplied this fresh successful build result, reported all five mandatory gates `PASS`, an estimated rubric of 19/20, and `GATE OK`. The wrapper's additional global-Python `gltest tests/` repetition could not access the user cache because of a Windows ACL; it is not the project-required Python 3.12 `.venv` path and does not contradict the successful required suite above.

## Publication verification

- Existing public GitHub `main` history retained; no squash or force push.
- CI run `35560327654` completed successfully for the published implementation.
- Vercel deployment `dpl_6wUV3SuSMvhSw3T5XLMcKtF9wkrS` is `Ready` at <https://scopeseal-accord.vercel.app>.
- Fresh shell verification returned HTTP 200, the application name and React root, and same-origin RPC chain `0xf22d`.
- Fresh Chrome verification displayed the E5 closeout as `CLOSED / RELEASE_RETENTION / 0 GEN` from the active Studio Dev contract.

## Honest limits

This is testnet demonstration evidence, not independent customer adoption or mainnet usage. The production-origin wallet extension declined a new connection attempt, so the already-proven local Chrome wallet lifecycle remains the browser-write evidence; the production app's live read path is independently verified.
