import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const auth = await readFile(
  new URL('../pages/api/auth/[...nextauth].ts', import.meta.url),
  'utf8',
)

test('auth API fails closed before NextAuth when required server secrets are missing', () => {
  assert.doesNotMatch(auth, /export default NextAuth\(/)
  assert.match(auth, /AUTH_NOT_CONFIGURED/)
  assert.match(auth, /status\(503\)/)
  assert.match(auth, /Cache-Control/)
  assert.match(auth, /no-store/)
})

test('auth API validates both NextAuth and JWT secrets before constructing the handler', () => {
  assert.match(auth, /NEXT_AUTH_SECRET/)
  assert.match(auth, /JWT_SECRET/)
  assert.match(auth, /authHandler/)
})
