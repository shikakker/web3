# Product Completion Status — web3

Canonical branch: `portfolio-improvements-2026-08`
Canonical PR: `#1`

Product boundary: maintained educational/reference implementation of Ethereum wallet-signature authentication with NextAuth. It is not a wallet, custody product, exchange, transaction signer or production authorization backend.

## Core tasks

| ID | Status | Task |
| --- | --- | --- |
| T01 | DONE | Remove committed/example credential values and keep `.env.example` secret-free |
| T02 | DONE | Replace address-only credentials with server-verified signed wallet proof |
| T03 | DONE | Bind the signed login challenge to the NextAuth CSRF nonce |
| T04 | DONE | Normalize and verify recovered Ethereum addresses server-side |
| T05 | DONE | Add recoverable wallet/provider/signing/authentication UI failures |
| T06 | DONE | Upgrade to the maintained Next.js 16 / React 19 / Node 22 runtime boundary |
| T07 | DONE | Remove inherited Vercel Tailwind preset dependency that broke hosted builds |
| T08 | DONE | Add tests, typecheck, lint, production build and production-audit CI gates |
| T09 | DONE | Generate and verify a deterministic npm lockfile; permanent CI uses `npm ci` |
| T10 | BLOCKED | Complete signed-wallet login on Vercel after required auth secrets are provisioned |

## Improvements

| ID | Status | Improvement |
| --- | --- | --- |
| I01 | DONE | Signed challenge helper centralizes the human-readable wallet login message |
| I02 | DONE | Server rejects missing nonce/signature, altered message and mismatched recovered address |
| I03 | DONE | Client checks server auth availability before requesting the NextAuth CSRF challenge |
| I04 | DONE | Wallet/auth tests guard against regression to address-only authentication |
| I05 | DONE | Runtime/dependency modernization is covered by regression contracts |
| I06 | DONE | Internal navigation uses Next Link and current React lint-safe hook patterns |
| I07 | DONE | Production dependency audit blocks high/critical advisories |
| I08 | DONE | README states real product scope, environment contract and verification commands |
| I09 | PARTIAL | Durable one-time server nonce/replay storage is intentionally not implemented in this reference app |
| I10 | PARTIAL | Full viewport/keyboard/mobile browser QA and wallet-provider compatibility require interactive browser access and configured auth |

## Product features

| ID | Status | Feature |
| --- | --- | --- |
| F01 | DONE | Injected-wallet connection flow |
| F02 | DONE | Signed wallet ownership proof |
| F03 | DONE | NextAuth JWT session creation after signature verification |
| F04 | DONE | Authenticated wallet address exposed in session state |
| F05 | DONE | Protected page/session demonstration |
| F06 | DONE | User-visible wallet/signature/auth failure handling and safe auth-availability preflight |
| F07 | DEFERRED WITH REASON | Chain/role authorization is outside this authentication-reference scope |
| F08 | DEFERRED WITH REASON | Durable one-time nonce store belongs in a production backend, not a stateless example |
| F09 | DEFERRED WITH REASON | Transaction signing/custody is intentionally excluded |
| F10 | BLOCKED | Production promotion requires configured auth, interactive browser verification and explicit approval |

## Verification evidence

The historical Vercel failure on commit `2b0faf95133625fae0e6ae0300a4984d95fb46b9` was caused by `tailwind.config.js` requiring removed package `@vercel/examples-ui/tailwind`. The branch removed that preset dependency and current Vercel previews now build successfully.

The repository originally had no committed lockfile. Guarded release run `35015564162` completed GREEN: deterministic lockfile generation PASS → `npm ci` PASS → tests PASS → typecheck PASS → lint PASS → production build PASS → production dependency audit PASS → verified `package-lock.json` commit PASS (`d25f130ab919d37bcde255952017919ed3d9589e`). Permanent Quality CI now uses `npm ci`; the one-shot bootstrap workflow has been retired.

Exact commit `de522f0cfd3e5cd44e53122732895822a8030c53` passed GitHub Quality run `35016012154` end-to-end: deterministic install, tests, typecheck, lint, build and production audit. Its Vercel preview `dpl_HpLYMg4GMKADNvyZWF1JkT2Q3GJ9` was READY. Runtime smoke reproduced the missing-secret environment condition and verified that `/api/auth/csrf` now returns controlled `503 AUTH_NOT_CONFIGURED` with `Cache-Control: private, no-store` instead of NextAuth's previous 500 `NO_SECRET` failure.

The follow-up UX slice added a safe `/api/auth-status` endpoint, client preflight before `getCsrfToken()`, and removed inaccurate “one-time” UI wording. Commit `9fbc294490181b17a5cfa04386ef143f9ff9b5a9` passed Quality run `35016293219`: `npm ci` PASS → tests PASS → typecheck PASS → lint PASS → production build PASS; production audit PASS. Exact Vercel preview `dpl_9UoFoPLvKBzfXpTvfgufRPhL7aST` is READY. `/api/auth-status` returns `503 { configured:false, code:"AUTH_NOT_CONFIGURED" }` without identifying missing secrets; `/api/auth/csrf` returns the same controlled failure; exact-deployment runtime warning/error logs were empty after these probes.

BLOCKED ONLY BY: valid `NEXT_AUTH_SECRET`, `JWT_SECRET`, and intended `NEXTAUTH_URL` in the Vercel environment for functional signed-wallet login. After those values exist, the remaining release check is an interactive MetaMask sign-in → protected page browser flow and responsive/keyboard QA.

The authentication challenge proves wallet ownership but does not claim durable one-time nonce/replay semantics suitable for high-value production authorization.

No merge, production promotion, wallet transaction, credential mutation, billing action or user-data mutation has been performed.

Status: **PARTIAL** — code/build/security/preview and missing-config recovery are verified; functional login is blocked only by external auth configuration, with interactive browser QA still required afterward.
