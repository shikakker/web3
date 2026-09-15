import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const statusRoute = await readFile(
  new URL('../pages/api/auth-status.ts', import.meta.url),
  'utf8',
).catch(() => '')
const home = await readFile(new URL('../pages/index.tsx', import.meta.url), 'utf8')

test('auth availability endpoint exposes only configured state and never secret details', () => {
  assert.match(statusRoute, /isAuthConfigured/)
  assert.match(statusRoute, /configured/)
  assert.match(statusRoute, /AUTH_NOT_CONFIGURED/)
  assert.match(statusRoute, /status\(503\)/)
  assert.match(statusRoute, /Cache-Control/)
  assert.match(statusRoute, /no-store/)
  assert.doesNotMatch(statusRoute, /NEXT_AUTH_SECRET/)
  assert.doesNotMatch(statusRoute, /JWT_SECRET/)
})

test('wallet login checks auth availability before requesting the NextAuth CSRF token', () => {
  const preflight = home.indexOf("fetch('/api/auth-status'")
  const csrf = home.indexOf('getCsrfToken()')
  assert.ok(preflight >= 0, 'expected auth availability preflight')
  assert.ok(csrf >= 0, 'expected CSRF challenge request')
  assert.ok(preflight < csrf, 'auth availability must be checked before NextAuth CSRF')
  assert.match(home, /Wallet login is temporarily unavailable/)
})

test('login copy does not claim durable one-time nonce semantics', () => {
  assert.doesNotMatch(home, /one-time login message/i)
  assert.match(home, /login challenge/i)
})
