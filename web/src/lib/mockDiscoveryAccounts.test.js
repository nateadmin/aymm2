import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_DISCOVERY_PASSWORD,
  getMockDiscoveryAccount,
  listMockDiscoveryBrowseProfiles,
} from './mockDiscoveryAccounts.js';

test('discovery mock accounts share password and expose browse list', () => {
  const daughter = getMockDiscoveryAccount('daughter.demo@aymm.test');
  assert.ok(daughter?.profile?.setup_complete);
  assert.equal(MOCK_DISCOVERY_PASSWORD, 'DemoPass123');
  const browse = listMockDiscoveryBrowseProfiles('daughter.demo@aymm.test');
  assert.ok(browse.length >= 3);
  assert.equal(browse.some((p) => p.user_email === 'daughter.demo@aymm.test'), false);
});