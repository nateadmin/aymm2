import assert from 'node:assert/strict';
import test from 'node:test';
import { ensureVisibleAboveKeyboard, findScrollParent } from './keyboardViewport.js';

test('findScrollParent returns null without document', () => {
  assert.equal(findScrollParent(null), null);
});

test('ensureVisibleAboveKeyboard is a no-op without visualViewport', () => {
  assert.doesNotThrow(() => {
    ensureVisibleAboveKeyboard(null);
  });
});
