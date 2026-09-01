# Phase 6 deployment-tooling verification

Status: local tooling verified; no deployment transaction has been sent by this evidence item.

## TDD evidence

RED commands:

```text
.venv\Scripts\python.exe -m pytest tests/test_deployment_receipts.py -q
E   ModuleNotFoundError: No module named 'scripts.deployment_receipts'

node --test tests/deployment/*.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../scripts/studionet.mjs'
```

GREEN commands and real output:

```text
.venv\Scripts\python.exe -m pytest tests/test_deployment_receipts.py -q
...                                                                      [100%]
3 passed in 0.02s

node --test tests/deployment/*.test.mjs
tests 7
pass 7
fail 0
```

The Python and JavaScript projections cover raw Studio and normalized SDK receipt shapes. They copy only label,
transaction hash, status, execution result, consensus result and contract address. Raw receipt, validator
configuration, trace, stdout and stderr are never persisted.

## Current SDK network metadata

Command:

```text
node --input-type=module -e "import { studionet } from 'genlayer-js/chains'; ..."
```

Real selected output from pinned `genlayer-js@1.1.8`:

```json
{
  "id": 61999,
  "name": "Genlayer Studio Network",
  "rpcUrls": { "default": { "http": ["https://studio.genlayer.com/api"] } },
  "blockExplorers": { "default": { "url": "https://genlayer-explorer.vercel.app" } }
}
```

## Authorized signer and live RPC inspection

The script searched project `.env` first and the authorized parent `.env` second. It reported presence only; it did
not print either private key. An already-authorized root integrator EOA was reused as contractor, so no EOA was
generated and no funding transaction was needed.

Command:

```text
npm run studionet:inspect
```

Real safe result:

```text
network: studionet
chainId: 61999
sponsorSigner: true
contractorSigner: true
sponsor: 0xC495ef51618D03267A1f227aFe5b27B38c748272
contractor: 0x45aD397c438397A702B53a7499a78D08961D39Db
deploymentDecision: DEPLOY
deployment: null
```

The full safe command output also showed both public accounts have more than the required demo amount. Human-facing
values were formatted in GEN; base units are used only at the SDK transport boundary. `create_agreement` attaches
exactly 2 GEN.

## Resume and retry guarantees

- Deployment identity binds Studionet, chain ID, contract source commit/hash, Depends runner, API family and both
  public actor addresses.
- A submitted/accepted deployment is finalized from its recorded transaction hash before another deploy is allowed.
- Every lifecycle call records a pending hash before waiting; recovery finalizes that hash and reloads canonical state.
- The next write is selected from canonical `get_agreement` and `get_accounting` state.
- A `RETRYABLE` review is not replayed by the normal lifecycle command. `studionet:retry` reads the current attempt
  number dynamically and permits retry only when that exact attempt reports transient `UNAVAILABLE`; structural
  `INVALID` results are refused.
- Evidence files contain safe projections and canonical views, never complete receipts.

## Dependency audit note

`npm audit --json` reported zero critical/high issues and two moderate transitive findings in the pinned `genlayer`
development CLI path (`dockerode@4.0.12` -> `uuid@10.0.0`). `npm audit fix --dry-run` proposed no package changes. The
official pinned CLI/API unit was not silently overridden; this finding does not affect browser production dependencies
or the receipt projection, and remains recorded for later upstream migration review.
