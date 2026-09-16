export const IDENTITY_TYPES = ['daughter', 'son', 'mother', 'father', 'family'];

/** Figma onboarding order and copy for the "I am a..." step. */
export const IDENTITY_ROLE_OPTIONS = [
  { id: 'mother', label: 'Mother', emoji: '👩' },
  { id: 'father', label: 'Father', emoji: '👨' },
  { id: 'daughter', label: 'Daughter', emoji: '👧' },
  { id: 'son', label: 'Son', emoji: '👦' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
];

export const CHILD_IDENTITIES = ['daughter', 'son'];
export const PARENT_IDENTITIES = ['mother', 'father'];

/** Figma onboarding list for the Faith & Spirituality step. */
export const RELIGION_ONBOARDING_OPTIONS = [
  { id: 'christianity', label: 'Christianity' },
  { id: 'islam', label: 'Islam' },
  { id: 'judaism', label: 'Judaism' },
  { id: 'hinduism', label: 'Hinduism' },
  { id: 'buddhism', label: 'Buddhism' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'open_to_all', label: 'No preference' },
  { id: 'other', label: 'Other' },
];

export const RELIGIONS = [
  'christianity',
  'islam',
  'judaism',
  'hinduism',
  'buddhism',
  'sikhism',
  'bahai',
  'jainism',
  'shinto',
  'taoism',
  'zoroastrianism',
  'atheist',
  'agnostic',
  'spiritual',
  'other',
  'open_to_all',
];

export const CONNECTION_TYPES = ['adopt', 'aymm', 'aymf'];
export const CONNECTION_STATUSES = ['pending', 'accepted', 'declined'];

export const NEWSFEED_CATEGORIES = ['family', 'holidays', 'stories', 'events', 'advice', 'other'];

export const REPORT_TYPES = ['profile', 'post', 'comment', 'message'];
export const REPORT_STATUSES = ['pending', 'reviewed', 'resolved'];

export const CONTACT_STATUSES = ['new', 'reviewed', 'resolved'];

export const IDENTITY_CHANGE_STATUSES = ['pending', 'approved', 'denied'];

export const FAMILY_VIBES = ['loud_house', 'church_mice'];

export const SEEKING_PARENT_FOR = [
  'birthdays',
  'holidays',
  'consolation',
  'mentorship',
  'home_cooked_meals',
  'real_life_visits',
];

export const PARENT_PURPOSES = [
  'someone_to_feed',
  'someone_to_love',
  'someone_to_complain_to',
  'holiday_hosting',
  'mentorship',
];

export const SIBLING_REASONS = [
  'holiday_meals',
  'game_nights',
  'mentorship',
  'belonging',
  'shared_interests',
];

export const PLACEHOLDER_AVATAR =
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80';

export const BIO_MIN_LENGTH = 100;

export const PROFILE_SETUP_STEPS = ['basics', 'role', 'bio'];

export const MESSAGES_TABS = [
  { id: 'open', label: 'Open' },
  { id: 'requests', label: 'Letter Requests' },
  { id: 'connections', label: 'Connections' },
];

export const NEWSFEED_TABS = [
  { id: 'recent', label: 'Recent' },
  { id: 'popular', label: 'Popular' },
  { id: 'category', label: 'Category' },
];

export const ADMIN_TABS = [
  { id: 'contacts', label: 'Contacts' },
  { id: 'identity', label: 'Identity' },
  { id: 'reports', label: 'Reports' },
  { id: 'users', label: 'Users' },
  { id: 'profiles', label: 'Profiles' },
  { id: 'posts', label: 'Posts' },
  { id: 'tables', label: 'Tables' },
];

export function labelForIdentity(type) {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function labelForReligion(id) {
  const match = RELIGION_ONBOARDING_OPTIONS.find((option) => option.id === id);
  if (match) return match.label;
  if (!id) return '';
  return id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ');
}
