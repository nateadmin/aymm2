import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { appForToken, defaultAppFromRepo, scrubLogText, secretsMatch } from './deploy-core.js';
import { createDispatch } from './deploy-http.js';
import { createFileStore } from './deploy-store.js';

const AYMM = 'a'.repeat(48);
const PU = 'b'.repeat(48);
const secrets = { aymm: AYMM, 'philosophy-untangled': PU };

function dispatchFor(store, startDeploy = () => {}) {
  return createDispatch({
    secrets,
    now: () => Date.parse('2026-09-29T14:00:00Z'),
    store,
    startDeploy,
  });
}

test('secretsMatch is constant-length and rejects a wrong token', () => {
  assert.equal(secretsMatch(AYMM, AYMM), true);
  assert.equal(secretsMatch(AYMM, 'wrong'), false);
  assert.equal(secretsMatch(AYMM, ''), false);
});

test('appForToken maps each secret to one app', () => {
  assert.equal(appForToken(secrets, AYMM), 'aymm');
  assert.equal(appForToken(secrets, PU), 'philosophy-untangled');
  assert.equal(appForToken(secrets, 'nope'), null);
});

test('scrubLogText redacts secret-bearing lines', () => {
  const text = [
    'Pulled abc123',
    'DEPLOY_SECRET=please-hide',
    'API KEY leaked',
    'Bearer TOKEN xyz',
    'POSTGRES_PASSWORD=nope',
    'setup aymm',
  ].join('\n');
  const scrubbed = scrubLogText(text);
  assert.match(scrubbed, /Pulled abc123/);
  assert.match(scrubbed, /setup aymm/);
  assert.equal(scrubbed.split('\n').filter((line) => line === '[redacted]').length, 4);
  assert.doesNotMatch(scrubbed, /please-hide|leaked|xyz|nope/);
});

test('HTTP deploy rejects missing or wrong bearer token', async () => {
  const store = createFileStore(fs.mkdtempSync(path.join(os.tmpdir(), 'contabo-deploy-')));
  const dispatch = dispatchFor(store);
  const missing = await dispatch({
    method: 'POST',
    url: '/api/internal/deploy',
    headers: {},
    body: { app: 'aymm' },
  });
  assert.equal(missing.status, 401);
  const wrong = await dispatch({
    method: 'POST',
    url: '/api/internal/deploy',
    headers: { authorization: 'Bearer nope' },
    body: { app: 'aymm' },
  });
  assert.equal(wrong.status, 401);
});

test('wrong-app token is rejected with 403', async () => {
  const store = createFileStore(fs.mkdtempSync(path.join(os.tmpdir(), 'contabo-deploy-')));
  const started = [];
  const dispatch = dispatchFor(store, (job) => started.push(job));
  const result = await dispatch({
    method: 'POST',
    url: '/api/internal/deploy',
    headers: { authorization: `Bearer ${PU}` },
    body: { app: 'aymm' },
  });
  assert.equal(result.status, 403);
  assert.equal(result.body.allowed, 'philosophy-untangled');
  assert.equal(started.length, 0);
});

test('second start while a deploy is running returns 409', async () => {
  const store = createFileStore(fs.mkdtempSync(path.join(os.tmpdir(), 'contabo-deploy-')));
  const started = [];
  const dispatch = dispatchFor(store, (job) => started.push(job));
  const headers = { authorization: `Bearer ${AYMM}` };
  const first = await dispatch({
    method: 'POST',
    url: '/api/internal/deploy',
    headers,
    body: { app: 'aymm' },
  });
  assert.equal(first.status, 200);
  assert.equal(started.length, 1);
  const second = await dispatch({
    method: 'POST',
    url: '/api/internal/deploy',
    headers,
    body: { app: 'aymm' },
  });
  assert.equal(second.status, 409);
  assert.equal(second.body.id, first.body.id);
  assert.equal(second.body.status, 'running');
});

test('defaultAppFromRepo reads the git remote', () => {
  assert.equal(defaultAppFromRepo({ remote: 'https://github.com/nateadmin/aymm2.git' }), 'aymm');
  assert.equal(
    defaultAppFromRepo({ remote: 'https://github.com/nateadmin/philosophy-untangled.git' }),
    'philosophy-untangled',
  );
});
