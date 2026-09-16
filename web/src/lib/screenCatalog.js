/**
 * Wireframe screen map (55 screens, 4 phases).
 * Staging hub: https://aymm.app/screens?preview=1
 */

export const STAGING_BASE = 'https://aymm.app';
export const STAGING_HUB = `${STAGING_BASE}/screens?preview=1&mobile=1`;
export const STAGING_MOBILE_LOGIN = `${STAGING_BASE}/EmailLogin?preview=1&mobile=1`;

export const SCREEN_CATALOG = [
  // Phase 1 — Onboarding
  { id: 1, phase: 1, slug: 'splash', title: 'Splash', route: '/', status: 'live' },
  { id: 2, phase: 1, slug: 'welcome', title: 'Welcome', route: '/Welcome', status: 'live' },
  { id: 3, phase: 1, slug: 'login', title: 'Login', route: '/Login', status: 'live' },
  { id: 4, phase: 1, slug: 'register', title: 'Register', route: '/Register', status: 'live' },
  { id: 5, phase: 1, slug: 'email-login', title: 'Email Login', route: '/EmailLogin', status: 'live' },
  { id: 6, phase: 1, slug: 'phone-login', title: 'Phone Login', route: '/PhoneLogin', status: 'live' },
  { id: 7, phase: 1, slug: 'otp', title: 'OTP', route: '/OTP', status: 'live' },
  { id: 8, phase: 1, slug: 'forgot-password', title: 'Forgot Password', route: '/preview/forgot-password', status: 'frame' },
  { id: 9, phase: 1, slug: 'create-password', title: 'Create Password', route: '/preview/create-password', status: 'frame' },
  { id: 10, phase: 1, slug: 'upload-photo', title: 'Upload Photo', route: '/ProfileSetup/upload-photo', status: 'partial' },
  { id: 11, phase: 1, slug: 'upload-video', title: 'Upload Video', route: '/preview/upload-video', status: 'frame' },
  { id: 12, phase: 1, slug: 'basic-info', title: 'Basic Info', route: '/ProfileSetup/basic-info', status: 'partial' },
  { id: 13, phase: 1, slug: 'i-am-a', title: 'I Am A', route: '/ProfileSetup/iam-a', status: 'partial' },
  { id: 14, phase: 1, slug: 'seeking-a', title: 'Seeking A', route: '/ProfileSetup/seeking-a', status: 'partial' },
  { id: 15, phase: 1, slug: 'religion', title: 'Religion', route: '/ProfileSetup/religion', status: 'partial' },
  { id: 16, phase: 1, slug: 'questions', title: 'Questions', route: '/ProfileSetup/questions', status: 'partial' },
  { id: 17, phase: 1, slug: 'review', title: 'Review', route: '/ProfileSetup/review', status: 'partial' },
  { id: 18, phase: 1, slug: 'complete', title: 'Complete', route: '/preview/complete', status: 'frame' },
  { id: 19, phase: 1, slug: 'onboarding-extra', title: 'Onboarding (extra)', route: '/preview/onboarding-extra', status: 'frame' },
  // Phase 2 — Discovery & Connection
  { id: 20, phase: 2, slug: 'daughter-profile', title: 'Daughter Profile', route: '/preview/daughter-profile', status: 'frame' },
  { id: 21, phase: 2, slug: 'mother-profile', title: 'Mother Profile', route: '/preview/mother-profile', status: 'frame' },
  { id: 22, phase: 2, slug: 'family-profile', title: 'Family Profile', route: '/preview/family-profile', status: 'frame' },
  { id: 23, phase: 2, slug: 'connection-success', title: 'Connection Success', route: '/preview/connection-success', status: 'frame' },
  { id: 24, phase: 2, slug: 'seeking-parent-reasons', title: 'Seeking Parent Reasons', route: '/preview/seeking-parent-reasons', status: 'frame' },
  { id: 25, phase: 2, slug: 'seeking-child-reasons', title: 'Seeking Child Reasons', route: '/preview/seeking-child-reasons', status: 'frame' },
  { id: 26, phase: 2, slug: 'seeking-sibling-reasons', title: 'Seeking Sibling Reasons', route: '/preview/seeking-sibling-reasons', status: 'frame' },
  { id: 27, phase: 2, slug: 'lifestyle-questions', title: 'Lifestyle Questions', route: '/preview/lifestyle-questions', status: 'frame' },
  { id: 28, phase: 2, slug: 'personal-questions', title: 'Personal Questions', route: '/preview/personal-questions', status: 'frame' },
  { id: 29, phase: 2, slug: 'family-questions', title: 'Family Questions', route: '/preview/family-questions', status: 'frame' },
  { id: 30, phase: 2, slug: 'religion-info', title: 'Religion Info', route: '/preview/religion-info', status: 'frame' },
  { id: 31, phase: 2, slug: 'recommend', title: 'Recommend', route: '/preview/recommend', status: 'frame' },
  // Phase 3 — Community, Tables & Letters
  { id: 32, phase: 3, slug: 'letters-inbox', title: 'Letters Inbox', route: '/Messages', status: 'partial' },
  { id: 33, phase: 3, slug: 'message-requests', title: 'Message Requests', route: '/preview/message-requests', status: 'frame' },
  { id: 34, phase: 3, slug: 'open-conversation', title: 'Open Conversation', route: '/preview/open-conversation', status: 'frame' },
  { id: 35, phase: 3, slug: 'family-table-listing', title: 'Family Table Listing', route: '/FamilyTables', status: 'partial' },
  { id: 36, phase: 3, slug: 'family-table-details', title: 'Family Table Details', route: '/preview/family-table-details', status: 'frame' },
  { id: 37, phase: 3, slug: 'request-join-table', title: 'Request to Join Table', route: '/preview/request-join-table', status: 'frame' },
  { id: 38, phase: 3, slug: 'register-table', title: 'Register Table', route: '/preview/register-table', status: 'frame' },
  { id: 39, phase: 3, slug: 'table-confirmation', title: 'Table Confirmation', route: '/preview/table-confirmation', status: 'frame' },
  { id: 40, phase: 3, slug: 'previous-photos', title: 'Previous Photos', route: '/preview/previous-photos', status: 'frame' },
  { id: 41, phase: 3, slug: 'event-reminders', title: 'Event Reminders', route: '/preview/event-reminders', status: 'frame' },
  // Phase 4 — Full prototype
  { id: 42, phase: 4, slug: 'home', title: 'Home', route: '/Home', status: 'partial' },
  { id: 43, phase: 4, slug: 'settings', title: 'Settings', route: '/preview/settings', status: 'frame' },
  { id: 44, phase: 4, slug: 'my-profile', title: 'My Profile', route: '/Profile', status: 'partial' },
  { id: 45, phase: 4, slug: 'profile-carousel', title: 'Profile Carousel', route: '/preview/profile-carousel', status: 'frame' },
  { id: 46, phase: 4, slug: 'adoption-approved', title: 'Adoption Approved', route: '/preview/adoption-approved', status: 'frame' },
  { id: 47, phase: 4, slug: 'aymf-family-match', title: 'AYMF Family Match', route: '/preview/aymf-family-match', status: 'frame' },
  { id: 48, phase: 4, slug: 'message-request-detail', title: 'Message Request Detail', route: '/preview/message-request-detail', status: 'frame' },
  { id: 49, phase: 4, slug: 'compatibility-challenge', title: 'Compatibility Challenge', route: '/preview/compatibility-challenge', status: 'frame' },
  { id: 50, phase: 4, slug: 'religion-selector', title: 'Religion Selector', route: '/preview/religion-selector', status: 'frame' },
  { id: 51, phase: 4, slug: 'seeking-qs-parent', title: 'Seeking Qs (Parent)', route: '/preview/seeking-qs-parent', status: 'frame' },
  { id: 52, phase: 4, slug: 'seeking-qs-child', title: 'Seeking Qs (Child)', route: '/preview/seeking-qs-child', status: 'frame' },
  { id: 53, phase: 4, slug: 'seeking-qs-sibling', title: 'Seeking Qs (Sibling)', route: '/preview/seeking-qs-sibling', status: 'frame' },
  { id: 54, phase: 4, slug: 'username-validation', title: 'Username Validation', route: '/preview/username-validation', status: 'frame' },
  { id: 55, phase: 4, slug: 'register-table-full', title: 'Register Table (Full)', route: '/preview/register-table-full', status: 'frame' },
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

export function frameImageUrl(screen) {
  const id = typeof screen === 'number' ? screen : screen.id;
  return `/design-frames/frame-${String(id).padStart(2, '0')}.png`;
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

export function stagingUrl(route, { mobile = true } = {}) {
  if (route.startsWith('http')) return route;
  let path = `${STAGING_BASE}${route}`;
  path = appendQuery(path, 'preview', '1');
  if (mobile) path = appendQuery(path, 'mobile', '1');
  return path;
}

export function withPreviewQuery(route, { mobile = true } = {}) {
  let path = appendQuery(route, 'preview', '1');
  if (mobile) path = appendQuery(path, 'mobile', '1');
  return path;
}
