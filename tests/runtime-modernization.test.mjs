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
const eslintConfig = await readFile(
  new URL('../eslint.config.mjs', import.meta.url),
  'utf8',
).catch(() => '')

test('runtime uses the current maintained Next/React/Node boundary', () => {
  assert.equal(packageJson.dependencies.next, '16.3.5')
  assert.equal(packageJson.dependencies.react, '19.3.0')
  assert.equal(packageJson.dependencies['react-dom'], '19.3.0')
  assert.equal(packageJson.engines.node, '22.x')
})

test('wallet cryptography uses maintained ethers 6', () => {
  assert.equal(packageJson.dependencies.ethers, '6.17.0')
})

test('Next 16 linting uses ESLint flat config instead of removed next lint', () => {
  assert.equal(packageJson.scripts.lint, 'eslint . --max-warnings=0')
  assert.equal(packageJson.devDependencies['eslint-config-next'], '16.3.5')
  assert.match(eslintConfig, /eslint-config-next\/core-web-vitals/)
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
