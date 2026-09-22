import { isMockAuthEnabled, MOCK_LOGIN_EMAIL } from './mockAuth.js';
import { isStagingPreviewEnabled } from './stagingPreview.js';

/** Built “Home” screen in the screen catalog (frame #42). */
export const DESIGN_HOME_ROUTE = '/Prototype/home';

export function hasCompletedProfile(profile) {
  return Boolean(profile?.setup_complete);
}

function isDemoReviewSession(session) {
  const email = (session?.user?.email || session?.profile?.user_email || '').trim().toLowerCase();
  return email === MOCK_LOGIN_EMAIL;
}

function shouldUseDesignHome(session) {
  return (
    isStagingPreviewEnabled()
    || isMockAuthEnabled()
    || isDemoReviewSession(session)
  );
}

export function getPostAuthPath(session) {
  const complete = hasCompletedProfile(session?.profile) || session?.hasProfile;
  if (!complete) return '/ProfileSetup/upload-photo';
  if (shouldUseDesignHome(session)) return DESIGN_HOME_ROUTE;
  return '/Home';
}

export function isOnboardingEntryPath(pathname) {
  return pathname.endsWith('/upload-photo')
    || pathname.endsWith('/upload-video')
    || pathname.endsWith('/ProfileSetup');
}

export function isProfileEditPath(pathname) {
  return pathname.startsWith('/ProfileSetup/') && !isOnboardingEntryPath(pathname);
}

export function mergeProfileState(previous, next, { preserveSetupComplete = true } = {}) {
  if (!next) return previous;
  const merged = { ...previous, ...next };
  if (preserveSetupComplete && previous?.setup_complete && !next.setup_complete) {
    merged.setup_complete = true;
  }
  return merged;
}
