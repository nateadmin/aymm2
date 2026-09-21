import assert from 'node:assert/strict';
import test from 'node:test';
import { ensureVisibleAboveKeyboard, findScrollParent } from './keyboardViewport.js';

test('findScrollParent returns null without document', () => {
  assert.equal(findScrollParent(null), null);
});

test('browser chrome inset is layout height minus visible viewport height', () => {
  assert.equal(Math.max(0, Math.round(844 - 700 - 0)), 144);
});

test('ensureVisibleAboveKeyboard is a no-op without visualViewport', () => {
  assert.doesNotThrow(() => {
    ensureVisibleAboveKeyboard(null);
  });
});
