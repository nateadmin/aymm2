import { JOHNSON_TABLE } from './communityContent.js';

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

/** Same shape as Register Table + listing editor. */
export function registerFormFromTable(table) {
  return {
    username: table.hostUsername ?? '',
    address: table.address ?? '',
    phone: table.phone ?? '',
    details: table.about ?? '',
    seatsLeft: table.seatsLeft != null ? String(table.seatsLeft) : '',
    eventDateISO: table.eventDateISO ?? '',
    eventDate: table.eventDate ?? '',
    food: table.food ?? '',
    foodFull: table.foodFull ?? table.food ?? '',
    dietaryCertification: table.dietaryCertification ?? 'neither',
    guestExpectations: table.guestExpectations ?? '',
  };
}

export function isRegisterFormComplete(form) {
  return Boolean(
    form.username?.trim()
    && form.address?.trim()
    && form.phone?.trim()
    && form.details?.trim()
    && form.seatsLeft !== ''
    && form.eventDateISO
    && form.food?.trim()
    && form.guestExpectations?.trim(),
  );
}

export function tablePatchFromRegisterForm(form) {
  const seatsLeft = Number(form.seatsLeft);
  const usernameRaw = form.username?.trim() ?? '';
  const hostUsername = usernameRaw.startsWith('@') ? usernameRaw : (usernameRaw ? `@${usernameRaw}` : '');
  const tableLabel = usernameRaw.replace(/^@/, '');
  const address = form.address?.trim() ?? '';
  const eventDate = form.eventDate ?? '';
  const headlineParts = [eventDate, address].filter(Boolean);

  return {
    hostUsername,
    hostFamily: tableLabel ? `The ${tableLabel} Family` : undefined,
    name: tableLabel ? `The ${tableLabel} Table` : undefined,
    headline: headlineParts.length ? headlineParts.join(' · ') : undefined,
    address,
    phone: form.phone?.trim() ?? '',
    about: form.details?.trim() ?? '',
    seatsLeft: Number.isFinite(seatsLeft) ? seatsLeft : form.seatsLeft,
    eventDateISO: form.eventDateISO,
    eventDate,
    food: form.food,
    foodFull: form.food,
    dietaryCertification: form.dietaryCertification ?? 'neither',
    guestExpectations: form.guestExpectations?.trim() ?? '',
    guestCapacity: Number.isFinite(seatsLeft)
      ? `${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} available`
      : undefined,
  };
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