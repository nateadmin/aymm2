import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLiveTestPath,
  buildLiveTestUrl,
  DEMO_LINKS,
  REVIEW_PROFILE_ROUTE,
  SCREEN_CAPTURE_VERSION,
  SCREEN_CATALOG,
  getScreenBySlug,
  screenCardPath,
  screensForPhase,
  screenThumbnailUrl,
  withPreviewQuery,
} from './screenCatalog.js';

test('catalog no longer includes the extra onboarding frame', () => {
  assert.equal(SCREEN_CATALOG.length, 54);
  assert.equal(getScreenBySlug('onboarding-extra'), undefined);
  assert.equal(SCREEN_CATALOG.some((screen) => screen.title === 'Onboarding (extra)'), false);
  assert.equal(getScreenBySlug('bio')?.route, '/ProfileSetup/bio');
});

test('demo links use stable branded paths on aymm.app', () => {
  assert.equal(DEMO_LINKS.catalog, '/aymm-catalog');
  assert.equal(DEMO_LINKS.app, '/aymm-demo');
  assert.equal(DEMO_LINKS.login, '/aymm-login');
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

test('buildLiveTestPath pins preview=0 and mobile=1', () => {
  assert.equal(buildLiveTestPath('/EmailLogin'), '/EmailLogin?preview=0&mobile=1');
});

test('buildLiveTestPath adds fixture=1 for Phase 4 prototype routes', () => {
  assert.equal(
    buildLiveTestPath('/Prototype/home'),
    '/Prototype/home?preview=0&mobile=1&fixture=1',
  );
});

test('buildLiveTestUrl joins origin and path', () => {
  assert.equal(
    buildLiveTestUrl('/Welcome', 'https://example.test'),
    'https://example.test/Welcome?preview=0&mobile=1',
  );
});

test('screensForPhase returns Phase 1 onboarding cards', () => {
  const phase1 = screensForPhase(1);
  assert.equal(phase1.length, 19);
  assert.equal(phase1[0].slug, 'splash');
});