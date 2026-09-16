/**
 * Staging screen map — app routes only (no Figma reference views).
 * Hub: https://aymm.app/screens
 */

export const STAGING_BASE = 'https://aymm.app';
export const STAGING_HUB = `${STAGING_BASE}/screens`;

export const SCREEN_CATALOG = [
  // Phase 1 — Onboarding (built)
  { id: 1, phase: 1, title: 'Splash', route: '/' },
  { id: 2, phase: 1, title: 'Welcome', route: '/Welcome' },
  { id: 3, phase: 1, title: 'Login', route: '/Login' },
  { id: 4, phase: 1, title: 'Register', route: '/Register' },
  { id: 5, phase: 1, title: 'Email Login', route: '/EmailLogin' },
  { id: 6, phase: 1, title: 'Phone Login', route: '/PhoneLogin' },
  { id: 7, phase: 1, title: 'OTP', route: '/OTP' },
  { id: 8, phase: 1, title: 'Upload Photo', route: '/ProfileSetup/upload-photo' },
  { id: 9, phase: 1, title: 'Basic Info', route: '/ProfileSetup/basic-info' },
  { id: 10, phase: 1, title: 'I Am A', route: '/ProfileSetup/iam-a' },
  { id: 11, phase: 1, title: 'Seeking A', route: '/ProfileSetup/seeking-a' },
  { id: 12, phase: 1, title: 'Religion', route: '/ProfileSetup/religion' },
  { id: 13, phase: 1, title: 'Questions', route: '/ProfileSetup/questions' },
  { id: 14, phase: 1, title: 'Bio', route: '/ProfileSetup/bio' },
  { id: 15, phase: 1, title: 'Review', route: '/ProfileSetup/review' },
  // Phase 3 — Community (built)
  { id: 16, phase: 3, title: 'Letters', route: '/Messages' },
  { id: 17, phase: 3, title: 'Family Tables', route: '/FamilyTables' },
  // Phase 4 — App shell (built)
  { id: 18, phase: 4, title: 'Home', route: '/Home' },
  { id: 19, phase: 4, title: 'My Profile', route: '/Profile' },
  { id: 20, phase: 4, title: 'Feed', route: '/Newsfeed' },
  { id: 21, phase: 4, title: 'Admin', route: '/AdminDashboard' },
  // Static
  { id: 22, phase: 4, title: 'About Us', route: '/AboutUs' },
  { id: 23, phase: 4, title: 'Privacy Policy', route: '/PrivacyPolicy' },
];

export const PHASE_LABELS = {
  1: 'Phase 1 — Onboarding',
  3: 'Phase 3 — Letters & Tables',
  4: 'Phase 4 — App',
};

export function stagingUrl(route) {
  if (route.startsWith('http')) return route;
  return `${STAGING_BASE}${route}`;
}
