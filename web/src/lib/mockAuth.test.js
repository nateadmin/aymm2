import test from 'node:test';
import assert from 'node:assert/strict';
import { MOCK_DISCOVERY_PASSWORD } from './mockDiscoveryAccounts.js';
import {
  MOCK_LOGIN_EMAIL,
  MOCK_LOGIN_PASSWORD,
  isMockAuthEnabled,
  isMockToken,
  shouldUseMockCredentials,
  mockLogin,
  mockRegister,
  mockSaveProfile,
  loadMockSession,
  clearMockSession,
} from './mockAuth.js';

test('shouldUseMockCredentials requires explicit preview=1', () => {
  assert.equal(shouldUseMockCredentials(), false);
});

test('isMockAuthEnabled is off on live staging without preview=1', () => {
  assert.equal(isMockAuthEnabled('aymm.app'), false);
  assert.equal(isMockAuthEnabled('www.aymm.app'), false);
  assert.equal(isMockAuthEnabled('aymm2-web--5173--abc.local.webcontainer.io'), true);
  assert.equal(isMockAuthEnabled('nateadmin.github.io'), true);
  assert.equal(isMockAuthEnabled('demo.trycloudflare.com'), true);
});

test('mockRegister creates account without completed profile', () => {
  clearMockSession();
  const session = mockRegister('new.user@example.com', 'password1');
  assert.equal(isMockToken(session.token), true);
  assert.equal(session.profile, null);
});

test('mockLogin accepts demo credentials', () => {
  clearMockSession();
  const demo = mockLogin(MOCK_LOGIN_EMAIL, MOCK_LOGIN_PASSWORD);
  assert.equal(demo.user.email, MOCK_LOGIN_EMAIL);
  assert.equal(demo.profile.setup_complete, true);
});

test('mockLogin loads Phase 2 discovery persona profile', () => {
  clearMockSession();
  const session = mockLogin('daughter.demo@aymm.test', MOCK_DISCOVERY_PASSWORD);
  assert.equal(session.profile.identity_type, 'daughter');
  assert.equal(session.profile.display_name, 'Sarah');
});

test('mockLogin does not reuse another account profile after switching emails', () => {
  clearMockSession();
  mockLogin('daughter.demo@aymm.test', MOCK_DISCOVERY_PASSWORD);
  const mother = mockLogin('mother.demo@aymm.test', MOCK_DISCOVERY_PASSWORD);
  assert.equal(mother.user.email, 'mother.demo@aymm.test');
  assert.equal(mother.profile.display_name, 'Linda');
  assert.notEqual(mother.profile.user_email, 'daughter.demo@aymm.test');
});

test('mockSaveProfile stores onboarding progress', () => {
  clearMockSession();
  mockRegister('builder@example.com', 'password1');
  const profile = mockSaveProfile({
    display_name: 'Alex',
    identity_type: 'daughter',
    setup_complete: false,
  });
  assert.equal(profile.display_name, 'Alex');
  assert.equal(loadMockSession().profile.display_name, 'Alex');
});
