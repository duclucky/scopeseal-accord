# Phase 8 active Studionet lifecycle

Date: 2026-09-01

Status: **PASS - active lifecycle finalized and closed**

- Active contract: `0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879`
- Deployment transaction: `0xaa433850639827aebb7a3c7b766b8bf78c30f2806d2f26f92ea0004e32cdcac3`
- Agreement: `scopeseal-official-001`
- Demo value: exactly 2 GEN
- Final verdict: `WITHIN_BASELINE`
- Final state: `CLOSED`
- Final accounting: received 2 GEN, withdrawn 2 GEN, locked 0 GEN, credited 0 GEN

The sequential active lifecycle finalized four writes: sponsor CREATE with 2 GEN, contractor RATIFY with 0 GEN,
sponsor REVIEW with 0 GEN, and contractor WITHDRAW with 0 GEN attached. The review used the official TED original
`00190662-2025` and modification `00587863-2026`, achieved complete source coverage, passed the exact single-entity
settlement invariants, and derived contractor credit in contract code. Withdrawal debited credit before transfer and
canonical state was reloaded after finalization.

Sanitized hashes, receipt projections, Explorer links, and canonical state after each write are stored in
`deployment.json` and `lifecycle.json`. Those files do not contain raw receipts, validator configuration, traces,
stdout, stderr, or signer secrets.

Two earlier addresses remain documented only as `ABANDONED_TESTNET`; they are not active product contracts and are
not cited as successful lifecycle evidence.
