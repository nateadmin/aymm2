/** Writable profile columns (must match migrations). Unknown keys are dropped. */
export const PROFILE_WRITABLE_COLUMNS = new Set([
  'display_name',
  'age',
  'location',
  'zipcode',
  'lat',
  'lon',
  'identity_type',
  'seeking_type',
  'seeking_types',
  'religion',
  'religion_private',
  'profile_photos',
  'intro_video_url',
  'bio',
  'real_life_visits',
  'seeking_for',
  'grow_up_goal',
  'working_towards',
  'favorite_foods',
  'hobbies',
  'last_book',
  'last_movie',
  'favorite_childhood_memory',
  'has_biological_kids',
  'enjoy_feeding_youth',
  'can_host_visitors',
  'favorite_books',
  'myths_about_my_day',
  'if_you_were_my_kid',
  'family_name',
  'sibling_count',
  'beds_available',
  'favorite_holidays',
  'family_vibe',
  'seeking_sibling_reasons',
  'question_family_meaning',
  'question_stay_in_touch',
  'question_hoping_for',
  'setup_complete',
]);

export function pickWritableProfileFields(body) {
  if (!body || typeof body !== 'object') return {};
  const picked = {};
  for (const [key, value] of Object.entries(body)) {
    if (PROFILE_WRITABLE_COLUMNS.has(key)) {
      picked[key] = value;
    }
  }
  return picked;
}