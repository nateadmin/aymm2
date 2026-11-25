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

test('resolveAppRoute sends family accounts to FamilyTables instead of Home', () => {
  const session = {
    user: { email: 'phase2.martinez+demo@aymm.app' },
    profile: { setup_complete: true, identity_type: 'family' },
    token: 'real-token',
  };
  assert.equal(resolveAppRoute('home', session), '/FamilyTables');
});

test('resolveAppRoute returns fixture paths for design demo', () => {
  const session = {
    user: { email: 'design@aymm.app' },
    profile: { setup_complete: true },
  };
  assert.equal(resolveAppRoute('home', session), '/Prototype/home');
  assert.equal(resolveAppRoute('tables', session), '/Community/family-table-listing');
});