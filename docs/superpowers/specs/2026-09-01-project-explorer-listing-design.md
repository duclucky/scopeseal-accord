# ScopeSeal Accord listing and logo design

Date: 2026-09-01
Status: Approved 2026-09-01

## Objective

Prepare ScopeSeal Accord for its GenLayer Projects listing without redesigning the accepted product. The change adds a recognizable brand asset, complete reviewer-facing listing copy, and sanitized proof of the already-completed Chrome/OKX lifecycle.

The listing remains honest about its deployment tier: the active contract is on Studionet/Studio, so the listing status is **Preview**, not Live.

## Approved visual direction

Use the approved **Seal + check** concept: a restrained agreement seal containing a clear check mark. The mark represents co-ratified terms and a completed, canonical outcome without implying government certification.

- Shape: square composition, circular seal, simple central check.
- Palette: navy `#1E3A8A`, gold `#B45309`, and white.
- Style: flat vector, no gradients, no shadows, no tiny text, and no emoji.
- Density: readable at favicon size and sufficiently distinctive at the Portal's 512 px listing size.
- Continuity: retain the existing typography, spacing, navigation, and page layout.

The verified UI database result recommends the Phosphor `check-circle`/`check` semantics for approved or complete status. The custom mark will use the same simple outline vocabulary already present in the product. The verified React guidance requires accessible-role and label-based tests instead of test IDs as the default.

## Asset outputs

1. `frontend/public/scopeseal-logo.svg`
   - Canonical vector source.
   - Square `viewBox` and no external fonts, scripts, filters, or remote references.
   - Used by the application header and browser favicon.

2. `frontend/public/scopeseal-logo-512.png`
   - Exactly 512 x 512 pixels.
   - Opaque white background so it remains predictable in Portal previews and downloads.
   - Deterministically rasterized from the canonical SVG, not independently redrawn.
   - Intended for direct upload to the GenLayer Portal.

The PNG and SVG must show the same geometry and colors. Both files are public assets and contain no metadata, wallet data, or environment values.

## Frontend integration

- Replace the CSS letter `S` in the header with the SVG asset.
- Reserve fixed width and height to prevent layout shift.
- Treat the header image as decorative because the adjacent visible text already says “ScopeSeal Accord”; use an empty alternative and hide duplicated semantics from assistive technology.
- Add the SVG favicon link to `frontend/index.html`.
- Keep the existing brand link's accessible name and keyboard behavior unchanged.
- Preserve the current responsive layout and reduced-motion behavior.

## Listing content

The repository will contain copy-ready English fields for the Portal:

- Name: ScopeSeal Accord
- Category: Projects
- Status: Preview
- One-liner: plain-language explanation of funded procurement change-order decisions.
- Short description: what it does, who it serves, why official evidence and co-ratification matter, and the honest Studionet limit.
- Links: GitHub repository, Vercel website, active Studio explorer contract, and sanitized lifecycle evidence.

The “How to try it” section will have two paths:

1. A no-transaction inspection path that opens the completed `scopeseal-browser-002` agreement and verifies its canonical `CLOSED` state, `NEGOTIATED` verdict, and zero remaining agreement credits.
2. An exact fresh-user lifecycle requiring two EVM accounts on the configured Studionet-compatible wallet network:
   - connect the sponsor account through the wallet-selection modal;
   - create an agreement with a 2 GEN deposit and designate the contractor account;
   - switch to the contractor account and ratify;
   - request review using the documented official TED identifiers;
   - after `MATERIAL_AMENDMENT`, switch to the sponsor and propose the documented 2 GEN allocation;
   - switch to the contractor, accept, and withdraw;
   - confirm the final canonical state and explorer transaction links.

Every step will state the expected visible state and who must sign. No step will describe script-signed evidence as browser-wallet proof.

## Evidence and disclosure

A sanitized browser evidence document will record the public agreement ID, public addresses, transaction hashes, contract link, expected state after each action, and the final canonical reads from the completed Chrome/OKX run.

It will also disclose that `scopeseal-browser-001` is an abandoned test agreement with 2 GEN still locked until its recovery condition becomes available. Older diagnostic revisions already classified as `ABANDONED_TESTNET` remain disclosed. The completed `scopeseal-browser-002` agreement itself has zero locked value and zero remaining party credits. This distinction prevents a per-agreement success claim from becoming a false global-accounting claim.

## Verification

Implementation is acceptable only after all of the following produce fresh evidence:

1. SVG structural inspection confirms a square viewBox, approved color values, and no unsafe/external content.
2. PNG inspection confirms PNG format, 512 x 512 dimensions, opaque background, and successful visual rendering.
3. Frontend tests locate the brand link and image through accessible queries.
4. TypeScript checking and the production build pass.
5. The repository-wide `npm run check` passes, including GenVM lint, direct tests, deployment helpers, frontend tests, TypeScript, and production build.
6. Desktop and mobile browser inspection confirms the mark renders without clipping or layout shift and the console has no new warning/error caused by the change.
7. Public-repository hygiene checks pass before commit and push.
8. The deployed Vercel asset URLs return HTTP 200.
9. The Projects precheck is rerun with the repository and active contract explorer URLs; any blocker or warning is reported exactly.

## Non-goals

- No contract behavior, storage, deployment, or value flow changes.
- No product-wide redesign.
- No claim that Studio/Studionet is a Live-tier deployment.
- No Portal submission click without separate action-time authorization.
- No attempt to hide abandoned testnet accounting or call it recovered.
