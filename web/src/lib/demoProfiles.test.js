import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeBrowseProfiles } from './demoProfiles.js';

test('mergeBrowseProfiles skips filler when real matches exist', () => {
  const matched = [{ id: 'real-1', user_email: 'a@b.com', identity_type: 'mother', is_demo: false }];
  const merged = mergeBrowseProfiles(matched, 'daughter');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, 'real-1');
});

test('mergeBrowseProfiles adds filler when browse is empty', () => {
  const merged = mergeBrowseProfiles([], 'daughter');
  assert.ok(merged.length > 0);
  assert.equal(merged.every((p) => p.is_demo), true);
});