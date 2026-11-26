import { isProductionBrandedHost, isRealAppPreviewForced, isStagingPreviewEnabled } from '@/lib/stagingPreview';

/** Client-side browse rail demo cards — design preview only, never on live aymm.app. */
export function shouldMergeBrowseDemoProfiles() {
  if (isRealAppPreviewForced()) return false;
  if (isProductionBrandedHost()) return false;
  return isStagingPreviewEnabled();
}