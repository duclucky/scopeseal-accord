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

Phase 13 shell exit checks also reached the production alias directly:

```text
curl.exe -sS -I https://scopeseal-accord.vercel.app
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Server: Vercel

curl.exe -sS https://scopeseal-accord.vercel.app
HAS_TITLE=True
HAS_REACT_ROOT=True
```

The returned document contained `<title>ScopeSeal Accord</title>` and `<div id="root"></div>`. PowerShell returned
the response as 14 lines (`System.Object[]`), so the verification joined those lines before applying the two string
checks; the response body was not modified.

There was no browser `Failed to fetch`, CORS error, horizontal overflow, or simulated contract state. The connected
role remained honestly `Observer` because no wallet was connected. Browser wallet signing remains a separate proof;
the script-signed Studionet lifecycle is not presented as browser-wallet evidence.

## Listing/logo production release - 2026-09-01

- Source commit: `37634ffd65fb671c50e57ff4610abb4e783d900d`
- Successful CI: https://github.com/duclucky/scopeseal-accord/actions/runs/33490807219
- CI result: `success`; verify job completed in 5m33s
- Vercel deployment ID: `dpl_CYfKYJwtYnjNfzC4qN19bkTLpweR`
- Production deployment: https://scopeseal-accord-meoze1le6-duckys-projects-bc83c6a0.vercel.app
- Production alias: https://scopeseal-accord.vercel.app
- Vercel result: `READY`

Fresh HTTP checks returned 200 for the production root, agreement `scopeseal-browser-002`,
`/scopeseal-logo.svg`, `/scopeseal-logo-512.png`, the active contract explorer page, and all six finalized
transaction explorer pages listed in the Phase 15 browser evidence. The PNG response was `image/png` and 20,454 bytes.

The user-controlled Chrome session then verified the production agreement at 1440 x 900 and 390 x 844. At both
sizes the logo rendered at 32 x 32 without horizontal overflow. The canonical card read `CLOSED`, `NEGOTIATED`,
0 GEN locked, 0 GEN sponsor credit, and 0 GEN contractor credit. The browser console contained zero warning/error
entries after the check. No transaction was sent during this read-only production verification.
