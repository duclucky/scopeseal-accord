# ScopeSeal Accord Project Explorer Listing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible ScopeSeal brand mark in SVG and Portal-ready 512 px PNG form, publish copy-ready Projects listing instructions, and preserve sanitized proof of the completed Chrome/OKX lifecycle.

**Architecture:** Keep the SVG as the single visual source, rasterize the PNG from it with isolated headless Chrome, and integrate the same SVG into the existing React shell and favicon without changing layout. Store listing copy and browser proof as focused project documentation; update the root idea registry only with factual status and the existing accounting exception.

**Tech Stack:** React 19, TypeScript, Vite, Vitest/Testing Library, SVG, PNG, PowerShell, headless Chrome, Markdown, Vercel.

## Global Constraints

- Category is **Projects** and the Studio/Studionet listing status is **Preview**, not Live.
- Human-facing value is always GEN; the fresh demo uses exactly 2 GEN.
- Preserve the current typography, navigation, responsive structure, colors, and reduced-motion behavior.
- Canonical colors are navy `#1E3A8A`, gold `#B45309`, and white.
- `frontend/public/scopeseal-logo-512.png` is exactly 512 x 512 with an opaque white background and is rasterized from the SVG.
- Browser-wallet writes and script-signed writes remain distinct evidence classes.
- Disclose `scopeseal-browser-001` and the older `ABANDONED_TESTNET` revisions; do not claim global accounting is zero.
- Do not modify contract source, deployment identity, state, or value flows.
- Do not click the Portal Submit control without separate action-time authorization.

---

## File map

- `frontend/public/scopeseal-logo.svg`: canonical, self-contained brand vector.
- `frontend/public/scopeseal-logo-512.png`: deterministic Portal upload rendered from the SVG.
- `frontend/src/App.test.tsx`: accessible brand integration regression test.
- `frontend/src/components/AppShell.tsx`: header logo integration.
- `frontend/src/styles/global.css`: fixed-size, no-layout-shift logo styling.
- `frontend/index.html`: favicon declaration.
- `docs/submission/project-listing.md`: copy-ready Portal fields and exact reviewer flow.
- `docs/evidence/frontend/phase-15-browser-wallet-lifecycle.md`: sanitized Chrome/OKX lifecycle proof.
- `README.md`: current status, listing assets, browser proof, and honest limitations.
- `docs/README.md`: specification status and browser evidence correction.
- `docs/superpowers/specs/2026-09-01-project-explorer-listing-design.md`: mark the approved spec as approved.
- `D:/Genlayer Project/docs/IDEA-REGISTRY.md`: root knowledge status and completion note; not part of the project Git repository.

### Task 1: Accessible brand assets and frontend integration

**Files:**
- Create: `frontend/public/scopeseal-logo.svg`
- Create: `frontend/public/scopeseal-logo-512.png`
- Modify: `frontend/src/App.test.tsx`
- Modify: `frontend/src/components/AppShell.tsx`
- Modify: `frontend/src/styles/global.css`
- Modify: `frontend/index.html`

**Interfaces:**
- Produces: public asset paths `/scopeseal-logo.svg` and `/scopeseal-logo-512.png`.
- Preserves: accessible brand link name `ScopeSeal Accord home` and the existing 32 px header footprint.

- [ ] **Step 1: Write the failing accessible-logo test**

Add this test inside the existing `describe` block in `frontend/src/App.test.tsx`:

```tsx
it("uses the approved decorative logo without duplicating the brand name", () => {
  renderAt("/");

  const brand = screen.getByRole("link", { name: "ScopeSeal Accord home" });
  const logo = brand.querySelector("img");
  expect(logo).toHaveAttribute("src", "/scopeseal-logo.svg");
  expect(logo).toHaveAttribute("alt", "");
  expect(logo).toHaveAttribute("width", "32");
  expect(logo).toHaveAttribute("height", "32");
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```powershell
npm --prefix frontend test -- src/App.test.tsx
```

Expected: one failure because the current `.brand-mark` is a `span`, so `brand.querySelector("img")` is `null`.

- [ ] **Step 3: Add the canonical SVG**

Create `frontend/public/scopeseal-logo.svg` with this exact self-contained vector:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title">
  <title id="title">ScopeSeal Accord seal and check logo</title>
  <rect width="512" height="512" rx="112" fill="#FFFFFF"/>
  <circle cx="256" cy="256" r="178" fill="#1E3A8A"/>
  <circle cx="256" cy="256" r="132" fill="#FFFFFF" stroke="#B45309" stroke-width="24"/>
  <path d="M181 258l49 49 105-111" fill="none" stroke="#1E3A8A" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 4: Integrate the SVG in the React shell and favicon**

Replace the letter span in `frontend/src/components/AppShell.tsx` with:

```tsx
<img
  className="brand-mark"
  src="/scopeseal-logo.svg"
  alt=""
  aria-hidden="true"
  width="32"
  height="32"
/>
```

Replace the `.brand-mark` rule in `frontend/src/styles/global.css` with:

```css
.brand-mark {
  width: 2rem;
  height: 2rem;
  flex: 0 0 auto;
  display: block;
  border-radius: 0.45rem;
}
```

Add this line after the viewport meta tag in `frontend/index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/scopeseal-logo.svg" />
```

- [ ] **Step 5: Run the focused test and confirm GREEN**

Run:

```powershell
npm --prefix frontend test -- src/App.test.tsx
```

Expected: all tests in `src/App.test.tsx` pass.

- [ ] **Step 6: Rasterize the Portal PNG from the SVG**

Resolve Chrome from `C:\Program Files\Google\Chrome\Application\chrome.exe`, create the isolated project-local profile directory `frontend/.logo-chrome-profile`, and run:

```powershell
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=512,512 --user-data-dir="$PWD\frontend\.logo-chrome-profile" --screenshot="$PWD\frontend\public\scopeseal-logo-512.png" "file:///$($PWD.Path.Replace('\','/'))/frontend/public/scopeseal-logo.svg"
```

Verify the resolved temporary profile path starts with the exact project root, then delete only `frontend/.logo-chrome-profile`.

- [ ] **Step 7: Verify asset structure and dimensions**

Run PowerShell XML and PNG header checks:

```powershell
[xml]$svg = Get-Content -Raw frontend/public/scopeseal-logo.svg
if ($svg.svg.viewBox -ne '0 0 512 512') { throw 'SVG viewBox mismatch' }
$source = Get-Content -Raw frontend/public/scopeseal-logo.svg
if ($source -match '<script|<image|xlink:href|filter=') { throw 'Unsafe SVG content' }
$bytes = [IO.File]::ReadAllBytes('frontend/public/scopeseal-logo-512.png')
$width = [Net.IPAddress]::NetworkToHostOrder([BitConverter]::ToInt32($bytes, 16))
$height = [Net.IPAddress]::NetworkToHostOrder([BitConverter]::ToInt32($bytes, 20))
if ($width -ne 512 -or $height -ne 512) { throw "PNG dimensions: $width x $height" }
if ($bytes[25] -ne 2) { throw "PNG is not opaque RGB; color type: $($bytes[25])" }
"SVG SAFE; PNG ${width}x${height} opaque RGB"
```

Expected: `SVG SAFE; PNG 512x512 opaque RGB`. Inspect the PNG visually with the local image viewer.

- [ ] **Step 8: Run the frontend gate and commit Task 1**

Run:

```powershell
npm --prefix frontend test
npm --prefix frontend run typecheck
npm --prefix frontend run build
```

Expected: all frontend tests pass, TypeScript exits 0, and Vite production build exits 0. Then stage only Task 1 files, inspect the staged list and diff, and commit with `feat: add ScopeSeal listing logo`.

### Task 2: Copy-ready listing and browser evidence

**Files:**
- Create: `docs/submission/project-listing.md`
- Create: `docs/evidence/frontend/phase-15-browser-wallet-lifecycle.md`
- Modify: `README.md`
- Modify: `docs/README.md`
- Modify: `docs/superpowers/specs/2026-09-01-project-explorer-listing-design.md`

**Interfaces:**
- Consumes: `/scopeseal-logo-512.png`, active contract `0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879`, and agreement `scopeseal-browser-002`.
- Produces: copy-ready Portal content and sanitized public lifecycle proof.

- [ ] **Step 1: Write the listing document with exact fields**

Create `docs/submission/project-listing.md` containing:

```markdown
# ScopeSeal Accord — GenLayer Projects listing

## Copy-ready fields

- **Name:** ScopeSeal Accord
- **Category:** Projects
- **Publication tier:** Preview (Studionet/Studio deployment)
- **Logo:** `frontend/public/scopeseal-logo-512.png`
- **One-liner:** Turn an official procurement amendment into a neutral, funded change-order decision instead of letting either party interpret scope alone.
- **Website:** https://scopeseal-accord.vercel.app
- **Repository:** https://github.com/duclucky/scopeseal-accord
- **Contract:** https://explorer-studio.genlayer.com/address/0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879

## Short description

ScopeSeal Accord is for procurement sponsors and contractors who need a neutral decision when an official contract amendment may change the agreed scope. The parties co-ratify an immutable baseline and fund 2 GEN. GenLayer validators fetch the exact official TED original and modification notices, compare their meaning, and finalize either contractor release, bilateral negotiation, or a non-penalizing retryable result. Deterministic contract checks control every GEN consequence. This Preview deployment proves the product on Studionet; it does not claim legal advice, physical-performance proof, production adoption, or another network.

## How to try it

### Inspect the completed proof without spending GEN

1. Open https://scopeseal-accord.vercel.app/agreements/scopeseal-browser-002.
2. Confirm the canonical state is `CLOSED`, the verdict is `NEGOTIATED`, locked value is `0 GEN`, sponsor credit is `0 GEN`, and contractor credit is `0 GEN`.
3. Open the contract link shown by the app and compare it with the Studio explorer contract above.

### Complete a fresh two-account browser flow

You need two EVM accounts in a compatible browser wallet and at least 2 GEN plus testnet transaction fees in the sponsor account.

1. Open the website, choose **Connect wallet**, select the detected wallet, and approve the Studionet-compatible network switch.
2. As the sponsor, open **New agreement** and enter a new unique ID plus the contractor account.
3. Enter original publication `00190662-2025`, UUID `6480e4d5-6f07-4b83-8097-5756d8fbf527`, version `01`, buyer `3267368TH`, procedure `7f56490a-c5ba-4922-853b-07b18b0d14c1`, and contract reference `417379`.
4. Use canonical objective `Deliver the procurement scope described by the original official TED contract notice.` and allowance `Additions or omissions remain within baseline only when they preserve the original purpose, capability set, and material delivery boundary.`
5. Choose a ratification deadline at least one hour ahead, a review deadline at least 24 hours ahead, and a 1-hour negotiation window. Submit **Create and fund with 2 GEN**, sign, wait for Finalized, and confirm canonical `DRAFT` with `2 GEN` locked.
6. Switch the wallet to the designated contractor account, reload, choose **Ratify agreement**, sign, wait for Finalized, and confirm `ACTIVE`.
7. Enter modification publication `00587863-2026`, request review, sign, and wait through Submitted, Accepted/Decided, and Finalized. Confirm verdict `MATERIAL_AMENDMENT`, state `NEGOTIATION`, and `2 GEN` still locked.
8. Switch to the sponsor, propose `2 GEN` for the contractor, sign, and wait for Finalized.
9. Switch to the contractor, accept the current proposal nonce, sign, and wait for Finalized. Confirm `SETTLED`, `0 GEN` locked, and `2 GEN` contractor credit.
10. As the contractor, withdraw the `2 GEN` credit, sign, wait for Finalized, and confirm `CLOSED` with both credits at `0 GEN`.

Do not retry an ambiguous transaction until its hash and canonical state have been checked. Browser-wallet proof is separate from script-signed deployment proof.
```

- [ ] **Step 2: Write sanitized browser-wallet evidence**

Create `docs/evidence/frontend/phase-15-browser-wallet-lifecycle.md` with the active contract/explorer, Chrome + OKX environment, both public actor addresses, and these exact finalized transitions:

```text
CREATE  0xab75e79d4f559d84752d8606537e11cd7b3207044d71a57f09db19bb8e5de9f3 -> DRAFT, 2 GEN locked
RATIFY  0x6186d0465d9350bbe5d40ed941b58c74aafebbe06fa0e1090da2daaadbc10a7f -> ACTIVE
REVIEW  0xf64975d8a08e54b005f1247a602ffd1b37df67b4a5f2b23b99284e1119f5f385 -> MATERIAL_AMENDMENT / NEGOTIATION
PROPOSE 0x96a8ddb1cf87c723b5ed277e6ca687b536514228f4cc6d0e9eb8ec00ee9a6e35 -> 2 GEN contractor / 0 GEN sponsor, nonce 1
ACCEPT  0xda5bacb6714d431932980d50c55b30e09afbdcecd58cdd6e6f66a77103e45e44 -> SETTLED, 2 GEN contractor credit
WITHDRAW 0x93627ee9c94de62ae7f17acd4efe79ac51f77fa9bd6d8e6d603234d84a36cded -> CLOSED, 0 GEN locked/credited
```

State that the browser console had zero warnings/errors after the completed flow. Disclose `scopeseal-browser-001` as an abandoned test agreement with 2 GEN locked and disclose the two older diagnostic revisions as `ABANDONED_TESTNET`; do not describe total contract or cross-revision accounting as zero.

- [ ] **Step 3: Correct public status documents**

Update `README.md` to link the listing and browser evidence, state that the complete browser-wallet lifecycle is captured, and replace the obsolete browser-pending limitation with the exact `browser-001`/superseded-accounting disclosure.

Update `docs/README.md` to state the active browser evidence finalized the material-amendment negotiation path while the earlier script lifecycle finalized the within-baseline path. Preserve the existing superseded-accounting blocker language.

Change the approved spec status to `Approved 2026-09-01`.

- [ ] **Step 4: Verify documentation consistency and commit Task 2**

Run:

```powershell
rg -n "browser-wallet write/sign/finality run has not yet|browser wallet transaction.*pending|Status:.*Live|wei" README.md docs
rg -n "Name:|Category: Projects|Publication tier: Preview|One-liner:|Short description|How to try it|scopeseal-logo-512.png|explorer-studio" docs/submission/project-listing.md
git diff --check
```

Expected: the stale/policy-violation search returns no match; every required listing field search returns a match; `git diff --check` exits 0. Then stage only Task 2 files, inspect the staged diff, and commit with `docs: add browser proof and listing packet`.

### Task 3: Root registry reconciliation

**Files:**
- Modify: `D:/Genlayer Project/docs/IDEA-REGISTRY.md`

**Interfaces:**
- Consumes: the public lifecycle evidence from Task 2.
- Produces: accurate workspace-level ScopeSeal status while preserving the accounting exception.

- [ ] **Step 1: Update only IDEA-021 status and completion note**

Change the table status to:

```text
COMPLETED CORE - PROJECTS / STUDIONET SCRIPT + OKX BROWSER LIFECYCLES + VERCEL + CI VERIFIED / PORTAL PENDING / TEST ACCOUNTING EXCEPTION
```

Replace the completion note's obsolete browser-pending sentence with a factual summary of `scopeseal-browser-002`: material review, sponsor proposal, contractor acceptance and 2 GEN withdrawal finalized in Chrome/OKX, ending `CLOSED` with zero agreement-level locked value and credits. Add that `scopeseal-browser-001` still has 2 GEN locked. Keep the existing superseded-revision exception unchanged in meaning.

- [ ] **Step 2: Verify focused registry diff**

Run:

```powershell
rg -n -C 4 "IDEA-021|scopeseal-browser-001|scopeseal-browser-002|Superseded-revision exception" 'D:/Genlayer Project/docs/IDEA-REGISTRY.md'
```

Expected: browser proof is current and both accounting exceptions remain explicit. The knowledge root is intentionally not a Git repository, so no commit is created for this file.

### Task 4: Full verification, public deployment, and acceptance audit

**Files:**
- Verification only; update evidence solely if a real command result changes a documented fact.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: fresh local, CI, Vercel, browser, precheck, and master-prompt audit evidence.

- [ ] **Step 1: Run the full local gate**

Run:

```powershell
npm run check
```

Expected: `ScopeSealAccord` recognized by GenVM lint, all Python/direct and deployment helper tests pass, all frontend tests pass, TypeScript passes, and production build completes. Record exact counts from real output.

- [ ] **Step 2: Perform public-repository hygiene before push**

Run the mandated root, worktree, staged/tracked file, forbidden-path, ignored-env, history, diff, and secret-label checks. Confirm the repository root is exactly `D:/Genlayer Project/scopeseal-accord`, inspect every outgoing commit and file, and ensure `.env` files exist locally only where expected and remain ignored.

- [ ] **Step 3: Push the verified commits and wait for exact CI**

Push `main` to the existing GitHub remote, obtain the workflow run for the pushed commit, and wait until that exact run is `completed/success`. Do not report a previous run as current evidence.

- [ ] **Step 4: Deploy the verified frontend to Vercel**

Run from `frontend/`:

```powershell
vercel --prod --yes
```

Expected: production alias `https://scopeseal-accord.vercel.app` points to the new deployment. Verify `/scopeseal-logo.svg` and `/scopeseal-logo-512.png` both return HTTP 200.

- [ ] **Step 5: Inspect production in Chrome at desktop and mobile sizes**

Open the live app through the existing Chrome session, verify the header logo at desktop and mobile widths, open `scopeseal-browser-002`, and confirm canonical `CLOSED`/`NEGOTIATED`/zero agreement-credit state. Confirm no new console warning/error. This is read-only; do not send another transaction.

- [ ] **Step 6: Run the Projects acceptance precheck**

Run:

```powershell
& 'D:/Genlayer Project/tools/genlayer-grading-bot/genlayer-precheck.ps1' -Project 'D:/Genlayer Project/scopeseal-accord' -Category projects -RepoUrl 'https://github.com/duclucky/scopeseal-accord' -ExplorerUrl 'https://explorer-studio.genlayer.com/address/0x8837Acc0F7E1C73Af0ee7A630D85f8DfD613E879'
```

Expected: no `BLOCKER`. Report every warning exactly; do not turn the known version-pragma warning into a source change because the verified official Depends-only contract form wins.

- [ ] **Step 7: Re-read the master prompt and audit every item**

Re-read `D:/Genlayer Project/MASTER-PROMPT-GENLAYER-END-TO-END.md` in full and compare every phase, all 14 gates, FE-PRESERVE, FE-HONEST, FE-SURFACE, project listing requirements, and final acceptance conditions with command/evidence links. List any remaining uncertainty or policy exception instead of guessing. Do not claim Portal submission until the user separately authorizes the final click.
