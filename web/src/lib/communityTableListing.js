import { JOHNSON_TABLE } from '@/lib/communityContent';

export const DIETARY_CERTIFICATION_OPTIONS = [
  { value: 'neither', label: 'Not kosher or halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'halal', label: 'Halal' },
];

const STORAGE_KEY = 'aymm.community.familyTableListing';
const UPDATE_EVENT = 'community-table-listing-updated';

export function formatDietaryCertification(value) {
  const match = DIETARY_CERTIFICATION_OPTIONS.find((item) => item.value === value);
  return match?.label || 'Not specified';
}

export function getDefaultCommunityTable() {
  return { ...JOHNSON_TABLE };
}

export function loadCommunityTableListing() {
  if (typeof window === 'undefined') return getDefaultCommunityTable();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultCommunityTable();
    return { ...getDefaultCommunityTable(), ...JSON.parse(raw) };
  } catch {
    return getDefaultCommunityTable();
  }
}

export function saveCommunityTableListing(patch) {
  const merged = { ...loadCommunityTableListing(), ...patch };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

export function emitCommunityTableListingUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
}

export function subscribeCommunityTableListing(listener) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener(loadCommunityTableListing());
  window.addEventListener(UPDATE_EVENT, handler);
  return () => window.removeEventListener(UPDATE_EVENT, handler);
}