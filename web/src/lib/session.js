import { isMockDiscoveryEmail } from './mockDiscoveryAccounts.js';
import { isMockAuthEnabled, isMockToken, MOCK_LOGIN_EMAIL } from './mockAuth.js';
import { isRealAppPreviewForced, isStagingPreviewEnabled } from './stagingPreview.js';

const SESSION_TOKEN_KEY = 'aymm_session_token';

function readSessionToken() {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Built “Home” screen in the screen catalog (frame #42). */
export const DESIGN_HOME_ROUTE = '/Prototype/home';

export function hasCompletedProfile(profile) {
  return Boolean(profile?.setup_complete);
}

function sessionEmail(session) {
  return (session?.user?.email || session?.profile?.user_email || '').trim().toLowerCase();
}

function isDemoReviewSession(session) {
  return sessionEmail(session) === MOCK_LOGIN_EMAIL;
}

function isMockDiscoverySession(session) {
  return isMockDiscoveryEmail(sessionEmail(session));
}

export function shouldUseDesignReviewShell(session = {}) {
  if (isDemoReviewSession(session)) return true;
  if (isMockDiscoverySession(session)) return false;

  const token = session.token ?? readSessionToken();
  const completed = hasCompletedProfile(session?.profile) || Boolean(session?.hasProfile);
  const email = (session?.user?.email || session?.profile?.user_email || '').trim();
  if (completed && email) {
    if (!isMockToken(token)) return false;
    if (isRealAppPreviewForced() || !isMockAuthEnabled()) return false;
  }
  return isStagingPreviewEnabled() || isMockAuthEnabled();
}

function shouldUseDesignHome(session) {
  return shouldUseDesignReviewShell(session);
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
