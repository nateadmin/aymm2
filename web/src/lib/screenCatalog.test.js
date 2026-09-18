import test from 'node:test';
import assert from 'node:assert/strict';
import { screenCardPath, withPreviewQuery } from './screenCatalog.js';

test('withPreviewQuery can keep the catalog on desktop and screens on mobile', () => {
  assert.equal(withPreviewQuery('/screens', { mobile: false }), '/screens?preview=1&mobile=0');
  assert.equal(withPreviewQuery('/Prototype/home'), '/Prototype/home?preview=1&mobile=1');
});

test('screenCardPath opens one catalog card at a time', () => {
  assert.equal(screenCardPath({ slug: 'my-profile' }), '/screens/my-profile');
});
