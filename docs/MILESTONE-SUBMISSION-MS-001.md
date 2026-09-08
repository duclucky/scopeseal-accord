# MS-001 Portal submission packet

Submission status: **READY — DO NOT SUBMIT WITHOUT EXPLICIT ACTION-TIME AUTHORIZATION**

## Copy-ready fields

**Recommended category:** Milestones

**Project:** ScopeSeal Accord

**Milestone title:** Completion Retention Closeout

**Changes & Improvements (971 characters):**

ScopeSeal Accord now adds a post-performance Completion Retention Closeout. After an agreement closes, its sponsor can fund a separate 1 GEN retention and lock one TED lot plus a release standard; the contractor ratifies it. Validators fetch the official TED E5 completion record, verify publication, version, prior notice, buyer, procedure, contract, and lot, then judge whether the standard supports RELEASE_RETENTION or requires NEGOTIATE_RETENTION. Invalid, unavailable, or mismatched evidence stays RETRYABLE and moves no GEN. Studionet finalized the full release and withdrawal path at CLOSED with zero liability. Chrome/OKX separately finalized the new 1 GEN funding action, showed accepted/finalized, reloaded canonical state, and proved mismatched evidence remains UNVERIFIABLE with zero credits. The live app adds the role-gated closeout journey. Single-lot Studionet proof only; no legal conclusion, physical-performance proof, mainnet, or adoption is claimed.

**What changed:** ScopeSeal Accord added an independently funded 1 GEN post-performance closeout whose authenticated official TED E5 judgment controls release, negotiation, or a no-consequence retry.

**Why it matters:** Sponsors and contractors can co-ratify a completion standard and settle retention from authoritative public evidence without trusting either party or a private closeout operator.

## Evidence & Supporting Information

1. [Public repository](https://github.com/duclucky/scopeseal-accord)

2. [Exact implementation/evidence comparison](https://github.com/duclucky/scopeseal-accord/compare/f4d7cec499a39846ad8079b2d630d074aea6f039...c8f438131412923b039e7f89921f65713f44cc56)

3. [Successful GitHub Actions run](https://github.com/duclucky/scopeseal-accord/actions/runs/34247307347)

4. [Full milestone dossier](https://github.com/duclucky/scopeseal-accord/blob/main/docs/milestones/MS-001/README.md)

5. [Sanitized successful lifecycle proof](https://github.com/duclucky/scopeseal-accord/blob/main/docs/evidence/studionet/milestones/MS-001/lifecycle.json)

6. [Browser-wallet and fail-safe proof](https://github.com/duclucky/scopeseal-accord/blob/main/docs/evidence/studionet/milestones/MS-001/browser-lifecycle.json)

7. [Consolidated verification](https://github.com/duclucky/scopeseal-accord/blob/main/docs/evidence/studionet/milestones/MS-001/verification.md)

8. [Studionet contract](https://explorer-studio.genlayer.com/address/0x6AD210a93E448BdF7A6aE8C05098fc1e25983FD0)

9. [Deployment transaction](https://explorer-studio.genlayer.com/tx/0x37739328653c9f1de043f70bc3f65fcb7e9bc1d6700ed3903776ae20fe887e03)

10. [Live application](https://scopeseal-accord.vercel.app)

11. [Accepted Project baseline](https://portal.genlayer.foundation/builders/explorer/scopeseal-accord)

## Verified facts

| Fact | Verified value |
| --- | --- |
| Milestone status | `MS-001 / SUBMISSION_READY`; final Portal action not performed |
| Accepted baseline | Commit `f4d7cec`; Portal Revision 1 `Published`; contract `0x8837...E879` |
| Contract surface | One ASCII `ScopeSealAccord(gl.Contract)`, 14 writes, 8 views, pinned Depends runner |
| Automated verification | 118 tests: 58 Python/direct/receipt, 14 deployment/proxy, 46 frontend; TypeScript and production build pass |
| CI | Run `34247307347` completed `success` for public commit `c8f4381` |
| Network identity | Studionet chain `61999`; contract `0x6AD210...83FD0`; source commit `4eb6a0c`; SHA-256 `1dd203...65b` |
| Successful lifecycle | 1 GEN closeout finalized `OFFERED -> ACTIVE -> SETTLED -> CLOSED`; E5 `00734925-2025`; `RELEASE_RETENTION`; contractor withdrew once |
| Successful-path accounting | 3 GEN received, 3 GEN withdrawn, zero locked and credited |
| Browser proof | OKX finalized 1 GEN closeout funding with submitted/accepted/finalized UI and canonical reload; mismatched authority finalized `RETRYABLE` / `NO_CONSEQUENCE` with zero credits |
| Global active accounting after both proofs | 6 GEN received, 5 GEN withdrawn, 1 GEN locked, zero credited; the browser proof retention has a recorded sponsor recovery path and is not claimed recovered |
| Production QA | Vercel `dpl_FEWSGHwnuTiioksXndKnRiBN9T3j` READY using persisted public build configuration; HTTP 200; React root present; same-origin RPC `0xf22f`; Chrome live canonical read passed |
| Acceptance checker | `-Project scopeseal-accord -Category projects`: 0 BLOCKER; all five hard gates pass; build/tests and hygiene pass |

## Quantified metric

During the successful closeout window from `2026-09-08T12:26:59.714Z` through
`2026-09-08T12:30:20.140Z` on Studionet, one agreement/lot closeout used four finalized writes: one
1 GEN funding, one contractor ratification, one official E5 review, and one contractor withdrawal.
Exactly one `COMPLETION` entity and one review attempt produced `RELEASE_RETENTION`; accounting moved
from 1 GEN locked to 1 GEN contractor credit and then to zero liability. Identity and deduplication are
the deployed contract, agreement ID, lot ID, attempt number, publication identity, and public party EOAs.
The measurement source is the sanitized lifecycle JSON above.

## Real-usage signal and honest limitations

The production app and live role-gated closeout route are publicly reachable, and a connected OKX user
finalized the new funding action. No independent customer, procurement platform, transaction volume,
or external adoption is claimed. The successful E5 review and contractor withdrawal are script-signed
Studionet evidence; the browser proof covers sponsor funding/finality/canonical reload plus a real
no-consequence mismatch branch, not a successful browser E5 verdict. The browser proof retention remains
locked until its sponsor uses the recorded expiry recovery. The phase supports one TED lot on Studionet;
it does not prove physical delivery, legal compliance, multi-lot allocation, mainnet, or other wallets.

## Quality-bar qualification

This is substantial because it adds a new authenticated evidence class, seven writes, three views,
independent 1 GEN accounting, a complete closeout state machine, a role-gated product journey, and fresh
Studionet/browser evidence. It is not a restyle or repackaging: the accepted 2 GEN amendment decision is
only the closed baseline to which the new post-performance retention attaches. The delta is documented
from accepted commit `f4d7cec` and moves ScopeSeal from change-order adjudication into official
completion closeout while preserving multi-lot and external-consumer headroom.
