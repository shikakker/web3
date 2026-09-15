import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
)
const app = await readFile(new URL('../pages/_app.tsx', import.meta.url), 'utf8')
const home = await readFile(new URL('../pages/index.tsx', import.meta.url), 'utf8')
const protectedHook = await readFile(
  new URL('../hooks/useProtected.tsx', import.meta.url),
  'utf8',
)
const nextConfig = await readFile(
  new URL('../next.config.js', import.meta.url),
  'utf8',
)

test('runtime uses the maintained Next/React/Node boundary', () => {
  assert.equal(packageJson.dependencies.next, '15.5.25')
  assert.equal(packageJson.dependencies.react, '18.3.1')
  assert.equal(packageJson.dependencies['react-dom'], '18.3.1')
  assert.equal(packageJson.engines.node, '22.x')
})

test('legacy Vercel examples UI is removed from the production dependency graph', () => {
  assert.equal(packageJson.dependencies['@vercel/examples-ui'], undefined)
  assert.doesNotMatch(app, /@vercel\/examples-ui/)
  assert.doesNotMatch(nextConfig, /@vercel\/examples-ui/)
  assert.match(app, /styles\/globals\.css/)
})

test('legacy React-17 wagmi layer is removed from the wallet auth flow', () => {
  assert.equal(packageJson.dependencies.wagmi, undefined)
  assert.doesNotMatch(app, /wagmi/)
  assert.doesNotMatch(home, /from ['"]wagmi['"]/)
  assert.doesNotMatch(protectedHook, /from ['"]wagmi['"]/)
  assert.match(home, /eth_requestAccounts/)
  assert.match(protectedHook, /accountsChanged/)
})
