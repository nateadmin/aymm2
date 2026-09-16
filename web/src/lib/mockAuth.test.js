import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_LOGIN_EMAIL,
  MOCK_LOGIN_PASSWORD,
  isMockAuthEnabled,
  isMockToken,
  mockLogin,
} from './mockAuth.js';

test('isMockAuthEnabled is off on live staging hosts', () => {
  assert.equal(isMockAuthEnabled('aymm.app'), false);
  assert.equal(isMockAuthEnabled('aymm2-web--5173--abc.local.webcontainer.io'), true);
});

test('mockLogin accepts demo credentials and any valid email with 8+ char password', () => {
  const demo = mockLogin(MOCK_LOGIN_EMAIL, MOCK_LOGIN_PASSWORD);
  assert.equal(isMockToken(demo.token), true);
  assert.equal(demo.user.email, MOCK_LOGIN_EMAIL);
  assert.equal(demo.profile.setup_complete, true);

  const any = mockLogin('reviewer@example.com', 'password1');
  assert.equal(any.user.email, 'reviewer@example.com');
});

test('mockLogin rejects short passwords', () => {
  assert.throws(
    () => mockLogin('reviewer@example.com', 'short'),
    (error) => error.payload?.error === 'invalid_credentials',
  );
});
