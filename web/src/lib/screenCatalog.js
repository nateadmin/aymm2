/**
 * Wireframe screen map (55 screens, 4 phases).
 * Staging hub: https://aymm.app/screens?preview=1
 */

export const STAGING_BASE = 'https://aymm.app';
export const STAGING_HUB = `${STAGING_BASE}/screens?preview=1&mobile=1`;
export const STAGING_DEVICE_HUB = `${STAGING_BASE}/Welcome?preview=1&mobile=1&native=1`;
export const STAGING_MOBILE_LOGIN = `${STAGING_BASE}/EmailLogin?preview=1&mobile=1&native=1`;

export const SCREEN_CATALOG = [
  // Phase 1 — Onboarding
  { id: 1, phase: 1, slug: 'splash', title: 'Splash', route: '/', status: 'live' },
  { id: 2, phase: 1, slug: 'welcome', title: 'Welcome', route: '/Welcome', status: 'live' },
  { id: 3, phase: 1, slug: 'login', title: 'Login', route: '/Login', status: 'live' },
  { id: 4, phase: 1, slug: 'register', title: 'Register', route: '/Register', status: 'live' },
  { id: 5, phase: 1, slug: 'email-login', title: 'Email Login', route: '/EmailLogin', status: 'live' },
  { id: 6, phase: 1, slug: 'phone-login', title: 'Phone Login', route: '/PhoneLogin', status: 'live' },
  { id: 7, phase: 1, slug: 'otp', title: 'OTP', route: '/OTP', status: 'live' },
  { id: 8, phase: 1, slug: 'forgot-password', title: 'Forgot Password', route: '/ForgotPassword', status: 'live' },
  { id: 9, phase: 1, slug: 'create-password', title: 'Create Password', route: '/CreatePassword', status: 'live' },
  { id: 10, phase: 1, slug: 'upload-photo', title: 'Upload Photo', route: '/ProfileSetup/upload-photo', status: 'live' },
  { id: 11, phase: 1, slug: 'upload-video', title: 'Upload Video', route: '/ProfileSetup/upload-video', status: 'live' },
  { id: 12, phase: 1, slug: 'basic-info', title: 'Basic Info', route: '/ProfileSetup/basic-info', status: 'live' },
  { id: 13, phase: 1, slug: 'i-am-a', title: 'I Am A', route: '/ProfileSetup/iam-a', status: 'live' },
  { id: 14, phase: 1, slug: 'seeking-a', title: 'Seeking A', route: '/ProfileSetup/seeking-a', status: 'live' },
  { id: 15, phase: 1, slug: 'religion', title: 'Religion', route: '/ProfileSetup/religion', status: 'live' },
  { id: 16, phase: 1, slug: 'questions', title: 'Questions', route: '/ProfileSetup/questions', status: 'live' },
  { id: 17, phase: 1, slug: 'review', title: 'Review', route: '/ProfileSetup/review', status: 'live' },
  { id: 18, phase: 1, slug: 'complete', title: 'Complete', route: '/ProfileSetup/complete', status: 'live' },
  { id: 19, phase: 1, slug: 'onboarding-extra', title: 'Onboarding (extra)', route: '/preview/onboarding-extra', status: 'frame' },
  // Phase 2 — Discovery & Connection
  { id: 20, phase: 2, slug: 'daughter-profile', title: 'Daughter Profile', route: '/Discovery/daughter-profile', status: 'live' },
  { id: 21, phase: 2, slug: 'mother-profile', title: 'Mother Profile', route: '/Discovery/mother-profile', status: 'live' },
  { id: 22, phase: 2, slug: 'family-profile', title: 'Family Profile', route: '/Discovery/family-profile', status: 'live' },
  { id: 23, phase: 2, slug: 'connection-success', title: 'Connection Success', route: '/Discovery/connection-success', status: 'live' },
  { id: 24, phase: 2, slug: 'seeking-parent-reasons', title: 'Seeking Parent Reasons', route: '/Discovery/seeking-parent-reasons', status: 'live' },
  { id: 25, phase: 2, slug: 'seeking-child-reasons', title: 'Seeking Child Reasons', route: '/Discovery/seeking-child-reasons', status: 'live' },
  { id: 26, phase: 2, slug: 'seeking-sibling-reasons', title: 'Seeking Sibling Reasons', route: '/Discovery/seeking-sibling-reasons', status: 'live' },
  { id: 27, phase: 2, slug: 'lifestyle-questions', title: 'Lifestyle Questions', route: '/Discovery/lifestyle-questions', status: 'live' },
  { id: 28, phase: 2, slug: 'personal-questions', title: 'Personal Questions', route: '/Discovery/personal-questions', status: 'live' },
  { id: 29, phase: 2, slug: 'family-questions', title: 'Family Questions', route: '/Discovery/family-questions', status: 'live' },
  { id: 30, phase: 2, slug: 'religion-info', title: 'Religion Info', route: '/Discovery/religion-info', status: 'live' },
  { id: 31, phase: 2, slug: 'recommend', title: 'Recommend', route: '/Discovery/recommend', status: 'live' },
  // Phase 3 — Community, Tables & Letters
  { id: 32, phase: 3, slug: 'letters-inbox', title: 'Letters Inbox', route: '/Community/letters-inbox', status: 'live' },
  { id: 33, phase: 3, slug: 'message-requests', title: 'Message Requests', route: '/Community/message-requests', status: 'live' },
  { id: 34, phase: 3, slug: 'open-conversation', title: 'Open Conversation', route: '/Community/open-conversation', status: 'live' },
  { id: 35, phase: 3, slug: 'family-table-listing', title: 'Family Table Listing', route: '/Community/family-table-listing', status: 'live' },
  { id: 36, phase: 3, slug: 'family-table-details', title: 'Family Table Details', route: '/Community/family-table-details', status: 'live' },
  { id: 37, phase: 3, slug: 'request-join-table', title: 'Request to Join Table', route: '/Community/request-join-table', status: 'live' },
  { id: 38, phase: 3, slug: 'register-table', title: 'Register Table', route: '/Community/register-table', status: 'live' },
  { id: 39, phase: 3, slug: 'table-confirmation', title: 'Table Confirmation', route: '/Community/table-confirmation', status: 'live' },
  { id: 40, phase: 3, slug: 'previous-photos', title: 'Previous Photos', route: '/Community/previous-photos', status: 'live' },
  { id: 41, phase: 3, slug: 'event-reminders', title: 'Event Reminders', route: '/Community/event-reminders', status: 'live' },
  // Phase 4 — Full prototype
  { id: 42, phase: 4, slug: 'home', title: 'Home', route: '/Prototype/home', status: 'live' },
  { id: 43, phase: 4, slug: 'settings', title: 'Settings', route: '/Prototype/settings', status: 'live' },
  { id: 44, phase: 4, slug: 'my-profile', title: 'My Profile', route: '/Prototype/my-profile', status: 'live' },
  { id: 45, phase: 4, slug: 'profile-carousel', title: 'Profile Carousel', route: '/Prototype/profile-carousel', status: 'live' },
  { id: 46, phase: 4, slug: 'adoption-approved', title: 'Adoption Approved', route: '/Prototype/adoption-approved', status: 'live' },
  { id: 47, phase: 4, slug: 'aymm-family-match', title: 'AYMM Family Match', route: '/Prototype/aymm-family-match', status: 'live' },
  { id: 48, phase: 4, slug: 'message-request-detail', title: 'Message Request Detail', route: '/Prototype/message-request-detail', status: 'live' },
  { id: 49, phase: 4, slug: 'compatibility-challenge', title: 'Compatibility Challenge', route: '/Prototype/compatibility-challenge', status: 'live' },
  { id: 50, phase: 4, slug: 'religion-selector', title: 'Religion Selector', route: '/Prototype/religion-selector', status: 'live' },
  { id: 51, phase: 4, slug: 'seeking-qs-parent', title: 'Seeking Qs (Parent)', route: '/Prototype/seeking-qs-parent', status: 'live' },
  { id: 52, phase: 4, slug: 'seeking-qs-child', title: 'Seeking Qs (Child)', route: '/Prototype/seeking-qs-child', status: 'live' },
  { id: 53, phase: 4, slug: 'seeking-qs-sibling', title: 'Seeking Qs (Sibling)', route: '/Prototype/seeking-qs-sibling', status: 'live' },
  { id: 54, phase: 4, slug: 'username-validation', title: 'Username Validation', route: '/Prototype/username-validation', status: 'live' },
  { id: 55, phase: 4, slug: 'register-table-full', title: 'Register Table (Full)', route: '/Prototype/register-table-full', status: 'live' },
];

export const PHASE_LABELS = {
  1: 'Phase 1 — Onboarding',
  2: 'Phase 2 — Discovery & Connection',
  3: 'Phase 3 — Community, Tables & Letters',
  4: 'Phase 4 — Full Prototype',
};

export const STATUS_LABELS = {
  live: 'Built',
  partial: 'Partial',
  frame: 'Design frame',
};

/**
 * Map catalog screen id → Figma export filename.
 * Figma includes extra "uploaded" states (design-10, design-12) that are not
 * separate catalog screens. Screen 19 uses the photo-uploaded frame.
 */
const DESIGN_SOURCE_BY_SCREEN_ID = (() => {
  const skipped = new Set([10, 12]);
  const mapping = new Map();
  const pool = [];

  for (let index = 0; index <= 55; index += 1) {
    if (!skipped.has(index)) pool.push(index);
  }

  let poolIndex = 0;
  for (let screenId = 1; screenId <= 55; screenId += 1) {
    if (screenId === 19) {
      mapping.set(screenId, 10);
      continue;
    }
    mapping.set(screenId, pool[poolIndex]);
    poolIndex += 1;
  }

  return mapping;
})();

export function designSourcePath(screenId) {
  const sourceIndex = DESIGN_SOURCE_BY_SCREEN_ID.get(Number(screenId));
  if (sourceIndex === undefined) return null;
  if (sourceIndex === 0) return 'Replicate previous design.png';
  return `Replicate previous design-${sourceIndex}.png`;
}

/** Bump when live screen captures are regenerated (cache bust for staging thumbnails). */
export const SCREEN_CAPTURE_VERSION = '20250921-staging';

function assetBase() {
  const envBase = import.meta.env?.BASE_URL;
  return String(envBase || '/').replace(/\/?$/, '/');
}

export function frameImageUrl(screen) {
  const id = typeof screen === 'number' ? screen : screen.id;
  return `${assetBase()}design-frames/frame-${String(id).padStart(2, '0')}.png`;
}

/** Catalog thumbnail: live capture for built screens, Figma frame for design-only entries. */
export function screenThumbnailUrl(screen) {
  const item = typeof screen === 'number' ? getScreenById(screen) : screen;
  const id = item?.id ?? screen;
  const base = assetBase();
  const file = `frame-${String(id).padStart(2, '0')}.png`;
  if (item?.status === 'live' || item?.status === 'partial') {
    return `${base}screen-captures/${file}?v=${SCREEN_CAPTURE_VERSION}`;
  }
  return `${base}design-frames/${file}`;
}

export function screenCardPath(screen) {
  return `/screens/${screen.slug}`;
}

export function getScreenBySlug(slug) {
  return SCREEN_CATALOG.find((s) => s.slug === slug);
}

export function getScreenById(id) {
  return SCREEN_CATALOG.find((s) => s.id === Number(id));
}

function appendQuery(route, key, value) {
  if (route.includes(`${key}=`)) return route;
  return route.includes('?') ? `${route}&${key}=${value}` : `${route}?${key}=${value}`;
}

export function getReviewBase() {
  if (typeof window === 'undefined') return STAGING_BASE;
  const base = String(import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${window.location.origin}${base}`;
}

export function stagingUrl(route, { mobile = true } = {}) {
  if (route.startsWith('http')) return route;
  let path = `${getReviewBase()}${route}`;
  path = appendQuery(path, 'preview', '1');
  if (mobile === true) path = appendQuery(path, 'mobile', '1');
  if (mobile === false) path = appendQuery(path, 'mobile', '0');
  return path;
}

export function withPreviewQuery(route, { mobile = true } = {}) {
  let path = appendQuery(route, 'preview', '1');
  if (mobile === true) path = appendQuery(path, 'mobile', '1');
  if (mobile === false) path = appendQuery(path, 'mobile', '0');
  return path;
}
