import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAppRoute, resolveLettersRoute } from './appRoutes.js';

test('resolveAppRoute returns live paths for real sessions', () => {
  const session = {
    user: { email: 'real@test.com' },
    profile: { setup_complete: true },
    token: 'real-token',
  };
  assert.equal(resolveAppRoute('home', session), '/Home');
  assert.equal(resolveLettersRoute(session), '/Messages');
});

test('resolveAppRoute returns fixture paths for design demo', () => {
  const session = {
    user: { email: 'design@aymm.app' },
    profile: { setup_complete: true },
  };
  assert.equal(resolveAppRoute('home', session), '/Prototype/home');
  assert.equal(resolveAppRoute('tables', session), '/Community/family-table-listing');
});