import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { pullRepo } from './deploy-run.js';

function repoDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-run-'));
  fs.mkdirSync(path.join(dir, '.git'));
  return dir;
}

test('pullRepo skips directories that are not git checkouts', () => {
  const calls = [];
  const ok = pullRepo(os.tmpdir(), { run: (...args) => { calls.push(args); return { status: 0 }; } });
  assert.equal(ok, false);
  assert.equal(calls.length, 0);
});

test('pullRepo fetches, checks out, and fast-forwards as the deploy user', () => {
  const dir = repoDir();
  const calls = [];
  const lines = [];
  const ok = pullRepo(dir, { write: (l) => lines.push(l), run: (cmd, args) => { calls.push([cmd, ...args]); return { status: 0 }; } });
  assert.equal(ok, true);
  assert.equal(calls.length, 3);
  assert.deepEqual(calls[0].slice(0, 7), ['sudo', '-H', '-u', 'deploy', 'git', '-C', dir]);
  assert.deepEqual(calls.map((c) => c[7]), ['fetch', 'checkout', 'pull']);
  assert.deepEqual(lines, ['pre-pull main ok']);
});

test('pullRepo reports a failing step without throwing and scrubs the output', () => {
  const dir = repoDir();
  const lines = [];
  const ok = pullRepo(dir, { write: (l) => lines.push(l), run: () => ({ status: 128, stderr: 'fatal: TOKEN rejected\n' }) });
  assert.equal(ok, false);
  assert.equal(lines.length, 1);
  assert.match(lines[0], /^pre-pull fetch failed: /);
  assert.ok(!lines[0].includes('TOKEN rejected'));
});
