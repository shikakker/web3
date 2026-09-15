import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('Next 16 lint stack stays on ESLint 9 until plugin stack supports ESLint 10', () => {
  assert.match(pkg.devDependencies.eslint, /^9\./);
  assert.equal(pkg.devDependencies['eslint-config-next'], pkg.dependencies.next);
});
