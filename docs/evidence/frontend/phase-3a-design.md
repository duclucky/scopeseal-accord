# Phase 3A frontend design evidence

Status: product blueprint and verified `ui-ux-pro-max` design direction recorded; frontend implementation is pending.

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

## Pending implementation evidence

- Test/typecheck/build output and 375/768/1440 responsive review.
