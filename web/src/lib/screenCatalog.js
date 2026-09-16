/**
 * Wireframe-faithful screen map (55 screens, 4 phases).
 * Staging index: https://aymm.app/screens
 */

export const STAGING_BASE = 'https://aymm.app';

export const SCREEN_CATALOG = [
  // Phase 1 — Onboarding
  { id: 1, phase: 1, slug: 'splash', title: 'Splash', frame: 'frame-01.png', route: '/', status: 'live' },
  { id: 2, phase: 1, slug: 'welcome', title: 'Welcome', frame: 'frame-02.png', route: '/Welcome', status: 'live' },
  { id: 3, phase: 1, slug: 'login', title: 'Login', frame: 'frame-03.png', route: '/Login', status: 'live' },
  { id: 4, phase: 1, slug: 'register', title: 'Register', frame: 'frame-04.png', route: '/Register', status: 'live' },
  { id: 5, phase: 1, slug: 'email-login', title: 'Email Login', frame: 'frame-05.png', route: '/EmailLogin', status: 'live' },
  { id: 6, phase: 1, slug: 'phone-login', title: 'Phone Login', frame: 'frame-06.png', route: '/PhoneLogin', status: 'live' },
  { id: 7, phase: 1, slug: 'otp', title: 'OTP', frame: 'frame-07.png', route: '/OTP', status: 'live' },
  { id: 8, phase: 1, slug: 'forgot-password', title: 'Forgot Password', frame: 'frame-08.png', route: '/screens/ref/forgot-password', status: 'reference' },
  { id: 9, phase: 1, slug: 'create-password', title: 'Create Password', frame: 'frame-09.png', route: '/screens/ref/create-password', status: 'reference' },
  { id: 10, phase: 1, slug: 'upload-photo', title: 'Upload Photo', frame: 'frame-10.png', route: '/ProfileSetup/upload-photo', status: 'partial' },
  { id: 11, phase: 1, slug: 'upload-video', title: 'Upload Video', frame: 'frame-11.png', route: '/screens/ref/upload-video', status: 'reference' },
  { id: 12, phase: 1, slug: 'basic-info', title: 'Basic Info', frame: 'frame-12.png', route: '/ProfileSetup/basic-info', status: 'partial' },
  { id: 13, phase: 1, slug: 'i-am-a', title: 'I Am A', frame: 'frame-13.png', route: '/ProfileSetup/iam-a', status: 'partial' },
  { id: 14, phase: 1, slug: 'seeking-a', title: 'Seeking A', frame: 'frame-14.png', route: '/ProfileSetup/seeking-a', status: 'partial' },
  { id: 15, phase: 1, slug: 'religion', title: 'Religion', frame: 'frame-15.png', route: '/ProfileSetup/religion', status: 'partial' },
  { id: 16, phase: 1, slug: 'questions', title: 'Questions', frame: 'frame-16.png', route: '/ProfileSetup/questions', status: 'partial' },
  { id: 17, phase: 1, slug: 'review', title: 'Review', frame: 'frame-17.png', route: '/ProfileSetup/review', status: 'partial' },
  { id: 18, phase: 1, slug: 'complete', title: 'Complete', frame: 'frame-18.png', route: '/screens/ref/complete', status: 'reference' },
  { id: 19, phase: 1, slug: 'onboarding-extra', title: 'Onboarding (extra)', frame: 'frame-19.png', route: '/screens/ref/onboarding-extra', status: 'reference' },
  // Phase 2 — Discovery & Connection
  { id: 20, phase: 2, slug: 'daughter-profile', title: 'Daughter Profile', frame: 'frame-20.png', route: '/screens/ref/daughter-profile', status: 'reference' },
  { id: 21, phase: 2, slug: 'mother-profile', title: 'Mother Profile', frame: 'frame-21.png', route: '/screens/ref/mother-profile', status: 'reference' },
  { id: 22, phase: 2, slug: 'family-profile', title: 'Family Profile', frame: 'frame-22.png', route: '/screens/ref/family-profile', status: 'reference' },
  { id: 23, phase: 2, slug: 'connection-success', title: 'Connection Success', frame: 'frame-23.png', route: '/screens/ref/connection-success', status: 'reference' },
  { id: 24, phase: 2, slug: 'seeking-parent-reasons', title: 'Seeking Parent Reasons', frame: 'frame-24.png', route: '/screens/ref/seeking-parent-reasons', status: 'reference' },
  { id: 25, phase: 2, slug: 'seeking-child-reasons', title: 'Seeking Child Reasons', frame: 'frame-25.png', route: '/screens/ref/seeking-child-reasons', status: 'reference' },
  { id: 26, phase: 2, slug: 'seeking-sibling-reasons', title: 'Seeking Sibling Reasons', frame: 'frame-26.png', route: '/screens/ref/seeking-sibling-reasons', status: 'reference' },
  { id: 27, phase: 2, slug: 'lifestyle-questions', title: 'Lifestyle Questions', frame: 'frame-27.png', route: '/screens/ref/lifestyle-questions', status: 'reference' },
  { id: 28, phase: 2, slug: 'personal-questions', title: 'Personal Questions', frame: 'frame-28.png', route: '/screens/ref/personal-questions', status: 'reference' },
  { id: 29, phase: 2, slug: 'family-questions', title: 'Family Questions', frame: 'frame-29.png', route: '/screens/ref/family-questions', status: 'reference' },
  { id: 30, phase: 2, slug: 'religion-info', title: 'Religion Info', frame: 'frame-30.png', route: '/screens/ref/religion-info', status: 'reference' },
  { id: 31, phase: 2, slug: 'recommend', title: 'Recommend', frame: 'frame-31.png', route: '/screens/ref/recommend', status: 'reference' },
  // Phase 3 — Community, Tables & Letters
  { id: 32, phase: 3, slug: 'letters-inbox', title: 'Letters Inbox', frame: 'frame-32.png', route: '/Messages', status: 'partial' },
  { id: 33, phase: 3, slug: 'message-requests', title: 'Message Requests', frame: 'frame-33.png', route: '/screens/ref/message-requests', status: 'reference' },
  { id: 34, phase: 3, slug: 'open-conversation', title: 'Open Conversation', frame: 'frame-34.png', route: '/screens/ref/open-conversation', status: 'reference' },
  { id: 35, phase: 3, slug: 'family-table-listing', title: 'Family Table Listing', frame: 'frame-35.png', route: '/FamilyTables', status: 'partial' },
  { id: 36, phase: 3, slug: 'family-table-details', title: 'Family Table Details', frame: 'frame-36.png', route: '/screens/ref/family-table-details', status: 'reference' },
  { id: 37, phase: 3, slug: 'request-join-table', title: 'Request to Join Table', frame: 'frame-37.png', route: '/screens/ref/request-join-table', status: 'reference' },
  { id: 38, phase: 3, slug: 'register-table', title: 'Register Table', frame: 'frame-38.png', route: '/screens/ref/register-table', status: 'reference' },
  { id: 39, phase: 3, slug: 'table-confirmation', title: 'Table Confirmation', frame: 'frame-39.png', route: '/screens/ref/table-confirmation', status: 'reference' },
  { id: 40, phase: 3, slug: 'previous-photos', title: 'Previous Photos', frame: 'frame-40.png', route: '/screens/ref/previous-photos', status: 'reference' },
  { id: 41, phase: 3, slug: 'event-reminders', title: 'Event Reminders', frame: 'frame-41.png', route: '/screens/ref/event-reminders', status: 'reference' },
  // Phase 4 — Full prototype
  { id: 42, phase: 4, slug: 'home', title: 'Home', frame: 'frame-42.png', route: '/Home', status: 'partial' },
  { id: 43, phase: 4, slug: 'settings', title: 'Settings', frame: 'frame-43.png', route: '/screens/ref/settings', status: 'reference' },
  { id: 44, phase: 4, slug: 'my-profile', title: 'My Profile', frame: 'frame-44.png', route: '/Profile', status: 'partial' },
  { id: 45, phase: 4, slug: 'profile-carousel', title: 'Profile Carousel', frame: 'frame-45.png', route: '/screens/ref/profile-carousel', status: 'reference' },
  { id: 46, phase: 4, slug: 'adoption-approved', title: 'Adoption Approved', frame: 'frame-46.png', route: '/screens/ref/adoption-approved', status: 'reference' },
  { id: 47, phase: 4, slug: 'aymf-family-match', title: 'AYMF Family Match', frame: 'frame-47.png', route: '/screens/ref/aymf-family-match', status: 'reference' },
  { id: 48, phase: 4, slug: 'message-request-detail', title: 'Message Request Detail', frame: 'frame-48.png', route: '/screens/ref/message-request-detail', status: 'reference' },
  { id: 49, phase: 4, slug: 'compatibility-challenge', title: 'Compatibility Challenge', frame: 'frame-49.png', route: '/screens/ref/compatibility-challenge', status: 'reference' },
  { id: 50, phase: 4, slug: 'religion-selector', title: 'Religion Selector', frame: 'frame-50.png', route: '/screens/ref/religion-selector', status: 'reference' },
  { id: 51, phase: 4, slug: 'seeking-qs-parent', title: 'Seeking Qs (Parent)', frame: 'frame-51.png', route: '/screens/ref/seeking-qs-parent', status: 'reference' },
  { id: 52, phase: 4, slug: 'seeking-qs-child', title: 'Seeking Qs (Child)', frame: 'frame-52.png', route: '/screens/ref/seeking-qs-child', status: 'reference' },
  { id: 53, phase: 4, slug: 'seeking-qs-sibling', title: 'Seeking Qs (Sibling)', frame: 'frame-53.png', route: '/screens/ref/seeking-qs-sibling', status: 'reference' },
  { id: 54, phase: 4, slug: 'username-validation', title: 'Username Validation', frame: 'frame-54.png', route: '/screens/ref/username-validation', status: 'reference' },
  { id: 55, phase: 4, slug: 'register-table-full', title: 'Register Table (Full)', frame: 'frame-55.png', route: '/screens/ref/register-table-full', status: 'reference' },
];

export const PHASE_LABELS = {
  1: 'Phase 1 — Onboarding',
  2: 'Phase 2 — Discovery & Connection',
  3: 'Phase 3 — Community, Tables & Letters',
  4: 'Phase 4 — Full Prototype',
};

export function getScreenBySlug(slug) {
  return SCREEN_CATALOG.find((s) => s.slug === slug);
}

export function getScreenById(id) {
  return SCREEN_CATALOG.find((s) => s.id === Number(id));
}

export function stagingUrl(route) {
  if (route.startsWith('http')) return route;
  return `${STAGING_BASE}${route}`;
}

export function frameImageUrl(frame) {
  return `/design-reference/${frame}`;
}
