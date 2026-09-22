# MS-002 publication evidence

Observed on 2026-09-21 after commit `2f827f9fcf39b9c6bed15be58fec3482861b3400` was pushed to the existing public `main` history.

## GitHub and CI

- Public commit range: [`2488bf6..2f827f9`](https://github.com/duclucky/scopeseal-accord/compare/2488bf6d04c99f955ff433904eb1cd71ae5cdd45...2f827f9fcf39b9c6bed15be58fec3482861b3400)
- CI: [run 35560327654](https://github.com/duclucky/scopeseal-accord/actions/runs/35560327654), `completed / success`
- Pre-push root: the ScopeSeal child repository, not the knowledge workspace
- Tracked file count at push: 131
- Forbidden tracked path scan: none
- Targeted key/seed/private-material scan: none

## Vercel production

- Project: existing `scopeseal-accord`
- Deployment: `dpl_6wUV3SuSMvhSw3T5XLMcKtF9wkrS`, `Ready`
- Production alias: <https://scopeseal-accord.vercel.app>
- Deployment URL: <https://scopeseal-accord-1n59cjod6-duckys-projects-bc83c6a0.vercel.app>
- Public production configuration: active contract `0xAD2c9170ec79D5772167D92A8335dfd78E3660Bf`, canonical wallet RPC `https://studio-dev.genlayer.com/api`, Explorer `https://explorer-studio-dev.genlayer.com`, same-origin IC read path `/genlayer-rpc`

Fresh shell verification returned HTTP 200 for both HEAD and body, found `ScopeSeal Accord` and the React `root`, and received `0xf22d` from the same-origin RPC endpoint.

Fresh Chrome verification opened the production E5 closeout route and visibly displayed `CLOSED / RELEASE_RETENTION / 0 GEN`, plus `Studio Dev RPC ready`, from the active deployment. The wallet picker remained explicit and listed detected OKX providers. A new production provider connection was not asserted: the extension declined the attempted connection on that origin. Connected-account preflight, role gating, and disconnect are proven by the replacement local-browser run; the earlier real browser transaction lifecycle proves quote, approval, signing, finality, fee outcome, and canonical reload behavior.
