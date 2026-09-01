# Phase 3A frontend design evidence

Status: Phase 3A design and Phase 3B browser baseline complete. FE-PRESERVE is now locked for the product shell, route hierarchy, typography, color, spacing and primary interaction model.

## Locked product structure

- Seven functional routes: landing, create agreement, agreement detail, negotiation, activity, account and help.
- Persistent navigation and deep-linkable agreement pages.
- Sponsor, contractor and observer visibility boundaries.
- Exactly 2 GEN shown for funded demo agreements; no base-unit display.
- Real provider selection, transaction finality and canonical reload are required; no fixtures may be presented as canonical.

## Verified ui-ux-pro-max evidence

- Design-system query: `procurement agreement trustworthy calm spacious`.
- Verified top style: `Minimalism & Swiss Style`; the returned best-for category explicitly includes enterprise apps, professional tools and SaaS platforms.
- The generated `Lora / Raleway` typography match was rejected as off-topic because its result category targeted wellness. The single allowed narrower retry, `enterprise procurement authoritative --domain typography`, returned `Enterprise SaaS Mobile (Plus Jakarta Sans)` and `Corporate Trust`; the single-family Plus Jakarta Sans result is applied for legibility, loading simplicity and product consistency.
- The narrower `trust procurement accessible --domain color` query returned `Legal Services` as the relevant category. Applied tokens use authority navy `#1E3A8A`, trust gold `#B45309`, slate surfaces and white on action colors.
- Measured text contrast: primary 10.36:1, secondary 8.72:1, accent 5.02:1, muted 6.50:1 and destructive 4.83:1.
- Focused UX query: `wallet modal keyboard focus --domain ux`; top result requires a visible focus ring on every modal control and no focus removal without replacement. Sticky UI must not obscure focused controls.
- React stack query: `routing form performance --stack react`; applicable guidance uses semantic form submission and profiles before optimization. Long-list virtualization is deferred because no planned list exceeds 100 items.
- Persisted source of truth: `design-system/scopeseal-accord/MASTER.md`, updated only with the verified typography/color overrides above.

## Applied direction

- Minimal, Swiss-influenced enterprise layout with strong grids, large whitespace and one primary action per view.
- Plus Jakarta Sans type scale; 16px minimum body copy; 60-75 character desktop text measure.
- Navy for primary trust/action hierarchy, gold for the single CTA, and text/icon labels in addition to color for every status.
- 4/8px spacing rhythm, 44px minimum interaction height, visible focus, responsive 375/768/1024/1440 layouts and reduced-motion fallback.
- No decorative blur, parallax, layout-shifting hover, emoji icon, raw status dashboard or dense method list.

## Phase 3B implementation and browser evidence

- Frontend stack: React 19, React Router 7, TypeScript, Vite and Phosphor icons.
- Final component test run after the browser regression fix: `npm test` passed 9 files and 24 tests.
- Static checks: `npm run typecheck` completed with no diagnostic output.
- Production build: `npm run build` completed with 4,582 transformed modules and generated `dist/index.html`, CSS and JavaScript assets.
- Browser-local review ran through the Codex in-app Chromium browser against the Vite server exposed only on the local LAN interface.
- Responsive widths inspected: 375, 768 and 1,440 CSS pixels. Every one of the seven routes was opened at 768 px; measured `scrollWidth` never exceeded `innerWidth`.
- Routes verified: `/`, `/agreements/new`, `/agreements/demo-001`, `/agreements/demo-001/negotiate`, `/activity`, `/account` and `/help`.
- Wallet picker was opened on the 375 px layout. The first review found the fixed dialog inherited the header's backdrop-filter containing block (`top = -20.40625px`). A regression test was added, the dialog was portaled to `document.body`, and browser re-measurement showed `top = 251.78125px`, `left = 16px`, `right = 344px` within a 375 px viewport.
- Browser console review after all route and modal checks: 0 warnings and 0 errors. Vite connection and React development notices were informational only.
- The current UI intentionally reports absent wallets and absent deployed-contract configuration; it does not simulate accounts, canonical agreement state, balances, transaction hashes, finality or RPC success.

## FE-PRESERVE lock

Later phases may wire real contract data, wallet/network configuration, transaction state and canonical reload into the reserved adapters and state surfaces. They must not redesign the accepted information architecture or replace the established design system unless a verified implementation constraint makes a minimal change necessary and that deviation is documented first.
