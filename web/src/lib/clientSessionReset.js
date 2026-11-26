import { queryClient } from '@/lib/queryClient';
import { clearMockSession } from '@/lib/mockAuth';

const REACTIONS_KEY = 'aymm_reactions';
const COMMUNITY_TABLE_LISTING_KEY = 'aymm.community.familyTableListing';

/** Browser-only data that must not follow the next signed-in user. */
export function clearEphemeralUserData() {
  clearMockSession();
  try {
    localStorage.removeItem(REACTIONS_KEY);
  } catch {
    // ignore
  }
  try {
    sessionStorage.removeItem(COMMUNITY_TABLE_LISTING_KEY);
  } catch {
    // ignore
  }
}

/** Full client reset when an account session ends (logout or account switch). */
export async function clearClientCaches() {
  clearEphemeralUserData();
  await queryClient.clear();
}