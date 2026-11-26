import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldMergeBrowseDemoProfiles } from './browseDemoFiller.js';
import { isProductionBrandedHost } from './stagingPreview.js';

test('browse demo filler is off on production branded hosts', () => {
  assert.equal(isProductionBrandedHost('aymm.app'), true);
  assert.equal(shouldMergeBrowseDemoProfiles(), false);
});