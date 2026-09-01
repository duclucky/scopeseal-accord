# Phase 12 live production verification

Date: 2026-09-01

Status: **PASS - Vercel production and browser read path verified**

- Production alias: `https://scopeseal-accord.vercel.app`
- Vercel deployment: `dpl_14r7QFk2TYmiG8W8GvSX7Fg4Vfpe`
- Active contract: `0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879`
- Build: 5,032 modules transformed; production deployment state `READY`
- Public repository: `https://github.com/duclucky/scopeseal-accord`
- Successful CI: `https://github.com/duclucky/scopeseal-accord/actions/runs/33484896671`

The cloud build used only public build-time configuration: active contract address, same-origin IC RPC path, and
official Explorer URL. No signer or private key was sent to Vercel.

## Live browser evidence

The in-app browser opened the production agreement route and the application itself read canonical state through the
same-origin `/genlayer-rpc` proxy. Visible production state:

```text
Studionet RPC ready
Agreement scopeseal-official-001
State: CLOSED
Verdict: WITHIN_BASELINE
Locked: 0 GEN
Sponsor credit: 0 GEN
Contractor credit: 0 GEN
```

Browser measurements and diagnostics:

```text
URL: https://scopeseal-accord.vercel.app/agreements/scopeseal-official-001
document title: ScopeSeal Accord
clientWidth: 1265
scrollWidth: 1265
console warning/error entries: []
```

There was no browser `Failed to fetch`, CORS error, horizontal overflow, or simulated contract state. The connected
role remained honestly `Observer` because no wallet was connected. Browser wallet signing remains a separate proof;
the script-signed Studionet lifecycle is not presented as browser-wallet evidence.
