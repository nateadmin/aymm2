import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCREEN_CAPTURE_VERSION,
  screenCardPath,
  screenThumbnailUrl,
  withPreviewQuery,
} from './screenCatalog.js';

test('withPreviewQuery can keep the catalog on desktop and screens on mobile', () => {
  assert.equal(withPreviewQuery('/screens', { mobile: false }), '/screens?preview=1&mobile=0');
  assert.equal(withPreviewQuery('/Prototype/home'), '/Prototype/home?preview=1&mobile=1');
});

test('screenCardPath opens one catalog card at a time', () => {
  assert.equal(screenCardPath({ slug: 'my-profile' }), '/screens/my-profile');
});

test('screenThumbnailUrl uses live captures for built screens', () => {
  assert.match(
    screenThumbnailUrl({ id: 7, slug: 'otp', status: 'live' }),
    /screen-captures\/frame-07\.png\?v=/,
  );
  assert.match(screenThumbnailUrl({ id: 7, slug: 'otp', status: 'live' }), new RegExp(SCREEN_CAPTURE_VERSION));
});

test('screenThumbnailUrl keeps Figma frames for design-only entries', () => {
  assert.equal(
    screenThumbnailUrl({ id: 19, slug: 'onboarding-extra', status: 'frame' }),
    '/design-frames/frame-19.png',
  );
});
