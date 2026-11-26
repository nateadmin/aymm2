import test from 'node:test';
import assert from 'node:assert/strict';
import { isPhase2LiveDemoEmail } from './phase2LiveDemoAccounts.js';

test('isPhase2LiveDemoEmail recognizes production demo personas', () => {
  assert.equal(isPhase2LiveDemoEmail('phase2.micah+demo@aymm.app'), true);
  assert.equal(isPhase2LiveDemoEmail(' PHASE2.LINDA+demo@aymm.app '), true);
  assert.equal(isPhase2LiveDemoEmail('daughter.demo@aymm.test'), false);
  assert.equal(isPhase2LiveDemoEmail('design@aymm.app'), false);
});