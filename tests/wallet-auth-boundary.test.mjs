import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const auth = await readFile(
  new URL('../pages/api/auth/[...nextauth].ts', import.meta.url),
  'utf8',
)
const home = await readFile(new URL('../pages/index.tsx', import.meta.url), 'utf8')

test('credentials auth requires a signed wallet proof instead of address-only login', () => {
  assert.match(auth, /signature/)
  assert.match(auth, /message/)
  assert.match(auth, /nonce/)
  assert.match(auth, /\bverifyMessage\(/)
  assert.match(auth, /buildWalletLoginMessage/)
})

test('signed wallet proof is bound to the NextAuth CSRF token', () => {
  assert.match(auth, /csrfToken/)
  assert.match(auth, /credentials\?\.nonce/)
  assert.match(auth, /req\.body/)
})

test('client requests a CSRF nonce and signs the login message with the connected wallet', () => {
  assert.match(home, /getCsrfToken/)
  assert.match(home, /buildWalletLoginMessage/)
  assert.match(home, /signMessage/)
  assert.match(home, /signature/)
  assert.match(home, /signIn\(['"]credentials['"]/)
})

test('client no longer submits address as the only wallet credential', () => {
  assert.doesNotMatch(
    home,
    /signIn\(['"]credentials['"],\s*\{\s*address:\s*[^,}]+,\s*callbackUrl\s*\}\)/,
  )
})
