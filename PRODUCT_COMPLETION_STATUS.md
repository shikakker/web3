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
| T10 | BLOCKED | Verify exact-head Vercel preview and real browser wallet-sign-in/protected-page flow |

## Improvements

| ID | Status | Improvement |
| --- | --- | --- |
| I01 | DONE | Signed challenge helper centralizes the human-readable wallet login message |
| I02 | DONE | Server rejects missing nonce/signature, altered message and mismatched recovered address |
| I03 | DONE | Client requests the NextAuth CSRF token before signing |
| I04 | DONE | Wallet/auth tests guard against regression to address-only authentication |
| I05 | DONE | Runtime/dependency modernization is covered by regression contracts |
| I06 | DONE | Internal navigation uses Next Link and current React lint-safe hook patterns |
| I07 | DONE | Production dependency audit blocks high/critical advisories |
| I08 | DONE | README states real product scope, environment contract and verification commands |
| I09 | PARTIAL | Durable one-time server nonce/replay storage is intentionally not implemented in this reference app |
| I10 | PARTIAL | Browser/mobile accessibility and wallet-provider compatibility require exact hosted smoke |

## Product features

| ID | Status | Feature |
| --- | --- | --- |
| F01 | DONE | Injected-wallet connection flow |
| F02 | DONE | Signed wallet ownership proof |
| F03 | DONE | NextAuth JWT session creation after signature verification |
| F04 | DONE | Authenticated wallet address exposed in session state |
| F05 | DONE | Protected page/session demonstration |
| F06 | DONE | User-visible wallet/signature/auth failure handling |
| F07 | DEFERRED WITH REASON | Chain/role authorization is outside this authentication-reference scope |
| F08 | DEFERRED WITH REASON | Durable one-time nonce store belongs in a production backend, not a stateless example |
| F09 | DEFERRED WITH REASON | Transaction signing/custody is intentionally excluded |
| F10 | BLOCKED | Production promotion requires exact-head preview/browser verification and explicit approval |

## Verification evidence

Before the current head, GitHub Quality run `34980007489` passed tests, typecheck, lint, build and the production audit. The last visible Vercel failure was on older commit `2b0faf95133625fae0e6ae0300a4984d95fb46b9`; its build log failed because `tailwind.config.js` still required removed package `@vercel/examples-ui/tailwind`. The branch subsequently fixed that root cause (`fix: remove legacy Vercel Tailwind preset dependency`), and the current Tailwind config no longer imports the preset.

The repository had no committed npm/yarn/pnpm lockfile, so previously green CI still resolved a mutable dependency graph with `npm install`. Guarded release run `35015564162` then completed GREEN: deterministic lockfile generation PASS → `npm ci` PASS → tests PASS → typecheck PASS → lint PASS → production build PASS → production dependency audit PASS → verified `package-lock.json` commit PASS (`d25f130ab919d37bcde255952017919ed3d9589e`). Permanent Quality CI was then switched to `npm ci`.

Exact-head Vercel/browser verification remains required before release claims. The authentication challenge uses the NextAuth CSRF token and proves wallet ownership, but this reference implementation does not claim durable one-time nonce/replay semantics suitable for a high-value production dApp.

No merge, production promotion, wallet transaction, credential mutation, billing action or user-data mutation has been performed.

Status: **PARTIAL** — deterministic code/build/security verification is in place; exact hosted wallet/browser validation and production-grade replay storage remain outside the verified boundary.
