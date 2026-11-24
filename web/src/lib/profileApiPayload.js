/**
 * Columns added in server migration 004. Older production DBs reject them on INSERT/UPDATE.
 * Draft saves omit them until the API is migrated; values stay in local onboarding draft.
 */
export const DEFERRED_PROFILE_API_FIELDS = [
  'intro_video_url',
  'question_family_meaning',
  'question_stay_in_touch',
  'question_hoping_for',
];

export function profilePayloadForApi(payload, { includeDeferred = false } = {}) {
  if (includeDeferred) return payload;
  const next = { ...payload };
  for (const key of DEFERRED_PROFILE_API_FIELDS) {
    delete next[key];
  }
  return next;
}

export function pickDeferredProfilePayload(payload) {
  const next = {};
  for (const key of DEFERRED_PROFILE_API_FIELDS) {
    const value = payload[key];
    if (value !== '' && value !== undefined && value !== null) {
      next[key] = value;
    }
  }
  return next;
}