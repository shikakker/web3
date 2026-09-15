# Web3 Sessions

A maintained Next.js reference for signing in with an Ethereum wallet and creating a server-verified NextAuth session.

This repository started from Vercel's historical Web3 Sessions example. The completion branch keeps the example scope intentionally small while hardening the authentication and release boundaries instead of presenting it as a full dApp.

## What it demonstrates

- connect an injected Ethereum wallet such as MetaMask;
- request the current NextAuth CSRF token and use it as the login challenge nonce;
- sign a deterministic human-readable message with the connected wallet;
- verify the signature and normalized wallet address on the server before issuing a session;
- expose the authenticated wallet address through the NextAuth session;
- protect a `/protected` page with session state;
- build and verify the example on a deterministic Node 22 / npm dependency graph.

The login flow does **not** submit a wallet address as sufficient proof of identity. A valid signature over the expected challenge is required.

## Security boundary

This is a reference implementation, not a wallet custody or transaction product. It never asks for a private key and signing the login message does not create an on-chain transaction.

The current challenge is bound to the NextAuth CSRF token. It is appropriate for demonstrating verified wallet ownership, but the repository does not implement a durable server-side one-time nonce store, chain authorization policy, account recovery, transaction authorization, or production fraud controls. Add those controls before using this pattern as the authentication layer for a high-value production dApp.

## Stack

- Next.js 16
- React 19
- TypeScript
- NextAuth.js
- ethers
- Tailwind CSS
- Node.js 22

## Environment

Copy `.env.example` to `.env.local` and provide environment-specific secrets:

```bash
cp .env.example .env.local
```

Required server variables:

- `NEXT_AUTH_SECRET` — high-entropy NextAuth secret;
- `JWT_SECRET` — signing secret used by the current JWT configuration;
- `NEXTAUTH_URL` — canonical application origin in deployed environments.

Do not commit real values.

## Development

```bash
npm ci
npm run dev
```

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
```

CI runs the same deterministic install and verification gates on Node 22.

## Deployment

The repository is connected to Vercel, but the completion branch should only be treated as release-ready after an exact-head preview is available and the wallet sign-in/protected-page flow is exercised against the intended deployment origin. Production promotion is intentionally separate from code verification.

## Provenance

Derived from Vercel's Web3 Sessions example. The current branch adds runtime modernization, signed-wallet proof instead of address-only credentials, failure-state handling, regression tests, dependency/security checks, deterministic installs and updated release documentation.
