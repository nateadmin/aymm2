import {
  DAUGHTER_PROFILE,
  FAMILY_PROFILE,
  MOTHER_PROFILE,
} from './discoveryProfiles.js';

/** Shared password for all Phase 2 mock personas (mock auth / preview=1 only). */
export const MOCK_DISCOVERY_PASSWORD = 'DemoPass123';

function toBrowseProfile(fixture, email, extra = {}) {
  return {
    id: `mock-${email.split('@')[0]}`,
    user_email: email,
    display_name: fixture.display_name,
    age: fixture.age ?? null,
    location: fixture.location,
    identity_type: fixture.identity_type,
    religion: fixture.religion || 'open_to_all',
    religion_private: false,
    seeking_types: extra.seeking_types || ['mother', 'father', 'family'],
    seeking_type: extra.seeking_type || null,
    bio: fixture.bio,
    profile_photos: fixture.profile_photos || [],
    setup_complete: true,
    real_life_visits: false,
    lat: extra.lat ?? null,
    lon: extra.lon ?? null,
  };
}

/** Logins for Discovery & Connection testing (in-memory; requires preview=1, not preview=0). */
export const MOCK_DISCOVERY_ACCOUNTS = {
  'daughter.demo@aymm.test': {
    label: 'Daughter (Sarah)',
    profile: toBrowseProfile(DAUGHTER_PROFILE, 'daughter.demo@aymm.test', {
      seeking_types: ['mother', 'father'],
      seeking_type: 'mother',
    }),
  },
  'mother.demo@aymm.test': {
    label: 'Mother (Linda)',
    profile: toBrowseProfile(MOTHER_PROFILE, 'mother.demo@aymm.test', {
      seeking_types: ['daughter', 'son'],
      seeking_type: 'daughter',
    }),
  },
  'father.demo@aymm.test': {
    label: 'Father (James)',
    profile: {
      id: 'mock-father-demo',
      user_email: 'father.demo@aymm.test',
      display_name: 'James',
      age: 55,
      location: 'Atlanta, GA',
      identity_type: 'father',
      religion: 'christianity',
      religion_private: false,
      seeking_types: ['daughter', 'son'],
      seeking_type: 'son',
      bio:
        'Father of two grown kids. I have time, patience, and a lot of life lessons to share. I love coaching, cooking on the grill, and showing up when it matters.',
      profile_photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
      ],
      setup_complete: true,
      real_life_visits: false,
      lat: null,
      lon: null,
    },
  },
  'family.demo@aymm.test': {
    label: 'Family (Martinez)',
    profile: toBrowseProfile(FAMILY_PROFILE, 'family.demo@aymm.test', {
      seeking_types: ['daughter', 'son'],
      seeking_type: 'daughter',
    }),
  },
};

export function isMockDiscoveryEmail(email) {
  if (!email) return false;
  return Boolean(MOCK_DISCOVERY_ACCOUNTS[email.trim().toLowerCase()]);
}

export function getMockDiscoveryAccount(email) {
  if (!email) return null;
  return MOCK_DISCOVERY_ACCOUNTS[email.trim().toLowerCase()] ?? null;
}

export function listMockDiscoveryBrowseProfiles(excludeEmail) {
  return Object.entries(MOCK_DISCOVERY_ACCOUNTS)
    .filter(([email]) => email !== excludeEmail?.trim().toLowerCase())
    .map(([, entry]) => entry.profile);
}

export const MOCK_DISCOVERY_ACCOUNT_LIST = Object.entries(MOCK_DISCOVERY_ACCOUNTS).map(
  ([email, entry]) => ({
    email,
    password: MOCK_DISCOVERY_PASSWORD,
    label: entry.label,
  }),
);