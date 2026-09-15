# web3 — Modernization Roadmap

The repository contains a Next.js/TypeScript web3 experiment with components, hooks and a committed `.env` file. Credential and wallet/provider safety are the first concerns.

## 10 tasks

1. Inspect the committed `.env`, rotate any real provider/API credentials and replace committed configuration with a sanitized example.
2. Trace wallet/provider hooks and document exactly which chains, providers and wallet interactions are implemented.
3. Validate chain/network state and prevent actions when the connected network does not match the expected environment.
4. Add clear wallet disconnected, connection rejected, unsupported network, provider unavailable and transaction failure states.
5. Never request, store or log seed phrases/private keys; document the trust boundary explicitly.
6. Add tests for connection-state logic and any transaction/message preparation that exists.
7. Add CI for lint, type-check, tests and production build.
8. Upgrade wallet/provider and Next.js dependencies after establishing a reproducible baseline and reviewing breaking security changes.
9. Add user-facing transaction context: network, address truncation, pending/confirmed/failed status and links only where actually implemented.
10. Position the project as a verified wallet/web3 integration experiment, not as a production financial or custody platform unless code and operational evidence support that claim.

## Portfolio value

Useful as evidence of integrating unfamiliar APIs/protocols if the security boundaries and original implementation are made explicit.