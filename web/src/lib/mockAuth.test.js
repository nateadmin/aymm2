import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_LOGIN_EMAIL,
  MOCK_LOGIN_PASSWORD,
  isMockAuthEnabled,
  isMockToken,
  mockLogin,
  mockRegister,
  mockSaveProfile,
  loadMockSession,
  clearMockSession,
} from './mockAuth.js';

test('isMockAuthEnabled is off on live staging hosts', () => {
  assert.equal(isMockAuthEnabled('aymm.app'), false);
  assert.equal(isMockAuthEnabled('aymm2-web--5173--abc.local.webcontainer.io'), true);
  assert.equal(isMockAuthEnabled('nateadmin.github.io'), true);
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
