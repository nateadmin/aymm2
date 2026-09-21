import { isStagingPreviewEnabled } from './stagingPreview.js';

export function hasCompletedProfile(profile) {
  return Boolean(profile?.setup_complete);
}

export function getPostAuthPath(session) {
  const complete = hasCompletedProfile(session?.profile) || session?.hasProfile;
  if (!complete) return '/ProfileSetup/upload-photo';
  if (isStagingPreviewEnabled()) return '/Prototype/home';
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
