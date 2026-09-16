export function buildProfilePayload(form, { setupComplete = false, includeSetupComplete = false } = {}) {
  const payload = {
    display_name: form.display_name,
    age: form.age ? Number(form.age) : null,
    zipcode: form.zipcode || null,
    location: form.location || null,
    lat: form.lat,
    lon: form.lon,
    identity_type: form.identity_type,
    seeking_type: form.seeking_types?.[0] || null,
    seeking_types: form.seeking_types || [],
    religion: form.religion || null,
    religion_private: form.religion_private,
    profile_photos: form.profile_photos || [],
    intro_video_url: form.intro_video_url || null,
    real_life_visits: form.real_life_visits,
    seeking_for: form.seeking_for || [],
    grow_up_goal: form.grow_up_goal || null,
    working_towards: form.working_towards || null,
    favorite_foods: form.favorite_foods || null,
    hobbies: form.hobbies || null,
    last_book: form.last_book || null,
    last_movie: form.last_movie || null,
    favorite_childhood_memory: form.favorite_childhood_memory || null,
    has_biological_kids: form.has_biological_kids,
    enjoy_feeding_youth: form.enjoy_feeding_youth,
    can_host_visitors: form.can_host_visitors,
    favorite_books: form.favorite_books || null,
    myths_about_my_day: form.myths_about_my_day || null,
    if_you_were_my_kid: form.if_you_were_my_kid || null,
    family_name: form.family_name || null,
    sibling_count: form.sibling_count ? Number(form.sibling_count) : null,
    beds_available: form.beds_available ? Number(form.beds_available) : null,
    favorite_holidays: form.favorite_holidays || null,
    family_vibe: form.family_vibe || null,
    seeking_sibling_reasons: form.seeking_sibling_reasons || [],
    bio: form.bio || null,
    question_family_meaning: form.question_family_meaning || null,
    question_stay_in_touch: form.question_stay_in_touch || null,
    question_hoping_for: form.question_hoping_for || null,
  };

  if (includeSetupComplete) {
    payload.setup_complete = setupComplete;
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === '' || payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
}
