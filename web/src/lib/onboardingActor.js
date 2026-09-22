import { isStagingPreviewEnabled } from '@/lib/stagingPreview';

export const PREVIEW_GUEST_EMAIL = 'preview-guest@aymm.local';

/** Email used for onboarding draft storage (logged-in user or preview guest). */
export function getOnboardingActorEmail(userEmail) {
  if (userEmail) return userEmail;
  if (isStagingPreviewEnabled()) return PREVIEW_GUEST_EMAIL;
  return null;
}

export function isPreviewOnlyOnboarding(userEmail) {
  return !userEmail && isStagingPreviewEnabled();
}
