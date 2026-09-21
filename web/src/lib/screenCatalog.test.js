import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_LINKS,
  REVIEW_PROFILE_ROUTE,
  SCREEN_CAPTURE_VERSION,
  SCREEN_CATALOG,
  getScreenBySlug,
  screenCardPath,
  screenThumbnailUrl,
  withPreviewQuery,
} from './screenCatalog.js';

test('catalog no longer includes the extra onboarding frame', () => {
  assert.equal(SCREEN_CATALOG.length, 54);
  assert.equal(getScreenBySlug('onboarding-extra'), undefined);
  assert.equal(SCREEN_CATALOG.some((screen) => screen.title === 'Onboarding (extra)'), false);
});

test('demo and login stay in the framed phone mock', () => {
  assert.match(DEMO_LINKS.app, /mobile=1/);
  assert.match(DEMO_LINKS.app, /native=0/);
  assert.match(DEMO_LINKS.login, /mobile=1/);
  assert.match(DEMO_LINKS.login, /native=0/);
  assert.equal(REVIEW_PROFILE_ROUTE, '/Prototype/my-profile');
});

test('withPreviewQuery can keep the catalog on desktop and screens on mobile', () => {
  assert.equal(withPreviewQuery('/screens', { mobile: false }), '/screens?preview=1&mobile=0');
  assert.equal(withPreviewQuery('/Prototype/home'), '/Prototype/home?preview=1&mobile=1');
});

test('withPreviewQuery can force real-device layout for one link', () => {
  assert.equal(
    withPreviewQuery('/EmailLogin', { native: true }),
    '/EmailLogin?preview=1&mobile=1&native=1',
  );
  assert.equal(
    withPreviewQuery('/screens', { mobile: false, native: false }),
    '/screens?preview=1&mobile=0',
  );
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
    screenThumbnailUrl({ id: 99, slug: 'unused-frame', status: 'frame' }),
    '/design-frames/frame-99.png',
  );
});
