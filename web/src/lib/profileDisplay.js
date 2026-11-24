import { formatLabel } from './format.js';
import { labelForIdentity } from './constants.js';

export function formatProfileLocation(profile) {
  const parts = [profile?.city, profile?.state].filter(Boolean);
  if (parts.length) return parts.join(', ');
  if (profile?.location) return profile.location;
  if (profile?.zipcode) return profile.zipcode;
  return '';
}

export function profileIdentityMeta(profile) {
  const role = labelForIdentity(profile?.identity_type) || 'Member';
  const location = formatProfileLocation(profile);
  return location ? `${role} · ${location}` : role;
}

export function buildMyProfileAnswerRows(profile) {
  const seeking = profile?.seeking_types?.length
    ? profile.seeking_types.map(labelForIdentity).join(', ')
    : '—';
  const faith = profile?.religion_private
    ? 'Private'
    : (formatLabel(profile?.religion) || '—');
  const location = formatProfileLocation(profile) || '—';

  return [
    { label: 'Seeking', value: seeking },
    { label: 'Faith', value: faith },
    { label: 'Location', value: location },
  ];
}