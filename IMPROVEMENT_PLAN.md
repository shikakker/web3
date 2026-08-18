# Completion plan

1. Treat the tracked `.env` as a P0 security/provenance item. Identify each value, determine whether it is a live OAuth/web3/provider secret, rotate exposed credentials if needed, remove secrets from tracked files and retain only safe examples.
2. Define the project from code rather than its name: it contains NextAuth, a protected page and a small snippet/hook set. Document the actual authentication/provider experiment; do not claim blockchain transactions, wallets, smart contracts or on-chain storage unless code proves them.
3. Establish starter/example provenance and diff against upstream if applicable. Separate generated/tutorial authentication code from authored modifications before portfolio use.
4. Audit `pages/api/auth/[...nextauth].ts`: provider scopes, callback/redirect allowlists, session/JWT strategy, secret configuration and error handling. Production must use a strong server-only NextAuth secret and HTTPS-safe cookies.
5. Review `useProtected.tsx` and `pages/protected.tsx` so authorization is enforced server-side for protected data/actions; client redirects/hooks are UX, not a security boundary.
6. If a wallet/provider identity is actually used, bind authentication to a nonce-based signed challenge with domain/chain/expiry and replay protection; never accept an arbitrary wallet address from the client as proof of ownership.
7. Add explicit signed-in/loading/error/expired-session states and safe sign-out behavior. Do not expose raw OAuth tokens, provider secrets or sensitive session payloads in the UI/snippet output.
8. Pin supported Node/Next/NextAuth versions and upgrade security-sensitive auth dependencies carefully. Remove unused web3 libraries/providers if the repository is only an auth demo so its dependency surface matches its claims.
9. Add tests for protected-route behavior, auth callbacks/session mapping and invalid/expired state using mocked providers; CI runs lint/typecheck/tests/build without live OAuth/provider credentials.
10. Rewrite README as a verified authentication/web3-identity experiment: exact provider(s), auth flow, protected surface, env setup, security assumptions and explicit non-features. Rename/reposition if 'web3' materially overstates the implemented scope.
