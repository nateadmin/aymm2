export const ONBOARDING_STEPS = [
  { id: 'upload-photo', path: '/ProfileSetup/upload-photo', label: 'Photos' },
  { id: 'basic-info', path: '/ProfileSetup/basic-info', label: 'Basic info' },
  { id: 'iam-a', path: '/ProfileSetup/iam-a', label: 'I am a' },
  { id: 'seeking-a', path: '/ProfileSetup/seeking-a', label: 'Seeking a' },
  { id: 'religion', path: '/ProfileSetup/religion', label: 'Religion' },
  { id: 'questions', path: '/ProfileSetup/questions', label: 'Questions' },
  { id: 'bio', path: '/ProfileSetup/bio', label: 'Bio' },
  { id: 'review', path: '/ProfileSetup/review', label: 'Review' },
];

export const SEEKING_OPTIONS_FOR = {
  daughter: ['mother', 'father'],
  son: ['mother', 'father'],
  mother: ['daughter', 'son'],
  father: ['daughter', 'son'],
  family: [],
};

export const CHILD_SEEKING_FOR = [
  'Birthdays',
  'Holidays',
  'Consolation / hugs / advice',
  'Shoulder to cry on',
  'Someone to be proud of me',
];

export const PARENT_SEEKING_FOR = [
  'Birthdays',
  'Holidays',
  'Someone to talk to',
  'Someone to feed',
  'Someone to love',
  "Someone to hear my life's stories",
  'Someone to complain to',
];

export const SIBLING_REASONS = [
  'The more the merrier',
  'We want to feed you',
  'We have enough love to share',
  "'Rents away, kids want to play",
  'We want to trade in one of our siblings for you!',
];

export function getStepIndex(stepId) {
  return ONBOARDING_STEPS.findIndex((step) => step.id === stepId);
}

export function getNextStep(stepId) {
  const index = getStepIndex(stepId);
  return index >= 0 ? ONBOARDING_STEPS[index + 1] || null : null;
}

export function getPrevStep(stepId) {
  const index = getStepIndex(stepId);
  return index > 0 ? ONBOARDING_STEPS[index - 1] : null;
}

export function getDefaultForm() {
  return {
    display_name: '',
    age: '',
    zipcode: '',
    location: '',
    lat: null,
    lon: null,
    identity_type: '',
    seeking_type: '',
    seeking_types: [],
    religion: '',
    religion_private: false,
    profile_photos: [],
    real_life_visits: false,
    seeking_for: [],
    grow_up_goal: '',
    working_towards: '',
    favorite_foods: '',
    hobbies: '',
    last_book: '',
    last_movie: '',
    favorite_childhood_memory: '',
    has_biological_kids: false,
    enjoy_feeding_youth: false,
    can_host_visitors: false,
    favorite_books: '',
    myths_about_my_day: '',
    if_you_were_my_kid: '',
    family_name: '',
    sibling_count: '',
    beds_available: '',
    favorite_holidays: '',
    family_vibe: '',
    seeking_sibling_reasons: [],
    bio: '',
  };
}

export function draftStorageKey(email) {
  return `aymm_onboarding_draft_${email}`;
}

export function stepStorageKey(email) {
  return `aymm_onboarding_step_${email}`;
}
