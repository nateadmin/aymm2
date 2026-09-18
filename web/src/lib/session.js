export function hasCompletedProfile(profile) {
  return Boolean(profile?.setup_complete);
}

export function getPostAuthPath(session) {
  return hasCompletedProfile(session?.profile) || session?.hasProfile
    ? '/Home'
    : '/ProfileSetup/upload-photo';
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
