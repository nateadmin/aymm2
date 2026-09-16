import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const clientSource = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'client.js'),
  'utf8',
);

test('api client exposes put helper used by profile saves', () => {
  assert.match(clientSource, /put:\s*\(path,\s*body\)\s*=>\s*request\(path,\s*\{\s*method:\s*'PUT'/);
});
